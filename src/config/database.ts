import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()

let sequelize:Sequelize;

if (process.env.MODE === "DEV") {
    sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
}
else if(process.env.MODE === "PROD"){
    sequelize=new Sequelize(process.env.DB_URL!,{
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
        },
      }});
}

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, connectDB }