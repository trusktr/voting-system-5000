
console.log('Setting up configuration for development environment.');

var express = require('express');

module.exports = function() {
  console.log(' --- Executing development settings.');
  this.use(express.errorHandler());
  console.log(' --- Done executing development settings.');
}

console.log('Done setting up configuration for development environment.');
