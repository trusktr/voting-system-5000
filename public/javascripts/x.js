
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


