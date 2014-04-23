
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VoterSchema = new Schema({
    voter_id            : ObjectId
    , ssn               : { type: Number, max: 999999999, required: true, unique: true }
    , name              : { type: String, required: true }
    , street            : { type: String, required: true }
    , city              : { type: String, required: true }
    , state             : { type: String, required: true }
    , zip               : { type: Number, min: 0, max: 99999, required: true }
    , email             : { type: String, unique: true, match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ }
    , username          : { type: String, required: true, unique: true }
    , password          : { type: String, required: true }
    , salt              : { type: String, required: true}
    , public_key        : { type: String, required: true}
    , voted             : { type: Boolean, default: false }
    , votes_hash        : { type: String, default: "" }
    , mod_date          : { type: Date, default: Date.now }
    , public_vote       : { type: Boolean, default: false }
    , votes_hash_public : { type: String, default: "" }
});
VoterSchema.plugin(require('mongoose-unique-validator'));

VoterSchema.pre('save', function (next) {
    var voter = this;

    // Get the private PEM formatted key from the form and clean it.
    var publicPEM = voter.public_key;
    publicPEM = publicPEM.replace(/\r\n/g, '\n'); // ensure proper line endings.
    publicPEM = publicPEM.split("PUBLIC KEY");
    publicPEM[0] = "-----BEGIN "; // trim preceding junk
    publicPEM[publicPEM.length-1] = "-----"; // trim trailing junk
    publicPEM = publicPEM.join("PUBLIC KEY");

    voter.public_key = publicPEM;
    next();
});



module.exports = mongoose.model('Voter', VoterSchema);


// hard code an admin account.
var Voter = module.exports;
var SHA256 = require("crypto-js").SHA256;
Voter.findOne({username: "admin"}, function(err, admin) {
    var adminDetails = {
        ssn          : 000000000
        , name       : "Boss Man"
        , street     : "3456 Boss Way"
        , city       : "Tyrannis"
        , state      : "FU"
        , zip        : 00001
        , email      : "boss@yourefired.com"
        , username   : "admin"
        , password   : SHA256("admin"+"admin").toString()
        , salt       : "admin"
        , public_key : "admin"
        , voted      : true
    };
    if (admin) {
        admin.update(adminDetails, function() { });
    }
    else {
        admin = new Voter(adminDetails);
        admin.save();
    }
});
