import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import bcrypt from "bcrypt"

interface UserAtrributes {
    id: number,
    publicID: string,
    name: string,
    email: string,
    phone_number: number,
}

interface UserCreationAtrributes extends Optional<UserAtrributes, "id" | "publicID"> { };

class User extends Model<UserAtrributes, UserCreationAtrributes> implements UserAtrributes {
    public id!: number;
    public publicID!: string;
    public name!: string;
    public email!: string;
    public phone_number!: number;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        publicID: {
            type: DataTypes.STRING,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "User",
        hooks: {
            afterCreate: async (user) => {
                user.publicID = await bcrypt.hash(user.id.toString(), 10);
                await user.save();
            },
        },
    }
)

// sequelize.sync()
//   .then(() => {
//     console.log('Database synchronized!');
//   })
//   .catch((error) => {
//     console.error('Error synchronizing database:', error);
//   });

export default User;