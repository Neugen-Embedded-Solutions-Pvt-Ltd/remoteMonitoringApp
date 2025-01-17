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
const Device = sequelize.define("device", {
  device_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Column: Timestamps
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

export default Device;
