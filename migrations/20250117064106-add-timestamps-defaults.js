"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("users", "createdAt", {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  });
  await queryInterface.changeColumn("users", "updatedAt", {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal(
      "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("users", "createdAt", {
    type: Sequelize.DATE,
    allowNull: true,
  });
  await queryInterface.changeColumn("users", "updatedAt", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}
