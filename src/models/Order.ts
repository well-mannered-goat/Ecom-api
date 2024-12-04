import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";
import Product from "./Product";

import bcrypt from "bcrypt";

interface OrderAttributes {
    id: number;
    user_id: number;
    product_id: number;
    order_date: Date;
    quantity: number;
    status: "Cancelled" | "Booked" | "Completed" | "Failed";
    orderID: string,
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "orderID"> { }

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public user_id!: number;
    public product_id!: number;
    public order_date!: Date;
    public quantity!: number;
    public status!: "Cancelled" | "Booked" | "Completed" | "Failed";
    public orderID!: string;

    public user?: User;
    public product?: Product
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
        status: {
            type: DataTypes.ENUM("Cancelled", "Booked", "Completed", "Failed"),
            allowNull: false,
        },
        orderID: {
            type: DataTypes.STRING,
            unique: true,
        }
    },
    {
        sequelize,
        modelName: "Order",
        tableName: "Order",
        hooks: {
            afterCreate: async (order) => {
                order.orderID = await bcrypt.hash(order.id.toString(), 10);
                await order.save();
            },
        },
    }
);

Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export default Order;
