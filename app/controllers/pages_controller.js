/*
 * This is the pages controller. This controller has methods that are in charge
 * of generating the content for pages on the site.
 *
 * NOTE: Never allow the variable modalMessage to be set from input received
 * from the front end, to avoid Cross-site scripting attacks.
 */

console.log('Setting up Pages controller.');

//--------------- Each controller needs be initialized as a locomotive controller.
    var locomotive = require('locomotive'),
        PagesController = new locomotive.Controller();


//--------------- Helper functions.

/*
 * TODO: put this in a utility module.
 * TODO: Instead of having this function to specify property and value, just
 * overload Array.indexOf and let the user pass an object to matched against.
 */
Array.prototype.indexOfObjectWith = function(attr, value) {
    for(var i = 0; i < this.length; i += 1) {
        if(this[i][attr] === value) {
            return i;
        }
    }
}


//--------------- Set up the methods that we've specified in the routes.js config file.

    /*
     * Does stuff for all pages.
     */
    PagesController.all = function() {
        console.log('### pages#all');

        this.req.commonAttributes = {
            title: '★✮☆ Voting System 5000',
            menu: [
                {title:"Vote",             uri:"/vote"},
                {title:"View Results",     uri:"/results"},
                {title:"Register",         uri:"/register"},
                {title:"Login",            uri:"/login"},
                {title:"Manage Election",  uri:"/admin"},
                {title:"Logout",           uri:"/logout"}
            ],
            thisPage: this.req.url
        };

        var menu = this.req.commonAttributes.menu;

        /*
         * Allow the /admin menu item only for the logged-in admin user.
         */
        if (!this.req.user || !(this.req.user && this.req.user.username == "admin")) { // if not logged in, or logged in but not admin
            menu.splice(menu.indexOfObjectWith("uri","/admin"), 1);
        }

        /*
         * If logged in as admin remove the /vote menu item.
         */
        if (this.req.user && this.req.user.username == "admin") {
            menu.splice(menu.indexOfObjectWith("uri","/vote"), 1);
        }

        /*
         * If logged in. Remove the /register and /login menu items. Add the
         * /logout item.
         */
        if (this.req.user) {
            menu.splice(menu.indexOfObjectWith("uri","/register"),1);
            menu.splice(menu.indexOfObjectWith("uri","/login"),1);
        }
        else {
            menu.splice(menu.indexOfObjectWith("uri","/logout"),1);
        }

        return this.next();
    };

    /*
     * The root page of the app.
     */
    PagesController.root = function() {
        var viewContext = this;
        viewContext.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...

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
                    // We'll see users outputted to console whenever the main
                    // page is accessed.
                });
            });

            // Note that the above two blocks (the calls to save() and find())
            // happen simultaneously, and while those are executing, the
            // following two lines will also fire and render the web page.

        viewContext.render();

        // This is the beauty (and hideousness) of JavaScript.
    };

    PagesController.register = function() {
        var viewContext = this;
        viewContext.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...

        var Voter = require("../models/voter.js");

        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.
            var voter = new Voter(this.req.body); // TODO: We need server-side validation here.
            voter.save(function(err) {
                if (err) {
                    console.log(err);
                    viewContext.modalError = true;
                    viewContext.modalMessage = "You may have already registered. <a href='/vote'>Place your vote.</a>";
                }
                else {
                    viewContext.modalMessage = "Thanks for registering, "+voter.name+"! <a href='/vote'>Place your vote.</a>";
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
        viewContext.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...

        var VoteTopic = require("../models/vote_topic.js");

        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.

            console.log(" -- Getting vote topics for vote page.");
            VoteTopic.getAll(function(err, topics) {
                //TODO: make an array of errors. Make each template handle the array in skeleton.dust.
                if (saveError) {
                    viewContext.modalError = true;
                    viewContext.modalMessage = "Could not save vote topics.";
                }
                if (err) {
                    viewContext.modalError = true;
                    viewContext.modalMessage = "Could not get vote topics.";
                }
                viewContext.modalMessage = "All changes saved!";
                viewContext.voteTopics = topics;
                viewContext.render();
            });
        }
        else { // if no POST (we don't care about GET for this page).
            // Vote.find(function(err, topics) {
            VoteTopic.getAll(function(err, topics) {
                if (err) {
                    viewContext.error = true;
                    viewContext.message = "Error: Could not get vote topics.";
                }
                viewContext.voteTopics = topics;
                viewContext.render();
            });
        }
    };

    /*
     * Handles the /results page.
     */
    PagesController.results = function() {
        var viewContext = this;
        viewContext.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        viewContext.render();
    };

    /*
     * Handles requests to the /admin page
     */
    PagesController.admin = function() {
        var viewContext = this;
        viewContext.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        viewContext.user = this.req.user;
        delete viewContext.user.password;
        delete viewContext.user.ssn; // should we allow SSN to go to the front end?
        delete viewContext.user.votes_hash; // And what about the vote hash?

        var async = require("async"); // control flow tool for calling multiple asynchronous functions.

        var Vote = require("../models/vote.js");
        var VoteTopic = require("../models/vote_topic.js");

        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.

            console.log(" --- POST REQUEST");

            // Get election configuration from the POST data.
            var clientVoteTopics = JSON.parse(this.req.body.json).voteTopics;

            /*
             *Save the election configuration.
             */
            Vote.remove({}, function(){ // Remove all first. Yeah, this could be avoided, but it's a single-user use case with few entries in the DB.
                async.forEach(clientVoteTopics, function(clientVoteTopic, callback) { // asynchronous forEach
                    console.log(" -- Adding vote topic to DB.");
                    VoteTopic.saveOne(clientVoteTopic, function(err) {
                        callback();
                    });

                }, function(saveError) { // this function executes after all the find() operations have completed along with their callbacks.
                    // all changes to the election configuration have been saved (if no saveError).
                    VoteTopic.getAll(function(err, topics) {
                        //TODO: make an array of errors. Make each template handle the array in skeleton.dust.
                        if (saveError) {
                            viewContext.modalError = true;
                            viewContext.modalMessage = "Could not save vote topics.";
                        }
                        if (err) {
                            viewContext.modalError = true;
                            viewContext.modalMessage = "Could not get vote topics.";
                        }
                        viewContext.modalMessage = "All changes saved!";
                        viewContext.voteTopics = topics;
                        viewContext.render();
                    });
                });
            });
        }
        else { // if no POST (we don't care about GET for this page).
            //Vote.find(function(err, topics) {
            VoteTopic.getAll(function(err, topics) {
                if (err) {
                    viewContext.error = true;
                    viewContext.message = "Error: Could not get vote topics.";
                }
                viewContext.voteTopics = topics;
                viewContext.render();
            });
        }
    };

//-------------- Each controller needs a line like the following.
    module.exports = PagesController;

console.log('Done setting up Pages controller.');

