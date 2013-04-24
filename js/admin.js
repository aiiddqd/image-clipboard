(function($) {
	$(function() {
        $("#content")
            .fileClipboard({
                on: {
                    load: function(e, file) {
                        if (file.type.match(/image/)) {
                        	$.post(ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result
                                        }, function(response) {
                                            if (response.file) {
                                            	$("#content").val($("#content").val() + '<img src="' + response.file + '">');
                                            }
                                        }, 'json');
                        }

                    }
                }
            });
	});
})(jQuery);