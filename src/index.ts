import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { connectDB } from './config/database';
import userRoutes from "./routes/userRoutes"



const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/user',userRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Ecommerce API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});