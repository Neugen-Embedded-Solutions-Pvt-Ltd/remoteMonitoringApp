import { DataTypes } from "sequelize";

import { sequelize } from "../config/database.js";

// Then use the sequelize instance to define the model
const Temperature = sequelize.define(
  "temperature_record",
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
    conditions: {
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
