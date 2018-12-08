/*! jQuery v1.3.2.min.js jquery.com | jquery.org/license */


/*ScrollPicleft.js*/
var sina = {
    $: function(objName) {
        if (document.getElementById) {
            return eval('document.getElementById("' + objName + '")')
        } else {
            return eval("document.all." + objName)
        }
    },
    isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true: false,
    addEvent: function(a, c, b) {
        if (a.attachEvent) {
            a.attachEvent("on" + c, b)
        } else {
            a.addEventListener(c, b, false)
        }
    },
    delEvent: function(a, c, b) {
        if (a.detachEvent) {
            a.detachEvent("on" + c, b)
        } else {
            a.removeEventListener(c, b, false)
        }
    },
    readCookie: function(d) {
        var e = "",
        a = d + "=";
        if (document.cookie.length > 0) {
            var c = document.cookie.indexOf(a);
            if (c != -1) {
                c += a.length;
                var b = document.cookie.indexOf(";", c);
                if (b == -1) {
                    b = document.cookie.length
                }
                e = unescape(document.cookie.substring(c, b))
            }
        }
        return e
    },
    writeCookie: function(d, a, f, g) {
        var e = "",
        b = "";
        if (f != null) {
            e = new Date((new Date).getTime() + f * 3600000);
            e = "; expires=" + e.toGMTString()
        }
        if (g != null) {
            b = ";domain=" + g
        }
        document.cookie = d + "=" + escape(a) + e + b
    },
    readStyle: function(b, a) {
        if (b.style[a]) {
            return b.style[a]
        } else {
            if (b.currentStyle) {
                return b.currentStyle[a]
            } else {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var c = document.defaultView.getComputedStyle(b, null);
                    return c.getPropertyValue(a)
                } else {
                    return null
                }
            }
        }
    }
};
function ScrollPicleft(b, g, f, e) {
    this.scrollContId = b;
    this.arrLeftId = g;
    this.arrRightId = f;
    this.dotListId = e;
    this.dotClassName = "dotItem";
    this.dotOnClassName = "dotItemOn";
    this.dotObjArr = [];
    this.pageWidth = 0;
    this.frameWidth = 0;
    this.speed = 10;
    this.space = 10;
    this.pageIndex = 0;
    this.autoPlay = true;
    this.autoPlayTime = 5;
    var a, d, c = "ready";
    this.stripDiv = document.createElement("DIV");
    this.listDiv01 = document.createElement("DIV");
    this.listDiv02 = document.createElement("DIV");
    if (!ScrollPicleft.childs) {
        ScrollPicleft.childs = []
    }
    this.ID = ScrollPicleft.childs.length;
    ScrollPicleft.childs.push(this);
    this.initialize = function() {
        if (!this.scrollContId) {
            throw new Error("必须指定scrollContId.");
            return
        }
        this.scrollContDiv = sina.$(this.scrollContId);
        if (!this.scrollContDiv) {
            throw new Error('scrollContId不是正确的对象.(scrollContId = "' + this.scrollContId + '")');
            return
        }
        this.scrollContDiv.style.width = this.frameWidth + "px";
        this.scrollContDiv.style.overflow = "hidden";
        this.listDiv01.innerHTML = this.listDiv02.innerHTML = this.scrollContDiv.innerHTML;
        this.scrollContDiv.innerHTML = "";
        this.scrollContDiv.appendChild(this.stripDiv);
        this.stripDiv.appendChild(this.listDiv01);
        this.stripDiv.appendChild(this.listDiv02);
        this.stripDiv.style.overflow = "hidden";
        this.stripDiv.style.zoom = "1";
        this.stripDiv.style.width = "32766px";
        var l = navigator.userAgent.toUpperCase().indexOf("MSIE") == -1 ? false: true;
        if (l) {
            this.listDiv01.style.styleFloat = "left";
            this.listDiv02.style.styleFloat = "left"
        } else {
            this.listDiv01.style.cssFloat = "left";
            this.listDiv02.style.cssFloat = "left"
        }
        sina.addEvent(this.scrollContDiv, "mouseover", Function("ScrollPicleft.childs[" + this.ID + "].stop()"));
        sina.addEvent(this.scrollContDiv, "mouseout", Function("ScrollPicleft.childs[" + this.ID + "].play()"));
        if (this.arrLeftId) {
            this.arrLeftObj = sina.$(this.arrLeftId);
            if (this.arrLeftObj) {
                sina.addEvent(this.arrLeftObj, "mousedown", Function("ScrollPicleft.childs[" + this.ID + "].rightMouseDown()"));
                sina.addEvent(this.arrLeftObj, "mouseup", Function("ScrollPicleft.childs[" + this.ID + "].rightEnd()"));
                sina.addEvent(this.arrLeftObj, "mouseout", Function("ScrollPicleft.childs[" + this.ID + "].rightEnd()"))
            }
        }
        if (this.arrRightId) {
            this.arrRightObj = sina.$(this.arrRightId);
            if (this.arrRightObj) {
                sina.addEvent(this.arrRightObj, "mousedown", Function("ScrollPicleft.childs[" + this.ID + "].leftMouseDown()"));
                sina.addEvent(this.arrRightObj, "mouseup", Function("ScrollPicleft.childs[" + this.ID + "].leftEnd()"));
                sina.addEvent(this.arrRightObj, "mouseout", Function("ScrollPicleft.childs[" + this.ID + "].leftEnd()"))
            }
        }
        if (this.dotListId) {
            this.dotListObj = sina.$(this.dotListId);
            if (this.dotListObj) {
                var h = Math.round(this.listDiv01.offsetWidth / this.frameWidth + 0.4),
                k,
                j;
                for (k = 0; k < h; k++) {
                    j = document.createElement("span");
                    this.dotListObj.appendChild(j);
                    this.dotObjArr.push(j);
                    if (k == this.pageIndex) {
                        j.className = this.dotClassName
                    } else {
                        j.className = this.dotOnClassName
                    }
                    j.title = "第" + (k + 1) + "页";
                    sina.addEvent(j, "click", Function("ScrollPicleft.childs[" + this.ID + "].pageTo(" + k + ")"))
                }
            }
        }
        if (this.autoPlay) {
            this.play()
        }
    };
    this.leftMouseDown = function() {
        if (c != "ready") {
            return
        }
        c = "floating";
        d = setInterval("ScrollPicleft.childs[" + this.ID + "].moveLeft()", this.speed)
    };
    this.rightMouseDown = function() {
        if (c != "ready") {
            return
        }
        c = "floating";
        d = setInterval("ScrollPicleft.childs[" + this.ID + "].moveRight()", this.speed)
    };
    this.moveLeft = function() {
        if (this.scrollContDiv.scrollLeft + this.space >= this.listDiv01.scrollWidth) {
            this.scrollContDiv.scrollLeft = this.scrollContDiv.scrollLeft + this.space - this.listDiv01.scrollWidth
        } else {
            this.scrollContDiv.scrollLeft += this.space
        }
        this.accountPageIndex()
    };
    this.moveRight = function() {
        if (this.scrollContDiv.scrollLeft - this.space <= 0) {
            this.scrollContDiv.scrollLeft = this.listDiv01.scrollWidth + this.scrollContDiv.scrollLeft - this.space
        } else {
            this.scrollContDiv.scrollLeft -= this.space
        }
        this.accountPageIndex()
    };
    this.leftEnd = function() {
        if (c != "floating") {
            return
        }
        c = "stoping";
        clearInterval(d);
        var h = this.pageWidth - this.scrollContDiv.scrollLeft % this.pageWidth;
        this.move(h)
    };
    this.rightEnd = function() {
        if (c != "floating") {
            return
        }
        c = "stoping";
        clearInterval(d);
        var h = -this.scrollContDiv.scrollLeft % this.pageWidth;
        this.move(h)
    };
    this.move = function(i, j) {
        var k = i / 5;
        if (!j) {
            if (k > this.space) {
                k = this.space
            }
            if (k < -this.space) {
                k = -this.space
            }
        }
        if (Math.abs(k) < 1 && k != 0) {
            k = k >= 0 ? 1 : -1
        } else {
            k = Math.round(k)
        }
        var h = this.scrollContDiv.scrollLeft + k;
        if (k > 0) {
            if (this.scrollContDiv.scrollLeft + k >= this.listDiv01.scrollWidth) {
                this.scrollContDiv.scrollLeft = this.scrollContDiv.scrollLeft + k - this.listDiv01.scrollWidth
            } else {
                this.scrollContDiv.scrollLeft += k
            }
        } else {
            if (this.scrollContDiv.scrollLeft - k <= 0) {
                this.scrollContDiv.scrollLeft = this.listDiv01.scrollWidth + this.scrollContDiv.scrollLeft - k
            } else {
                this.scrollContDiv.scrollLeft += k
            }
        }
        i -= k;
        if (Math.abs(i) == 0) {
            c = "ready";
            if (this.autoPlay) {
                this.play()
            }
            this.accountPageIndex();
            return
        } else {
            this.accountPageIndex();
            setTimeout("ScrollPicleft.childs[" + this.ID + "].move(" + i + "," + j + ")", this.speed)
        }
    };
    this.next = function() {
        if (c != "ready") {
            return
        }
        c = "stoping";
        this.move(this.pageWidth, true)
    };
    this.play = function() {
        if (!this.autoPlay) {
            return
        }
        clearInterval(a);
        a = setInterval("ScrollPicleft.childs[" + this.ID + "].next()", this.autoPlayTime * 1000)
    };
    this.stop = function() {
        clearInterval(a)
    };
    this.pageTo = function(h) {
        if (c != "ready") {
            return
        }
        c = "stoping";
        var i = h * this.frameWidth - this.scrollContDiv.scrollLeft;
        this.move(i, true)
    };
    this.accountPageIndex = function() {
        this.pageIndex = Math.round(this.scrollContDiv.scrollLeft / this.frameWidth);
        if (this.pageIndex > Math.round(this.listDiv01.offsetWidth / this.frameWidth + 0.4) - 1) {
            this.pageIndex = 0
        }
        var h;
        for (h = 0; h < this.dotObjArr.length; h++) {
            if (h == this.pageIndex) {
                this.dotObjArr[h].className = this.dotClassName
            } else {
                this.dotObjArr[h].className = this.dotOnClassName
            }
        }
    }
};