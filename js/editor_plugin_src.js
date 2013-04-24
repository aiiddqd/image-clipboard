(function($) {

    tinymce.create('tinymce.plugins.cbimages', {

        init: function(ed, url) {

            ed.onInit.add(function() {

                $(ed.getDoc().body)
                    .fileClipboard({
                        on: {
                            load: function(e, file) {
                                if (file.type.match(/image/)) {
                                    $.post(ajaxurl, {
                                        action: 'cbimages_save',
                                        img: e.target.result
                                        }, function(response) {
                                            if (response.file) {
                                                var img = new Image();
                                                img.onload = function() {
                                                    $(ed.getDoc().body).append(img);
                                                };
                                                img.src = response.file;
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
