



console.log('Setting up Pages controller.');

//-- Each controller needs be initialized as a locomotive controller.
    var locomotive = require('locomotive'),
        PagesController = new locomotive.Controller();

//-- Attributes for all views stored here.
    var commonAttributes;

//-- Set up the methods that we've specified in the routes.js config file.

    /*
     * Does stuff for all pages.
     */
    PagesController.all = function() {
        console.log('### pages#all');
        commonAttributes = {
            title: 'Voting System 5000',
            menu: [
                {title:"Register to Vote", uri:"/register"},
                {title:"Vote",             uri:"/vote"},
                {title:"Check Results",    uri:"/results"},
                {title:"Manage Election",  uri:"/admin"}
            ]
        };
        return this.next();
    };

    /*
     * The root page of the app.
     */
    PagesController.root = function() {
        console.log('### pages#root');

        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...

        console.log(" this is ");
        this.app = "TESTERRRRRRRR";
        console.log(this);

        /*
         * Example usage of a model:
         */
            // You can require a model, then use it just like the mongoose docs
            // describe.
            // Convention: uppercase first letter for model/object names.
            var Voter = require("../models/voter.js");
            // Take a look at app/models/voter.js

            var v = new Voter(); // instantiate a new voter.

            v.name = "Ray Ban"; // set the voter's name.
            v.save(function(error) { // save the voter to the database.
                // We'll get an error in the console because we didn't set the
                // required fields for the voter. Just access the main page of
                // the app to trigger these actions.
                console.log("\n -- Error saving voter: \n"+error+"\n");
            });

            // When we have voters in the database, we can get some of them like
            // this:
            Voter.find( {/* empty search criteria */}, function(err, voters) {
                voters.forEach(function(voter) {
                    console.log(" Voter's name: "+voter.name);
                    // We'll see output in the console when we have voters.
                });
            });

            // Note that the above two blocks (the calls to save() and find())
            // happen simultaneously, and while those are executing, the
            // following two lines will also fire and render the web page.

        viewContext.render();

        // This is the beauty of JavaScript.

        // NOTE: To execute things in order, see the next two example
        // PagesController functions/methods.
    };

    PagesController.register = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...
        viewContext.render();
    };

    PagesController.vote = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...
        viewContext.render();
    };

    PagesController.results = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...
        viewContext.render();
    };

    PagesController.admin = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...
        console.log(this.param("candidate-name"));
        if (this.param("candidate-name") != "") {
            var Vote = require("../models/vote.js");
            var v = new Vote();
            v.name = this.param("candidate-election");
            v.option = this.param("candidate-name");
            v.save(function(error) { // save the vote to the database.
                if (error) {
                console.log("\n -- Error saving vote: \n"+error+"\n");
                }

                else {
                    Vote.find( {/* empty search criteria */}, function(err, votes) {
                        if (err) console.log(err)
                            else {
                                console.log("\n --"+votes[0].name);
                                console.log("\n --"+votes[0].option);
                                console.log("\n --"+votes[1].name);
                                console.log("\n --"+votes[1].option);
                                viewContext.votes = votes; // an array of voters for use in the view. e.g. showing a list of users.
                            }

                            viewContext.render();
                    });
                }
            });
        }
        viewContext.render();
    };


    /*
     * An example to show how to execute things in order. This function
     * doesn't get called.
     */
    PagesController.example = function() {

            var viewContext = this;
            viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...

            var Voter = require("../models/voter.js");
            var v = new Voter(); // instantiate a new voter.

            v.name = "Ray Ban"; // set the voter's name.
            v.save(function(error) { // save the voter to the database.
                console.log("\n -- Error saving voter: \n"+error+"\n");

                Voter.find( {/* empty search criteria */}, function(err, voters) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        viewContext.voters = []; // an array of voters for use in the view.
                        voters.forEach(function(voter) {
                            console.log(" Voter's name: "+voter.name);

                            // Add the user to the array.
                            viewContext.voters.push(voter);
                        });
                    }

                    viewContext.render();
                    // Now the page gets rendered after we've attempted to
                    // save an invalid voter, followed by having retrieved
                    // all voters.
                });
            });
    };

    /*
     * Another shorter way to do the same.
     */
    PagesController.example2 = function() {

            var viewContext = this;
            viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...

            var Voter = require("../models/voter.js");
            var v = new Voter(); // instantiate a new voter.

            v.name = "Ray Ban"; // set the voter's name.
            v.save(function(error) { // save the voter to the database.
                console.log("\n -- Error saving voter: \n"+error+"\n");

                Voter.find( {/* empty search criteria */}, function(err, voters) {
                    if (err) console.log(err)
                    else viewContext.voters = voters; // an array of voters for use in the view. e.g. showing a list of users.

                    viewContext.render();
                });
            });
    };

//-- Each controller needs a line like the following.
    module.exports = PagesController;

console.log('Done setting up Pages controller.');






