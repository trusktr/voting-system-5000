/*
 * The VoterUpdateQueue is used to modify user data without race conditions when
 * multiple updates to a user happen at the same time.
 *
 * TODO: Move this to the Voter model as a static method somehow?
 *
 * TODO: Merge this with the VoteQueue to create a more generic DB update queue
 * that takes a unique seletion criteria and update function.
 */

console.log('Begin VoterUpdateQueue initializer.');

const MINUTES = 30; // the time aftre which to clear a user's update queue (minutes of inactivity).

var async = require("async");
var Voter = require("../../app/models/voter.js");

var queues = {}; // contains queues, one for each user. They are destroyed if the user is inactive for 30 minutes.
var queueTimeouts = {}; // timers for each queue to delete the queues after 30 minutes of not being used.

// TODO: Is there a better way than attaching this to global?
global.VoterUpdateQueue = {};
global.VoterUpdateQueue.push = function(work) {

    // if the queue for the user exists, queue the work to it.
    if (typeof queues[work.username] == "undefined") {
        queues[work.username] = async.queue(function(voterUpdate, callback) { // This function is a "worker". Basic idea: http://en.wikipedia.org/wiki/Thread_pool_pattern
            Voter.findOne({username: voterUpdate.username}, function(err, voter) {
                if (err) return callback();
                if (!voter) return callback();
                // TODO: Better error handling here?

                voterUpdate.update(voter, function() {

                    voter.save(function(err) {
                        if (err) return callback();
                        // TODO: Better error handling here?

                        console.log(" -- Updated voter "+voterUpdate.username+" while avoiding a race condition. :)");
                        callback();
                    });
                });
            });
        }, 1); // Allow only 1 worker at a time.
    }

    // queue the work for the user.
    queues[work.username].push(work);


    // set (or reset) the timeout for the user's queue.
    if (queueTimeouts[work.username] != "undefined") { clearTimeout(queueTimeouts[work.username]); }
    queueTimeouts[work.username] = setTimeout(function() {
        if (queues[work.username].length() == 0) { // if the queue is in drained state
            delete queues[work.username];
            console.log(" -- Update queue for "+work.username+" deleted.");
        }
    }, MINUTES*60*1000);

    queues[work.username].drain = function() {
        console.log(" -- Update queue for "+work.username+" is empty.");
    };

};



console.log('End VoterUpdateQueue initializer.');

