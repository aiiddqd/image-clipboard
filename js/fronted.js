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
												var CursorPos = getCursorPosition(document.getElementById('comment'));
												var MyValue = $("#comment").val();
												var FinishStr = MyValue.substr(CursorPos,MyValue.length-1);
												$("#comment").val(MyValue.substr(0,CursorPos)+'<img src="' + response.file + '">'+FinishStr);
												setCaretToPos(document.getElementById("comment"), $("#comment").val().length-FinishStr.length);
                                            }
                                        }, 'json');
                        }

                    }
                }
            });
	});
})(jQuery);