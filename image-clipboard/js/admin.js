(function($) {

	var opts = {
        on: {
            load: function(e, file) {
                if (file.type.match(/image/)) {
					sendFile(e.target.result, function(response) {
                        if (response.file) {
							var CursorPos = getCursorPosition(document.getElementById('content'));
							var MyValue = $("#content").val();
							var FinishStr = MyValue.substr(CursorPos,MyValue.length-1);
							$("#content").val(MyValue.substr(0,CursorPos)+'<img src="' + response.file + '">'+MyValue.substr(CursorPos,MyValue.length-1));
							setCaretToPos(document.getElementById("content"), $("#content").val().length-FinishStr.length);
						}
                    });
                }
            }
		}
    }
	
	$(function() {
		if(cbimages.dd == 1){
			$("#content").fileReaderJS(opts).fileClipboard(opts);
		}else{
			$("#content").fileClipboard(opts);
		}
		insertProgress($("#postdivrich"));
		
	});
	
})(jQuery);