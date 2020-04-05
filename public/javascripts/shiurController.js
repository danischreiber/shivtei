'use strict';

(function () {
    $(document).ready(function() {
        const shiurimBox = $('.shiurim-box');
        $.get('/all-shiurim', function(res) {
            shiurimBox.html(res);
        });
    });
})();