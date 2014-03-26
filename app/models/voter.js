
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VoterSchema = new Schema({
    voter_id     : ObjectId
    , ssn        : { type: Number, max: 999999999, required: true, unique: true }
    , name       : { type: String, required: true }
    , street     : { type: String, required: true }
    , city       : { type: String, required: true }
    , state      : { type: String, required: true }
    , zip        : { type: Number, min: 0, max: 99999, required: true }
    , email      : { type: String, unique: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }
    , username   : { type: String, required: true, unique: true }
    , password   : { type: String, required: true }
    , voted      : { type: Boolean, default: false }
    , votes_hash : { type: String, default: "" }
    , mod_date   : { type: Date, default: Date.now }
});
VoterSchema.plugin(require('mongoose-unique-validator'));


module.exports = mongoose.model('Voter', VoterSchema);


// hard code an admin account.
var Voter = module.exports;
Voter.findOne({username: "admin"}, function(err, admin) {
    if (admin) {
        admin.update({
            ssn          : 000000000
            , name       : "Boss Man"
            , street     : "3456 Boss Way"
            , city       : "Tyrannis"
            , state      : "FU"
            , zip        : 00001
            , email      : "boss@yourefired.com"
            , username   : "admin"
            , password   : "admin"
            , voted      : true
        }, function() { });
    }
    else {
        admin = new Voter({
            ssn          : 000000000
            , name       : "Boss Man"
            , street     : "3456 Boss Way"
            , city       : "Tyrannis"
            , state      : "FU"
            , zip        : 00001
            , email      : "boss@yourefired.com"
            , username   : "admin"
            , password   : "admin"
            , voted      : true
        });
        admin.save();
    }
});
