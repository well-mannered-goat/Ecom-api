import { Request, Response } from "express";
import User from "../models/User";

const createUser = (req: Request, res: Response) => {
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
    catch(err){
        console.error("Error creating the user", err)
        res.status(500).json({message:"Error saving the data"});
    }
}