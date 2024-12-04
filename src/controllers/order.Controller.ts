import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

export const bookOrder = async (req: Request, res: Response) => {
    const { publicID, productID, quantity } = req.body;

    if (!publicID || !productID || !quantity) {
        res.status(400).json({ message: "Invalid Request Body" });
        return;
    }

    try {
        const user = await User.findByPk(publicID);
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
    } catch (err) {
        console.error("Error creating the order:", err);
        res.status(500).json({ message: "Error saving the order" });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    const { orderID, new_quantity, new_productID, new_publicID } = req.body;

    if (!orderID) {
        res.status(400).json({ message: "Order ID is required" });
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
            order.status = "Cancelled",

                order.save()

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
