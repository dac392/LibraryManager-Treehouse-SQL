'use strict';
const {
  Model, Sequelize
} = require('sequelize');
/* EXPORTS book model w fields: title, author, genre, year */
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {}
  Book.init({
    title: {type:DataTypes.STRING, allowNull: false, validate:{notEmpty:{msg:"'title' field cannot be empty"}, notNull:{msg:"'title' field cannot be null"}}},
    author: {type:DataTypes.STRING, allowNull: false, validate:{notEmpty:{msg:"'author' field cannot be empty"}, notNull:{msg:"'author' field cannot be null"}}},
    genre: {type:DataTypes.STRING, allowNull: false, validate:{notEmpty:{msg:"'genre' field cannot be empty"}, notNull:{msg:"'genre' field cannot be null"}}},
    year: {type:DataTypes.INTEGER, allowNull: false, validate:{notEmpty:{msg:"'year' field cannot be empty"}, notNull:{msg:"'year' field cannot be null"}}}
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};