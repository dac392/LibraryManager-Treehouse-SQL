'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {Type:Sequelize.STRING, allowNull: false, validate:{notEmpty:{msg:"'title' field cannot be empty"}, notNull:{msg:"'title' field cannot be null"}}},
    author: {Type:Sequelize.STRING, allowNull: false, validate:{notEmpty:{msg:"'author' field cannot be empty"}, notNull:{msg:"'author' field cannot be null"}}},
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};