
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VoteSchema = new Schema({
    vote_id       : ObjectId
    , name        : { type: String, required: true }
    , option      : { type: String, required: true }
    , votes_count : { type: Number, min: 0, default: 0 }
    , mod_date    : { type: Date, default: Date.now }
	, vote_sign	  : { type: String }
});
VoteSchema.plugin(require('mongoose-unique-validator'));

module.exports = mongoose.model('Vote', VoteSchema);
