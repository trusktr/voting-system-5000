/*
 * This is the global script file, executed for all pages. View-specific scripts
 * should be put in template file for the corresponding view, in the {footer}
 * section at the bottom.
 */

$(document).ready(function(){

    /*
     * Trigger the modal popup if the backend has sent a message.
     */
    if ($("#modalMessage").length > 0) {
        $(document).foundation('joyride', 'start');
    }
});

$(window).resize(function(){
});


