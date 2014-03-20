/*
 *This is where we register mongoose and our model schemas with the app.
 */
console.log("Setting up mongoose.");
module.exports = function() {
    console.log(" -- Executing mongoose settings.");

    this.mongoose = require("mongoose");

    switch (this.env) {
        case 'development':
            this.mongoose.connect('mongodb://localhost/dev');
            break;
        case 'production':
            this.mongoose.connect('mongodb://localhost/prod');
            break;
    }

    console.log(" -- Done executing mongoose settings.");
}
console.log("Done setting up mongoose.");
