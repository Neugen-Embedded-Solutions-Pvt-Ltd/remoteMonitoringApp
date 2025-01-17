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
const Temperature = sequelize.define(
  "device_temperature",
  {
    record_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    temperature: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    min_temperature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_temperature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
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
export default Temperature;
