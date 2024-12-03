import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface UserAtrributes{
    id:number,
    name:string,
    email:string,
    phone_number:number,
}

interface UserCreationAtrributes extends Optional<UserAtrributes, "id">{};

class User extends Model<UserAtrributes, UserCreationAtrributes> implements UserAtrributes{
    public id!:number;
    public name!:string;
    public email!:string;
    public phone_number!:number;
}

User.init(
    {
        id:{
            type:DataTypes.INTEGER.UNSIGNED,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        phone_number:{
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull:false,
        },
    },
    {
        sequelize,
        modelName:"User",
        tableName:"User"
    }
)

export default User;