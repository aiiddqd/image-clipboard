function getCursorPosition(ctrl) {
        var CaretPos = 0;
        if ( document.selection ) {
            ctrl.focus ();
            var Sel = document.selection.createRange();
            Sel.moveStart ('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        } else if ( ctrl.selectionStart || ctrl.selectionStart == '0' ) {
            CaretPos = ctrl.selectionStart;
        }
    return CaretPos;
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}
 
function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function insertProgress(selector){
	if (cbimages.loader == 1){
		jQuery(selector).after('<div class="clipboard-progress-wrapper"><div class="clipboard-progress"><div class="clipboard-progress-content">'+cbimages.loading+' <span class="clipboard-current"></span> '+cbimages.of+' <span class="clipboard-total"></span>...</div><div class="clipboard-progress-bar"></div></div></div>');
	}
}

function sendFile(image, callback){
	var post = jQuery("#post_ID").val();
	var comment = jQuery("#comment_post_ID").val();
	if (post !== undefined){ var post_id = post; }
	else { var post_id = comment; }
	if (cbimages.loader == 1){
		if (!jQuery.ajaxq.isRunning()) {
			jQuery('.clipboard-current').text('0');
			jQuery('.clipboard-total').text('0');
		}
	}
	jQuery.ajaxq('SendFiles', {
		url: cbimages.ajaxurl,
		data:{
			'action': 'cbimages_save',
			'img': image,
			'post_id': post_id
		},
		beforeSend: function()
		{
			if (cbimages.loader == 1){
				var current = parseInt(jQuery('.clipboard-current').text());
				jQuery('.clipboard-current').text(current+1);
				jQuery('.clipboard-progress-wrapper').show();
				jQuery('.clipboard-progress-bar').width('0%');
			}
		},
		xhr: function()
		{
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener("progress", function(evt){
				if (evt.lengthComputable) {
					var percentComplete = evt.loaded / evt.total * 100;
					if (cbimages.loader == 1){
						jQuery('.clipboard-progress-bar').width(percentComplete+'%');
					}
				}
			}, false);
			return xhr;
		},
		type: 'post',
		dataType: "json",
		success:function(data){
			if (callback && typeof(callback) === "function") {
				callback(data);
			}
			if (cbimages.loader == 1){
				if(jQuery.ajaxq.queues('SendFiles') == 0){
					jQuery('.clipboard-progress-wrapper').hide();
				}
			}
		}
	});
	if (cbimages.loader == 1){
		var total = parseInt(jQuery('.clipboard-total').text());
		jQuery('.clipboard-total').text(total+1);
	}
}