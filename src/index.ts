import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database';
dotenv.config();


const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();


app.get('/', (req: Request, res: Response) => {
  res.send('Ecommerce API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});