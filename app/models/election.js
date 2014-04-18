
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Election', new Schema({
    election_id   : ObjectId
    , status      : { type: String, required: true }
    , mod_date    : { type: Date, default: Date.now }
}));
