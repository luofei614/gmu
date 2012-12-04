module("plugin/webapp/add2desktop", {
      setup:function(){
          $("body").append("<div id='container' ></div>");
      } ,
      teardown: function(){
        $('#container').remove();
      }
});

var canShow = !$.browser.uc && !$.browser.qq && !$.browser.chrome;

if($.os.ios && canShow){
    test("",function(){
        stop();
        ua.loadcss(["reset.css", "webapp/add2desktop/add2desktop.css"], function(){
           start();
        });
    });
	test("no el * no container & icon", function() {
		expect(10);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		ua.loadcss(["reset.css", "webapp/add2desktop/add2desktop.css"], function(){
				var add2desktop = $.ui.add2desktop({
                    content: '<img src="' + upath + 'css/add2desktop/icon.png"/><p>先点击<span class="ui-add2desktop-icon"></span>，<br />再"添加至主屏幕"</p>',
					init: function(){
                        equals(this._el.parent()[0].tagName.toLowerCase(), "body", "The container is right");
                        equals(this._el.attr("class"), "ui-add2desktop", "The el is right");
						ok(true, "The oninit is trigger");
					},
				    show: function(){
                        ok(true, "The onshow is trigger");
				    }
                });
            setTimeout(function(){
                equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                equals(add2desktop._el.width() , 187 , "the width is ok");
                equals(add2desktop._el.height() , 70 , "the height is ok");
                equals(add2desktop._el.offset().top, $(window).height() - 70 - 12, 'the pos is right');
                approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
                addicon = $.os.version && ($.os.version).substr(0,3) > 4.1 ? 'ui-add2desktop-new': 'ui-add2desktop-old';
                if($.os.version && ($.os.version).substr(0,3) > 4.1){
                    equals($(".ui-add2desktop-icon-new").css("-webkit-background-size"), "14px 15px", "The icon is right");
                }
                else{
                    equals($(".ui-add2desktop-icon-old").css("-webkit-background-size"), "14px 15px", "The icon is right");
                }
                add2desktop.destroy();
                start();
            },20)
		});
	});

	test("el zepto has container",function() {
		expect(4);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop($('<div class="ui-add2desktop"></div>'), {
			container : '#container'
		});
        setTimeout(function(){
            equals(add2desktop._data.container , "#container");
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.parent().attr("id"), "container", "The container is right");
            equals(add2desktop._el.attr("class"), "ui-add2desktop", "The el is right");
            add2desktop.destroy();
            $("#container").remove();
            window.localStorage.removeItem("_gmu_adddesktop_key");
            start();
        },100);
	});

	test("el selector has container" ,function() {
		expect(3);
		stop();
        $("body").append("<div id='parentd'></div>");
        $("#parentd").append("<div class='ui-custom-add2desktop'></div>");
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop(".ui-custom-add2desktop", {
			container: "#container"
		});

        setTimeout(function(){
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
			equals(add2desktop._el.parent().attr("id"), "container", "The container is right");
			equals(add2desktop._el.attr("class"), "ui-custom-add2desktop ui-add2desktop", "The el is right");
            add2desktop.destroy();
            $("#parentd").remove();
            start();
        },100);
	});

	test('show() & hide() & key()', function(){
		expect(7);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop();
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            var height = document.documentElement.clientHeight - add2desktop._el.height()- 12;
            equals(add2desktop._el.offset().top, height, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
            add2desktop.hide();
            setTimeout(function(){
                 ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hides");
                  add2desktop.show();
                  setTimeout(function(){
                      ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hides");
                      add2desktop.key('111');
                      equals(window.localStorage.getItem(add2desktop.data('key')), 111,'the key() method is called');
                      equals(add2desktop.key(), 111,'the key() method is ok');
                      add2desktop.destroy();
                      start();
                  },100);
            },200);
        },100);
	});

    test("事件 beforeShow & show & ofterHide & init",function(){
        expect(6);
        stop();
        var  i =0;
        var flag = true,
            add2desktop = $.ui.add2desktop({
                init: function() {
                    ok(true, "The init is trigger");
                },
                beforeshow:function(e) {
                    flag || e.preventDefault();
                    (i++ ==0) && ok(true,"The beforeshow has trigger")
                },
                show:function() {
                    (i++ == 1) && ok(true, "The onshow is trigger");
                },
                afterhide:function(){
                    (i++ == 2) && ok(true, "The afterhide is trigger");
                }
            });
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            add2desktop.hide();
            setTimeout(function(){
                ok(!ua.isShown(add2desktop._el[0]), "The add2desktop beforeshow triggered");
                add2desktop.destroy();
                start();
            },100);
        },100);
    });

    test("useFix",function(){
        expect(6);
        stop();
        var ishow = true,
            add2desktop = $.ui.add2desktop({
                beforeshow:function(e) {
                    ishow || e.preventDefault();
                },
                position: {left:100, bottom: 20}
            });
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.width() , 187 , "the width is ok");
            equals(add2desktop._el.height() , 70 , "the height is ok");
            equals(add2desktop._el.offset().top, $(window).height() - 70 - 20, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, 100 - add2desktop._el.width() * 0.5 +2 ,0.5,'the pos is right');
            add2desktop.destroy();
            start();
        },200);
    });

    test("基本操作，点击关闭按钮",function(){
        expect(3);
        stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
        var add2desktop = $.ui.add2desktop({
            show:function(){
                var me = this;
                ok(ua.isShown(me._el[0]), "The add2desktop shows");
                ua.click(me.root().find('.ui-add2desktop-close').get(0));
                setTimeout(function(){
                    ok(!ua.isShown(me._el[0]), "The add2desktop hide");
                    ok(me.key(),"The lcoalStorage exist") ;
                    me.destroy();
                    start();
                })
            }
        });
    });

	test('window scroll(fix)', function() {
		expect(16);
		stop();
	    var w = window.top;
        ua.loadcss(["reset.css", "webapp/add2desktop/add2desktop.css"], function(){
            var s2 = w.document.createElement("script");
            s2.src = "../../../_test/fet/bin/import.php?f=core/zepto,core/zepto.core,core/zepto.support,core/zepto.event,core/zepto.fix,core/zepto.fx,core/zepto.highlight,core/zepto.iscroll,core/zepto.ui,webapp/button,webapp/dialog,webapp/navigator,webapp/add2desktop";
            w.document.head.appendChild(s2);
   		    s2.onload = function(){
   		    	var html = "";
   	    		for(var i = 0; i < 80; i++){
   	    			html += "<br />";
   	    		}
   	    		w.$("body").append(html);
                 w.scrollTo(0, 200);
   	            setTimeout(function(){
                    w.localStorage.removeItem("_gmu_adddesktop_key");
   	 				var add2desktop = w.$.ui.add2desktop({
   	 					hide : function () {
   	 						ok(true , 'The hide is trigger');
   	 					}
   	 				});
                    equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                    equals(add2desktop._el.width() , 187 , "the width is ok");
                    equals(add2desktop._el.height() , 70 , "the height is ok");
                    approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
                    equals(add2desktop._el.offset().top - 200, $(window).height() - 70 - 12, 'the pos is right');
                     w.scrollTo(0, 300);
                    ta.scrollStop(w);
                    setTimeout(function(){
                        equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                        equals(add2desktop._el.width() , 187 , "the width is ok");
                        equals(add2desktop._el.height() , 70 , "the height is ok");
                        ok(Math.abs(w.pageYOffset - 300) <= 1, "The pageYOffset is " + w.pageYOffset);
                        equals(add2desktop._el.offset().top-300,$(window).height() - 70 - 12 , 'the pos is right');
                        approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
                        w.scrollTo(0,0);
                        ta.scrollStop(w);
                        setTimeout(function(){
                            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                            equals(add2desktop._el.width() , 187 , "the width is ok");
                            equals(add2desktop._el.height() , 70 , "the height is ok");
                            equals(add2desktop._el.offset().top, $(window).height() - 70 - 12, 'the pos is right');
                            approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
                            w.$("br").remove();
                            add2desktop.destroy();
                            $(s2).remove();
                            start();
                        },200);
                    },200);
   	            }, 200);
   	         };
        }, w);
	});


	test('window resize', function() {
		expect(10);
		stop();
		ua.frameExt(function(w, f){
            w.localStorage.removeItem("_gmu_adddesktop_key");
			ua.loadcss(["reset.css", "webapp/add2desktop/add2desktop.css"], function(){
                $(f).css({border:"1px solid red"});
				var add2desktop = w.$.ui.add2desktop(w.$('<div class="ui-add2desktop"></div>'), {
					hide : function () {
						ok(true , 'The hide is trigger');
					}
				});
                equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                equals(add2desktop._el.width() , 187 , "the width is ok");
                equals(add2desktop._el.height() , 70 , "the height is ok");
                equals(add2desktop._el.offset().top, 150 - 70 - 12, 'the top is right');
                equals(add2desktop._el.offset().left, 300 * 0.5 - 92,'the left is right');
                $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height",400).css("width", 300);
                $.support.orientation ? ta.orientationchange(w) : ta.resize(w);
                setTimeout(function(){
                    equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                    equals(add2desktop._el.width() , 187 , "the width is ok");
                    equals(add2desktop._el.height() , 70 , "the height is ok");
                    equals(add2desktop._el.offset().top, 400 - 70 - 12, 'the pos is right');
                    equals(add2desktop._el.offset().left, 300 * 0.5 - 92,'the pos is right');
                    add2desktop.destroy();
                    te.dom.push(f.parentNode);
                    start();
                },400);
			}, w);
		});
	});

    test("setup 创建模式" ,function() {
        expect(8);
        stop();
        $("body").append('<div id="add2" style="display: none;"><img src="../../../assets/webapp/add2desktop/icon.png"/><p>先点击<span class="ui-add2desktop-icon"></span>，<br />再"添加至主屏幕"</p></div>');
        window.localStorage.removeItem("_gmu_adddesktop_key");
        var add2desktop =  $('#add2').add2desktop('this');
        setTimeout(function(){
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.attr("class"), "ui-add2desktop", "The el is right");
            equals(add2desktop._el.width() , 187 , "the width is ok");
            equals(add2desktop._el.height() , 70 , "the height is ok");
            equals(add2desktop._el.offset().top, $(window).height() - 70 - 12, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
            ua.click(add2desktop.root().find('.ui-add2desktop-close').get(0));
            setTimeout(function(){
                ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hide");
                ok(add2desktop.key(),"The lcoalStorage exist") ;
                add2desktop.destroy();
                start();
            },100);
        },100);
    });

    test('destroy()', function(){
		stop();
		expect(3);
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var l1 = ua.eventLength();
		var add2desktop = $.ui.add2desktop();
        add2desktop.destroy();
        var a=0;
        for(var i in add2desktop)
            a++;
        equals(a, 0, "The obj is cleared");
        equals($(".ui-add2desktop").length, 0, "The dom is removed");
        var l2 = ua.eventLength();
        equals(l2, l1, "The events are cleared");
        start();
	});
}
else{
	test("test", function(){
		expect(1);
		ok(true, "Doesn't support android");
	});
}