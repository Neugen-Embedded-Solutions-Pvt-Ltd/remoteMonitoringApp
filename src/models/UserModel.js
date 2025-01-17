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
const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
export default User;
