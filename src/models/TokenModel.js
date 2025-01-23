import Sequelize, { DataTypes } from "sequelize";
import config from "../../config/config.js";

// First create a Sequelize instance using your config
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect, // usually 'mysql', 'postgres', etc.
    // other options from your config...
  }
);

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
//   {
//     timestamps: true,
//   }
);
export default UserToken;
