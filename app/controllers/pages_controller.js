



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
            ],
            req: this.req
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

        /*
         * Example usage of a model:
         */
            // You can require a model, then use it just like the mongoose docs
            // describe.
            // Convention: uppercase first letter for model/object names.
            var Voter = require("../models/voter.js");
            // Take a look at app/models/voter.js

            // When we have voters in the database, we can get some of them like
            // this:
            Voter.find( {/* empty search criteria */}, function(err, voters) {
                console.log("Found?");
                voters.forEach(function(voter) {
                    console.log(" ########### Voter's name: "+voter.name);
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

        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.
            var post = this.req.body;
            var Voter = require("../models/voter.js");
            var voter = new Voter({
                  ssn      : post.ssn
                , name     : post.name
                , street   : post.street
                , city     : post.city
                , state    : post.state
                , zip      : post.zip
                , email    : post.email
            });
            voter.save(function(err) {
                if (err) {
                    console.log(err);
                    viewContext.error = "You may have already registered.";
                    viewContext.modal = true;
                }
                else {
                    viewContext.modal = true;
                    viewContext.voter = voter;
                }
                viewContext.render();
            });
        }
        else if (Object.keys(this.req.query).length > 0) { // if we have GET variables.
            viewContext.render();
        }
        else { // no GET or POST
            viewContext.render();
        }
    };

    PagesController.vote = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...

        var VoteTopic = require("../models/vote_topic.js");
        VoteTopic.getVoteTopics(function(topics) {
            viewContext.topics = topics; // give it to the view.

            if (Object.keys(this.req.body).length > 0) { // if we have POST variables.
                // Save the user's vote.
                viewContext.render();
            }
            else if (Object.keys(this.req.query).length > 0) { // if we have GET variables.
                // nothing for GET.
                viewContext.render();
            }
            else { // if no GET or POST
                viewContext.render();
            }
        });
    };

    PagesController.results = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...
        viewContext.render();
    };

    PagesController.admin = function() {
        var viewContext = this;
        viewContext.common = commonAttributes; // Always have this line in each controller, at the top. There's probably a better way to do it...

        var VoteTopic = require("../models/vote_topic.js");
        VoteTopic.getVoteTopics(function(topics) {
            viewContext.topics = topics; // give it to the view.

            if (Object.keys(this.req.body).length > 0) { // if we have POST variables.
                // Save the election configuration.
                viewContext.render();
            }
            else if (Object.keys(this.req.query).length > 0) { // if we have GET variables.
                // nothing for GET.
                viewContext.render();
            }
            else { // if no GET or POST
                viewContext.render();
            }
        });
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






