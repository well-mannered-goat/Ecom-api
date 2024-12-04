import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";
import Product from "./Product";

interface OrderAttributes {
    id: number;
    user_id: number;
    product_id: number;
    order_date: Date;
    quantity: number;
    status:"Cancelled"|"Booked"|"Completed";
    orderID:string,
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"|"orderID"> { }

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public user_id!: number;
    public product_id!: number;
    public order_date!: Date;
    public quantity!: number;
    public status!:"Cancelled"|"Booked"|"Completed";
    public orderID!:string;

    public user?:User;
    public product?:Product
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: Product,
                key: "id",
            },
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        status:{
            type:DataTypes.ENUM("Cancelled","Booked","Completed"),
            allowNull:false,
        },
        orderID:{
            type:DataTypes.INTEGER.UNSIGNED,
            unique:true,
        }
    },
    {
        sequelize,
        modelName: "Order",
        tableName: "Order",
    }
);

Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export default Order;
