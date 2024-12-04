import bcrypt from "bcrypt"
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ProductAttributes {
    id: number;
    productID:string,
    name: string;
    category: "Electronics" | "Clothing" | "Groceries";
    price: number;
    stock_quantity: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"|"productID"> { }

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public productID!:string;
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
        productID:{
            type:DataTypes.STRING,
            unique:true
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
        hooks: {
            afterCreate: async (product) => {
                product.productID = await bcrypt.hash(product.id.toString(), 10);
                await product.save();
            },
        },
    }
);

export default Product;
