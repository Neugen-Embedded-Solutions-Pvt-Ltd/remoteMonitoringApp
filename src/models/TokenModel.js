import Sequelize, { DataTypes } from "sequelize";


import { sequelize } from "../config/database.js";

// Then use the sequelize instance to define the model
const UserToken = sequelize.define(
  "user_token",
  {
    username: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
);
export default UserToken;
