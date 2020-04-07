'use strict';

(function () {
    $(document).ready(function() {

        const shiurimBox = $('.shiurim-box');

        $.get('/drive-all', function(res) {
            shiurimBox.html(res);
        });

        // $.get('https://shiurim-public.s3.us-east-2.amazonaws.com/', function(res){
        //     $.get('/aws-shiurim', function(res) {
        //         shiurimBox.html(res);
        //     });
        // })

    });
})();