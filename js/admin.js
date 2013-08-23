(function($) {
	$(function() {
        $("#content")
            .fileClipboard({
                on: {
                    load: function(e, file) {
                        if (file.type.match(/image/)) {
							var post = $("#post_ID").val();
							var comment = $("#comment_post_ID").val();
							if (post !== undefined){ var post_id = post; }
							else { var post_id = comment; }
							if (post === undefined && comment === undefined) {
								post = $("input[name*='post_ID']").val();
								comment = $("input[name*='comment_post_ID']").val();
								if (post !== undefined){ post_id = post; }
								else { post_id = comment; }
							}
							
                        	$.post(ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result,
										post_id: post_id
                                        }, function(response) {
                                            if (response.file) {
												var CursorPos = getCursorPosition(document.getElementById('content'));
												var MyValue = $("#content").val();
												var FinishStr = MyValue.substr(CursorPos,MyValue.length-1);
												$("#content").val(MyValue.substr(0,CursorPos)+'<img src="' + response.file + '">'+MyValue.substr(CursorPos,MyValue.length-1));
												setCaretToPos(document.getElementById("content"), $("#content").val().length-FinishStr.length);
                                            }
                                        }, 'json');
                        }

                    }
                }
            });
	});
})(jQuery);