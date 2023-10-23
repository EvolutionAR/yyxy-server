const mongoose = require('mongoose')
const mongooseIncrement = require('mongoose-increment')
const increment = mongooseIncrement(mongoose)

module.exports = increment
