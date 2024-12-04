import { Request, Response } from "express";
import { Op } from "sequelize";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

export const getRecentOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.findAll({
            where: {
                order_date: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["publicID", "name", "email", "phone_number"],
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ["productID", "name", "category", "price"],
                },
            ],
            attributes: ["orderID", "quantity", "order_date"],
        });

        const transformedOrders = orders.map(order => ({
            orderID: order.orderID,
            quantity: order.quantity,
            order_date: order.order_date,
            user: {
                publicID: order.user!.publicID,
                name: order.user!.name,
                email: order.user!.email,
                phone_number: order.user!.phone_number,
            },
            product: {
                productID: order.product!.productID,
                name: order.product!.name,
                category: order.product!.category,
                price: order.product!.price,
            },
        }));

        res.status(200).json(transformedOrders);
    } catch (err) {
        console.error("Error fetching recent orders:", err);
        res.status(500).json({ message: "Failed to fetch recent orders" });
    }
};

export const getUserOrders = async (req: Request, res: Response) => {
    const { publicID } = req.query;

    if (publicID && typeof publicID === "string") {
        try {
            const user = await User.findOne({
                where: {
                    publicID,
                }
            })
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const orders = await Order.findAll({
                where: {
                    user_id: user.id,
                },
                include: [
                    {
                        model: Product,
                        as: "product",
                        attributes: ["productID", "name", "category", "price"], // Exclude product_id, expose productID
                    },
                ],
                attributes: ["orderID", "quantity", "order_date"],
            });

            if (orders) {
                const transformedOrders = orders.map(order => ({
                    orderID: order.orderID,
                    quantity: order.quantity,
                    order_date: order.order_date,
                    product: {
                        productID: order.product!.productID,
                        name: order.product!.name,
                        category: order.product!.category,
                        price: order.product!.price,
                    },
                }));

                res.status(200).json(transformedOrders);
                return;
            }

            res.status(404).json({ message: "No orders found for this user" });
        } catch (err) {
            console.error("Error fetching user orders:", err);
            res.status(500).json({ message: "Failed to fetch user orders" });
        }
    } else {
        res.status(400).json({ message: "Invalid query parameters" });
    }
};


export const getUsersByProduct = async (req: Request, res: Response) => {
    const { productID } = req.query;

    if (productID && typeof productID === "string") {
        try {

            const product = await Product.findOne({
                where: {
                    productID,
                }
            })
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            const orders = await Order.findAll({
                where: {
                    product_id: product.id,
                },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["publicID", "name", "email", "phone_number"],
                    },
                ],
                attributes: ["orderID", "quantity", "order_date"],
            });

            if (orders) {
                const users = orders.map(order => ({
                    publicID: order.user!.publicID,
                    name: order.user!.name,
                    email: order.user!.email,
                    phone_number: order.user!.phone_number,
                    quantity: order.quantity,
                    order_date: order.order_date,
                }));

                res.status(200).json(users);
                return;
            }

            res.status(404).json({ message: "No users found who bought this product" });
        } catch (err) {
            console.error("Error fetching users who bought product:", err);
            res.status(500).json({ message: "Failed to fetch users who bought this product" });
        }
    } else {
        res.status(400).json({ message: "Invalid query parameters" });
    }
};

export const getTotalStock = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            attributes: ["stock_quantity"],
        });

        const totalStock = products.reduce((total, product) => total + product.stock_quantity, 0);

        res.status(200).json({ totalStock });
    } catch (err) {
        console.error("Error calculating total stock:", err);
        res.status(500).json({ message: "Failed to calculate total stock" });
    }
};

