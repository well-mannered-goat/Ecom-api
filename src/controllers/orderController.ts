import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

export const bookOrder = async (req: Request, res: Response) => {
    const { publicID, productID, quantity } = req.body;

    if (!publicID || !productID || !quantity || quantity <= 0) {
        res.status(400).json({ message: "Invalid Request Body" });
        return;
    }

    try {
        const user = await User.findOne({
            where: {
                publicID
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const product = await Product.findOne({
            where: {
                productID
            }
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (product.stock_quantity < quantity) {
            res.status(400).json({ message: "Not enough stock available" });
            return;
        }

        const order = await Order.create({
            user_id: user.id,
            product_id: product.id,
            quantity,
            order_date: new Date(),
            status: "Booked"
        });

        res.status(200).json({
            message: "Order created successfully",
            Order: {
                orderID: order.orderID,
                user_id: user.publicID,
                productID: product.productID,
                quantity: order.quantity,
                order_date: order.order_date,
                status: order.status,
            },
        });

        product.stock_quantity -= quantity;
        await product.save();
    } catch (err) {
        console.error("Error creating the order:", err);
        res.status(500).json({ message: "Error saving the order" });
    }
};

export const successOrder = async (req: Request, res: Response) => {
    const { orderID } = req.body;

    try {
        const order = await Order.findOne({
            where: {
                orderID
            }
        })

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        order.status = "Completed";
        order.save();
        res.status(200).json({ message: "Order completed successfully" });
    }
    catch (err) {
        console.error("Error in successful order", err);
        res.status(500).json({ message: "Order was not successful" });
    }
}

export const failedOrder = async (req: Request, res: Response) => {
    const { orderID } = req.body;

    try {
        const order = await Order.findOne({
            where: {
                orderID
            }
        })

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        order.status = "Failed";
        await order.save();

        const product = await Product.findOne({ where: { id: order.product_id } });
        if (product) {
            product.stock_quantity += order.quantity;
            await product.save();
        }

        if (product) {
            product.stock_quantity = product.stock_quantity + 1;
        }

        res.status(200).json({ message: "Order marked as failed" });
    }
    catch (err) {
        console.error("Error in failing order", err);
        res.status(500).json({ message: "Failed to mark order as failed" });
    }
}


export const updateOrder = async (req: Request, res: Response) => {
    const { orderID, new_quantity, new_productID, new_publicID } = req.body;

    if (!orderID || (new_quantity && new_quantity <= 0)) {
        res.status(400).json({ message: "Invalid input for quantity or order ID" });
        return;
    }

    try {
        const order = await Order.findOne({
            where: {
                orderID
            }
        })

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        let user: User | null;
        let product: Product | null;

        if (new_publicID) {
            user = await User.findOne({
                where: {
                    publicID: new_publicID
                }
            });
            if (!user) {
                res.status(404).json({ message: "New user not found" });
                return;
            }

            if (new_productID) {
                product = await Product.findOne({
                    where: {
                        productID: new_productID
                    }
                });
                if (!product) {
                    res.status(404).json({ message: "New product not found" });
                    return;
                }

                order.quantity = new_quantity ?? order.quantity;
                order.user_id = user.id ?? order.user_id;
                order.product_id = product.id ?? order.product_id;

                await order.save();

                res.status(200).json({
                    message: "Order updated successfully",
                    Order: {
                        id: order.id,
                        user_id: user!.publicID,
                        productID: product!.productID,
                        quantity: order.quantity,
                        order_date: order.order_date,
                    },
                });
            }
        }

        res.status(404).json({ message: "User or Product not found" });
    } catch (err) {
        console.error("Error updating the order:", err);
        res.status(500).json({ message: "Error updating the order" });
    }
};


export const cancelOrder = async (req: Request, res: Response) => {
    const { orderID } = req.body;

    try {
        const order = await Order.findOne({
            where: {
                orderID
            }
        })

        if (order) {
            order.status = "Cancelled";

            order.save()

            const product = await Product.findOne({ where: { id: order.product_id } });
            if (product) {
                product.stock_quantity += order.quantity;
                await product.save();
            }

            res.status(200).json({ message: "Order successfully cancelled" })
            return
        }
        res.status(404).json({ message: "Order not found" });
    }
    catch (err) {
        console.error("Error cancelling order", err);
        res.status(500).json({ message: "Error cancelling order" });
    }
};
