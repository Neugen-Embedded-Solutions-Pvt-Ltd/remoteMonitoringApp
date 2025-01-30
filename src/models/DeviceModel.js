import Sequelize, { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";
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
