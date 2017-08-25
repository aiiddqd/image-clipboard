(function($) {
	
	var opts = {
        on: {
            load: function(e, file) {
                if (file.type.match(/image/)) {
					sendFile(e.target.result, function(response) {
                        if (response.file) {
							tinyMCE.execCommand("mceInsertContent", false, '<img src="'+response.file+'" />');
                        }
                    });
                }
            }
		}
    }
	
	tinymce.create('tinymce.plugins.cbimages', {

        init: function(ed, url) {

            ed.onInit.add(function() {
				if(cbimages.dd == 1){
					$(ed.getDoc().body).fileReaderJS(opts).fileClipboard(opts);
				}
				else{
					$(ed.getDoc().body).fileClipboard(opts);
				}
            });
        }
    });

    tinymce.PluginManager.add('cbimages', tinymce.plugins.cbimages);
    
})(jQuery);