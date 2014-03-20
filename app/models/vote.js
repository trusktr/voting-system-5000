
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Vote', new Schema({
    vote_id       : ObjectId
    , name        : { type: String, required: true }
    , option      : { type: String, required: true }
    , votes_count : { type: Number, min: 0, default: 0 }
    , mod_date    : { type: Date, default: Date.now }
}));
