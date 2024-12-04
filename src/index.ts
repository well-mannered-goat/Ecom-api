import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { connectDB, sequelize } from './config/database';
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();
sequelize.sync()
  .then(() => {
    console.log('Database synchronized!');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

app.use('/user',userRoutes);
app.use('/product',productRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Ecommerce API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});