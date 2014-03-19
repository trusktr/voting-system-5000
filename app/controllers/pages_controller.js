



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
     *The root page of the app.
     */
    PagesController.root = function() {
        console.log('### pages#root');
        this.common = commonAttributes; // Always have this line in each controller.
        this.render();
    };

//-- Each controller needs a line like the following.
    module.exports = PagesController;

console.log('Done setting up Pages controller.');






