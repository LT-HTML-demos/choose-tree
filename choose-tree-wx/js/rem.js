(function (doc, win) {
    var docEl = doc.documentElement, //html
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', //事件名称
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 720) {
                docEl.style.fontSize = '100px';
            }
            else {
                docEl.style.fontSize = 100 * (clientWidth / 720) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    //doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
})(document, window);


$(document).ready(function() {
	function change(){
		$(".yphd_m li").each(function(index, element) {
			if($(this).find(".hdlx").text() =="官方活动")
			$(this).find(".hdlx").css("background","#fbb902")
			else{
				$(this).find(".hdlx").css("background","#ec967c")
				}
		});
	}
	change()


 })