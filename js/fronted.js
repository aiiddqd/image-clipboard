(function($) {

	var opts = {
        on: {
            load: function(e, file) {
				if (file.type.match(/image/)) {
					sendFile(e.target.result, function(response) {
                        if (response.file) {
							var CursorPos = getCursorPosition(document.getElementById('comment'));
							var MyValue = $("#comment").val();
							var FinishStr = MyValue.substr(CursorPos,MyValue.length-1);
							$("#comment").val(MyValue.substr(0,CursorPos)+'<img src="' + response.file + '">'+FinishStr);
							setCaretToPos(document.getElementById("comment"), $("#comment").val().length-FinishStr.length);
                        }
                    });
				}
            }	
        }
	}

	$(function() {
		if(cbimages.dd == 1){
			$("#comment").fileReaderJS(opts).fileClipboard(opts);
		}else{
			$("#comment").fileClipboard(opts);
		}	
		insertProgress($("#comment"));
		
	});
	
})(jQuery);