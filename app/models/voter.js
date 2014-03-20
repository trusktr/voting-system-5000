
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('Voter', new Schema({
    voter_id     : ObjectId
    , ssn        : { type: Number, max: 999999999, required: true }
    , name       : { type: String, required: true }
    , street     : { type: String, required: true }
    , city       : { type: String, required: true }
    , state      : { type: String, required: true }
    , zip        : { type: Number, min: 0, max: 99999, required: true }
    , email      : { type: String, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }
    , voted      : { type: Boolean, default: false }
    , votes_hash : String
    , mod_date   : { type: Date, default: Date.now }
}));
