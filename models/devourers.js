// Devourers Model

'use strict';

module.exports = function(sequelize, DataTypes) {
  var devourers = sequelize.define('devourers', {
    devourer_name: DataTypes.STRING,
    burgerId: DataTypes.INTEGER
  });
  return devourers;
};