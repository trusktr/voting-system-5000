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
        var POST = viewContext.req.body;
        if (Object.keys(POST).length > 0) { // if we have POST variables.
            console.log("Submitting registration........");

            var SHA256 = require("crypto-js/sha256");
            // Include randbytes
            var RandBytes = new require('randbytes');

            var randomSource = RandBytes.urandom.getInstance();
            randomSource.getRandomBytes(64, function (buff) { // generate a random number to use as salt.

                console.log("#####################################SALT##################");

                // Convert buffer object to string
                POST.salt = buff.toString("base64");

                // Extract password field from .body and hash it
                // Store the hash into the new user's password field
                POST.password = SHA256(POST.salt + POST.password).toString();

                console.log("#####################################SALT END##################");

                // generate the user's RSA keypair, send back the private key to the user, and store the public key.
                var NodeRSA = require("node-rsa");
                var userRsa = new NodeRSA();
                //userRsa.generateKeyPair(1024);
                //POST.public_key = userRsa.getPublicPEM();
                //var privateKey = userRsa.getPrivatePEM();
                //console.log(privateKey);
                console.log(POST.public_key);

                // Voter is an object that has all information for a person (Name, SSN, Password, etc)
                var voter = new Voter(POST); // TODO: We need server-side validation here.
                voter.save(function(err) {
                    if (err) {
                        console.log(err);
                        viewContext.modalError = true;
                        viewContext.modalMessage = "ERROR: Invalid info, or you may have already registered. <a href='/vote'>Place your vote.</a>";
                    }
                    else {
                        viewContext.modalMessage = "Thanks for registering, "+voter.name+"!";
                        viewContext.voter = voter;
                    }
                    console.log("Voter saved!!!!!...");
                    viewContext.render();
                });
            });
        }
        else if (Object.keys(viewContext.req.query).length > 0) { // if we have GET variables.
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

        var POST = viewContext.req.body;
        if (Object.keys(POST).length > 0) { // if we have POST variables.
            console.log("POST ------------------------");
            console.log(POST);
            console.log(POST.vote.toString());
            console.log(POST.vote);

            // verify the voter has supplied the right private key (e.g. scanned his QR code on his vote card at the kiosk).
            var NodeRSA = require("node-rsa");
            var serverRsa = new NodeRSA();
            try {
                console.log(viewContext.req.user.public_key);
                var publicPEM = viewContext.req.user.public_key;

                serverRsa.loadFromPEM(publicPEM);
                console.log(serverRsa.getPublicPEM());
                if (!serverRsa.verify(POST.vote, POST.signature, null, "base64")) {
                    console.log("Invalid vote signature, vote rejected.");
                    viewContext.modalError = true;
                    viewContext.modalMessage = "Unauthorized key. You are under arrest. Police will arrive within the next 10 minutes.";
                    viewContext.render(); // send back the response.
                    return;
                }
            }
            catch (err) {
                console.log(err);
                viewContext.modalError = true;
                viewContext.modalMessage = err.toString();
                viewContext.render(); // send back the response.
                return;
            }

            console.log(" -- Incoming vote for user "+viewContext.req.user.username+": ");
            console.log(POST);
            var voterChoice = POST.vote; // the choice sent from the front end.
            var votes_hash = viewContext.req.user.votes_hash;

            // encrypt the user's vote with his public key.

            // if the voter already voted on this topic, delete it.
            var previousChoice = votes_hash.match(new RegExp(voterChoice.name+":[^:;]*;")); // See JavaScript String.match() docs.

            if ( previousChoice != null) { // if user voted on this topic before.
                // decrement the vote count for the previous choice.
                previousChoice = previousChoice[0].split(":")[1].split(";")[0]; // reduce it to just the previous choice value.
                global.VoteQueue.push({ name: voterChoice.name, option: previousChoice, giveOrTake: -1 });
            }

            // increment the vote count for this choice.
            global.VoteQueue.push({ name: voterChoice.name, option: voterChoice.choice, giveOrTake: +1 });

            // Update the user (we modify the votes_hash).
            global.VoterUpdateQueue.push({
                username: viewContext.req.user.username,
                update: function(voter, callback) {

                    /*
                     * delete the old vote and append the new vote, in the votes hash.
                     *
                     * votes_hash format example:
                     * Vote Topic Name:Chosen Option;Vote Topic Name:Chosen Option;Vote Topic Name:Chosen Option
                     */
                    // TODO: votes_hash will eventually be encrypted, and we then have to decrypt it to get te value, and encrypt it to store it back in the following lines below..
                    voter.votes_hash = voter.votes_hash.replace(new RegExp(voterChoice.name+":[^:;]*;"), "");
                    voter.votes_hash += voterChoice.name+":"+voterChoice.choice+";";

                    // TODO: if the user has submitted the same vote as before, don't use
                    // VoteQueue.

                    if (voter.public_vote) //this saves a copy of votes_hash for public vote opt-outs
                        voter.votes_hash_public = voter.votes_hash;

                    callback();
                }
            });

            // Get all topics to give to the view.
            console.log(" -- Getting vote topics for vote page.");
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
        }
        else { // if no POST (we don't care about GET for this page).
            VoteTopic.getAll(function(err, topics) {
                if (err) {
                    viewContext.modalError = true;
                    viewContext.modalMessage = "Error: Could not get vote topics.";
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

