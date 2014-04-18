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
            thisPage: this.req.url,
            user: this.req.user
        };
        //delete this.req.commonAttributes.user.password;
        //delete this.req.commonAttributes.user.ssn; // should we allow SSN to go to the front end?
        //delete this.req.commonAttributes.user.votes_hash; // And what about the vote hash?

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
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        var viewContext = this;

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
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        var viewContext = this;

        var Voter = require("../models/voter.js");

        console.log("Register controller method");
        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.
            console.log("Submitting registration........");
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
                console.log("Voter saved!!!!!...");
                viewContext.render();
            });
        }
        else if (Object.keys(this.req.query).length > 0) { // if we have GET variables.
                console.log("Register page accessed, no submission yet!!!....");
            viewContext.render();
        }
        else { // no GET or POST
                console.log("Register page accessed, no submission yet!!!....");
            viewContext.render();
        }
    };

    PagesController.vote = function() {
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        var viewContext = this;

        var Vote = require("../models/vote.js");
        var VoteTopic = require("../models/vote_topic.js");

        if (Object.keys(this.req.body).length > 0) { // if we have POST variables.

            console.log(" -- Getting vote topics for vote page.");
            var voterChoice = this.req.body;

            /*
             * votes_hash format example:
             * Vote Topic Name:Chosen Option;Vote Topic Name:Chosen Option;Vote Topic Name:Chosen Option
             */
            var votes_hash = this.req.user.votes_hash; // TODO: This will eventually be encrypted, and we then have to decrypt it to get te value, and encrypt it to store it back in the following lines below..
			
            /*
             * Check if user already has a vote saved for the corresponding Vote object of the same option value.
             * If so
             *     do nothing with the Vote object.
             * If not
             *     check if the user has previously chosen another option of the same Vote name.
             *     If so
             *         decrement the count for the other Vote object option
             *         replace the user's vote of same name with the new option.
             *     If not
             *         do nothing
             *     increment the count for the Vote object corresponding with the user's new option
             *     Save new vote to the user's votes_hash
             */
                // TODO: The below implementation of the above pseudo code can definitely be optimized. But I was in a hurry. xD
                //Check if user already has a vote saved for the corresponding Vote object of the same option value.
                var hasVotedOnThisTopicBefore = false;
                var hasSubmittedThisChoiceBefore = false;
                var previousChoice = "";
                var votes_hash_found_index = null;
                var votes_hash_array = [];
                if (votes_hash && typeof votes_hash == "string" && votes_hash.length > 0) { // if the user has a vote_hash
                    votes_hash_array = votes_hash.split(";");
                    for (var i=0; i<votes_hash_array.length; i++) { // for each vote the user has already placed
                        var name = votes_hash_array[i].split(":")[0];
                        var choice = votes_hash_array[i].split(":")[1];

                        console.log(" ##### ::::: "+voterChoice.name+" "+ name);

                        if (voterChoice.name == name) {
                            hasVotedOnThisTopicBefore = true;
                            previousChoice = choice; // record the user's previous choice for later
                            votes_hash_found_index = i;
                            if (voterChoice.choice == previousChoice) { // if voter has already submitted this exact choice before.
                                hasSubmittedThisChoiceBefore = true;
                            }
                        }
                    }

                    // Save new vote to the user's votes_hash
                    if (votes_hash_found_index) {
                        console.log("11111111111111111111111111111111111111111111111111111111");
                        votes_hash_array[votes_hash_found_index] = voterChoice.name+":"+voterChoice.choice;
                        votes_hash = votes_hash_array.join(";");
                    }
                    else {
                        console.log("2222222222222222222222222222222222222222222222222222222222222222");
                        votes_hash += ";"+voterChoice.name+":"+voterChoice.choice;
                    }
                }
                else {
                    // Save new vote to the user's votes_hash
                        console.log("3333333333333333333333333333333333333333333333333333333333333333333333333333");
                    votes_hash = voterChoice.name+":"+voterChoice.choice;
                }

                if (hasSubmittedThisChoiceBefore) { // if so
                    console.log(" -- Doing nothing. Just kiddding.");
                    // do nothing
                }
                else { // if not

                    //check if the user has previously chosen another option of the same Vote name.
                    if (hasVotedOnThisTopicBefore) { // if so
                        //decrement the count for the other Vote object option
                        // i.e. decrement the previous choice that no longer holds.
                        global.VoteQueue.push({
                            name: voterChoice.name,
                            option: previousChoice,
                            giveOrTake: -1
                        });
                    }

                    //increment the count for the Vote object corresponding with the user's new option
                    global.VoteQueue.push({
                        name: voterChoice.name,
                        option: voterChoice.choice,
                        giveOrTake: +1
                    });
                }

            // Save the user (we modified the votes_hash).
            this.req.user.votes_hash = votes_hash;
			if (this.req.user.public_vote)							//this saves a copy of votes_hash for public vote opt-outs
				this.req.user.votes_hash_public = votes_hash;
            this.req.user.save(function(err) {
                if (err) return new Error("Unable to save user."); // TODO: Handle this better?

                // Get all topics to give to the view.
                VoteTopic.getAll(function(err, topics) {
                    if (err) {
                        viewContext.modalError = true;
                        viewContext.modalMessage = "Could not get vote topics.";
                    }
                    viewContext.modalMessage = "Vote saved!";
                    viewContext.voteTopics = topics;

                    // And finally:
                    viewContext.render();
                });
            });
        }
        else { // if no POST (we don't care about GET for this page).
            VoteTopic.getAll(function(err, topics) {
                if (err) {
                    viewContext.modalError = true;
                    viewContext.modalMessage = "Error: Could not get vote topics.";
                }
                viewContext.voteTopics = topics;
                console.log(" -- Vote topics got!!!!!");
                viewContext.render();
            });
            console.log(" -- getting vote topics......");
        }
    };

    /*
     * Handles the /results page.
     */
    PagesController.results = function() {
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        var viewContext = this;
        
        // Make votes_count available to the Results page by creating a new
        // model
        var VoteTopic = require("../models/vote_topic.js"); // It gets the required assignments from w/i vote_topics.js & assigns them to VoteTopic
        // line 87 from vote_topic.js
        
        // NOW, use VoteTopic model to get the information required
        VoteTopic.getAll(function(err, voteTopics){ // function takes 2 param
            if (err) {
                viewContext.modalError = true;
                viewContext.modalMessage = "Error: Could not get vote topics.";
            }
            // Each topic contains a topic, a name, and an optins
            viewContext.voteTopics = voteTopics;
            //Create 2 arrays for multi choice and yes no choices
            viewContext.multiChoiceTopics = [];
            viewContext.yesNoTopics = [];
            voteTopics.forEach(function(topic){
                if (topic.yesno){
                    viewContext.yesNoTopics.push(topic);
                }
                else{
                    viewContext.multiChoiceTopics.push(topic);
                }
            });
            // Any instruction after the render() will not be shown on the
            // template
            
            // NOW claculate percentages before rendering
            viewContext.render();

        }); // Get all takes an empty function

    };

    /*
     * Handles requests to the /admin page
     */
    PagesController.admin = function() {
        this.common = this.req.commonAttributes; // Always have this line in each controller method, at the top. There's probably a better way to do it...
        var viewContext = this;

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

