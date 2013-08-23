(function($) {

	
	
    tinymce.create('tinymce.plugins.cbimages', {

        init: function(ed, url) {

            ed.onInit.add(function() {

                $(ed.getDoc().body)
                    .fileClipboard({
                        on: {
                            load: function(e, file) {
                                if (file.type.match(/image/)) {
									var post = $("#post_ID").val();
									var comment = $("#comment_post_ID").val();
									if (post !== undefined){ var post_id = post; }
									else { var post_id = comment; }
                                    $.post(ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result,
										post_id: post_id
                                        }, function(response) {
                                            if (response.file) {
												tinyMCE.execCommand("mceInsertContent", false, '<img src="'+response.file+'" />');
                                            }
                                        }, 'json');
                                }
                            }
                        }
                    });
            });
        }
    });

    tinymce.PluginManager.add('cbimages', tinymce.plugins.cbimages);
    
})(jQuery);