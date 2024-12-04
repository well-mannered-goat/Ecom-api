import { Request, Response } from "express";
import User from "../models/User";

const createUser = async (req: Request, res: Response) => {
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

        res.status(200).json({ message: "User created successfully" });
    }
    catch (err) {
        console.error("Error creating the user", err)
        res.status(500).json({ message: "Error saving the data" });
    }
}

const getUserByEmailOrPhone = async (req: Request, res: Response) => {
    const { email , phone_number } = req.query;

    if (email) {
        try {
            const user = await User.findOne({
                where: {
                    email: email as string
                },
                attributes: ["name", "email", "phone_number"]
            })

            res.status(200).json(user)
        }
        catch (err) {
            console.error("Error finding user by email", err)
            res.status(500).json({ message: "Error finding user" })
        }
    }

    if (phone_number) {

        const phone= Number(phone_number);

        if (isNaN(phone)) {
            res.status(400).json({ message: "Invalid phone number" });
            return
        }

        try {
            const user = await User.findOne({
                where: {
                    phone_number: phone
                },
                attributes: ["name", "email", "phone_number"]
            })

            res.status(200).json(user)
        }
        catch (err) {
            console.error("Error finding user by phone number", err)
            res.status(500).json({ message: "Error finding user" })
        }
    }

    res.status(400).json({ message: "Invalid query parameters" });
}

const updateTask = async (req: Request, res: Response) => {
    const { name, email, phone_number }=req.body;

    const user = await User.findOne({
        where:{
            email:email as string,
            phone_number:phone_number as number
        }
    })
}