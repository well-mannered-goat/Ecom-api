import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ProductAttributes {
    id: number;
    name: string;
    category: "Electronics" | "Clothing" | "Groceries";
    price: number;
    stock_quantity: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> { }

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public category!: "Electronics" | "Clothing" | "Groceries";
    public price!: number;
    public stock_quantity!: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM("Electronics", "Clothing", "Groceries"),
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stock_quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "Product",
    }
);

export default Product;
