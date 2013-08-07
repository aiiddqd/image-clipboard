(function($) {
	$(function() {
        $("#comment")
            .fileClipboard({
                on: {
                    load: function(e, file) {
                        if (file.type.match(/image/)) {
							var post = $("#post_ID").val();
							var comment = $("#comment_post_ID").val();
							if (post !== undefined){ var post_id = post; }
							else { var post_id = comment; }
                            $.post(cbimages.ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result,
										post_id: post_id
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