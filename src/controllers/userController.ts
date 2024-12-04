import { Request, Response } from "express";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, phone_number } = req.body;

    if (!name || !email || !phone_number) {
        res.status(400).json({ message: "Invalid Request Body" });
        return;
    }

    try {
        const user = await User.create({
            name,
            email,
            phone_number
        });

        console.log(user)

        res.status(200).json({
            message: "User created successfully",
            User: {
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                publicID: user.publicID
            }
        });
    }
    catch (err) {
        console.error("Error creating the user", err)
        res.status(500).json({ message: "Error saving the data" });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { publicID } = req.query;

    console.log(publicID)

    if (publicID && typeof publicID === "string") {
        try {
            const user = await User.findOne({
                where: {
                    publicID: publicID
                },
                attributes: ["publicID", "name", "email", "phone_number"]
            })


            console.log(user)

            if (user) {
                res.status(200).json(user)
                return
            }

            res.status(404).json({ message: "User not found" })
            return
        }
        catch (err) {
            console.error("Error finding user", err);
            res.status(500).json({ message: "Error finding user" })
            return
        }

    }

    res.status(400).json({ message: "Invalid query parameters" });
}

export const updateUser = async (req: Request, res: Response) => {
    const { publicID, new_email, new_phone_number, new_name } = req.body;

    if (publicID && typeof publicID === "string") {
        try {
            const user = await User.findOne({
                where: {
                    publicID
                }
            })

            if (user) {
                user.name = new_name === undefined ? user.name : new_name;
                user.email = new_email === undefined ? user.email : new_email;
                user.phone_number = new_phone_number === undefined ? user.phone_number : new_phone_number;

                res.status(200).json({
                    message: "Successfully updated",
                    User: {
                        publicID: user?.publicID,
                        name: user?.name,
                        email: user?.email,
                        phone_number: user?.phone_number
                    }
                })
                return
            }

            res.status(404).json({ message: "User not found" })
        }
        catch (err) {
            console.error("Error finding user", err);
            res.status(500).json({ message: "Error finding user" })
            return
        }
    }
    res.status(400).json({ message: "Invalid query parameters" });
}