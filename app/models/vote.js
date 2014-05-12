
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var VoteSchema = new Schema({
    vote_id       : ObjectId
    , name        : { type: String, required: true }
    , option      : { type: String, required: true }
    , votes_count : { type: Number, min: 0, default: 0 } // TODO: store as a string so mongoose-encrypt can encrypt it. TODO: Fix mongoose so taht it can be stored as a number.
    , mod_date    : { type: Date, default: Date.now }
    , vote_sign   : { type: String }
});
VoteSchema.plugin(require('mongoose-unique-validator'));

// set up encryption of the data.
VoteSchema.plugin(require('mongoose-encrypt'), {

    // define the fields that should be encrypted.
    paths: ["name", "option"], // just the SSN for now, but we can likely encrypt everything using Object.keys. <-- TODO

    // The AES key used for encryption. This is not stored anywhere. In order
    // to start the server, the admin starting the server must paste the key
    // into an environment variable. That same person must never store the AES
    // key on the application server.
    password: function() {
        return process.env.VS5K_AES_KEY;
    }
});

module.exports = mongoose.model('Vote', VoteSchema);
