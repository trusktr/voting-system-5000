/*
 * The VoteQueue is used to place increments/decrements of a Vote object's
 * votes_count property into a queue. If we were to update the votes_count
 * property of a Vote object from the app's pages#vote controller, then we'd have a race
 * condition because if more than one person place a vote at the same time
 * there's be many instaces of Vote objects instantiated at once, and trying to
 * save them all at once might cause some increments/decrements to be lost. So,
 * enter the VoteQueue. Every user that votes will have the controller method of
 * the /vote page place an increment/decrement operation in this queue so there
 * is never more than one increment/decrement being done at once.
 */

console.log('Begin VoteQueue initializers.');


var async = require("async");
var Vote = require("../../app/models/vote.js");

// TODO: Is there a better way than attaching this to global?
global.VoteQueue = async.queue(function(voteChange, callback) { // This function is a "worker". Basic idea: http://en.wikipedia.org/wiki/Thread_pool_pattern
    Vote.findOne({name: voteChange.name, option: voteChange.option}, function(err, vote) {
        if (err) return callback();
        if (!vote) return callback();
        // TODO: Better error handling here?

        vote.votes_count += voteChange.giveOrTake;
        vote.save(function(err) {
            if (err) return callback();
            // TODO: Better error handling here?

            console.log(" -- Updated a vote count while avoiding a race condition. :)");
            callback();
        });
    });
}, 1);

global.VoteQueue.drain = function() {
    console.log(" -- VoteQueue is empty.");
};

console.log('End VoteQueue initializers.');
