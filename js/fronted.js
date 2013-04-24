(function($) {
	$(function() {
        $("#comment")
            .fileClipboard({
                on: {
                    load: function(e, file) {
                        if (file.type.match(/image/)) {
                            $.post(cbimages.ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result
                                        }, function(response) {
                                            if (response.file) {
                                                $("#comment").val($("#comment").val() + '<img src="' + response.file + '">');
                                            }
                                        }, 'json');
                        }

                    }
                }
            });
	});
})(jQuery);