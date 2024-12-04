import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
    const { name, category, price, stock_quantity } = req.body;

    if (!name || !category || !price || !stock_quantity) {
        res.status(400).json({ message: "Invalid Request Body" });
        return;
    }

    try {
        const product = await Product.create({
            name,
            category,
            price,
            stock_quantity,
        });

        res.status(200).json({
            message: "Product created successfully",
            Product: {
                productID: product.productID,
                name: product.name,
                category: product.category,
                price: product.price,
                stock_quantity: product.stock_quantity,
            },
        });
    } catch (err) {
        console.error("Error creating the product:", err);
        res.status(500).json({ message: "Error saving the product" });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    const { productID } = req.query;

    if (productID && typeof productID === "string") {
        try {
            const product = await Product.findOne({
                where: { productID },
                attributes: ["productID", "name", "category", "price", "stock_quantity"],
            });

            if (product) {
                res.status(200).json(product);
                return;
            }

            res.status(404).json({ message: "Product not found" });
            return;
        } catch (err) {
            console.error("Error finding product:", err);
            res.status(500).json({ message: "Error finding product" });
            return;
        }
    }

    res.status(400).json({ message: "Invalid query parameters" });
};

export const updateProduct = async (req: Request, res: Response) => {
    const { productID, new_name, new_category, new_price, new_stock_quantity } = req.body;

    if (productID && typeof productID === "string") {
        try {
            const product = await Product.findOne({
                where: { productID },
            });

            if (product) {
                product.name = new_name === undefined ? product.name : new_name;
                product.category = new_category === undefined ? product.category : new_category;
                product.price = new_price === undefined ? product.price : new_price;
                product.stock_quantity =
                    new_stock_quantity === undefined ? product.stock_quantity : new_stock_quantity;

                await product.save();

                res.status(200).json({
                    message: "Successfully updated",
                    Product: {
                        productID: product.productID,
                        name: product.name,
                        category: product.category,
                        price: product.price,
                        stock_quantity: product.stock_quantity,
                    },
                });
                return;
            }

            res.status(404).json({ message: "Product not found" });
        } catch (err) {
            console.error("Error finding product:", err);
            res.status(500).json({ message: "Error finding product" });
            return;
        }
    }
    res.status(400).json({ message: "Invalid query parameters" });
};