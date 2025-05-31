const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

class Task extends Model {}

Task.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Optionally add userId if not present
}, {
  sequelize,
  modelName: 'Task',
  timestamps: true,
});

Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });

module.exports = Task;
