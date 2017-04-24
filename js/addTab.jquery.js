(function($){
    $.fn.extend({

        scrollTabs: function (options) {

            var defaults = {
                content:'content',
                tabs: 'tabs',
                leftId: 'left',
                rightId: 'right',
                visibleTab: 0,
                totalTab: 0,
                tabWidthDefaul:740
            };

            var options =  $.extend(defaults, options);

            return this.each(function() {
                var opts = options;
                opts.tabWidth = 0;
                opts.maxLeft = 0;
                opts.totalTab = 0;
                opts.totalTabWidth = 0;
                var arrTab = [];

                tabs = $(this);
                var tabUL = $('#' + opts.tabs);
                left = $('#' + opts.leftId);
                right = $('#' + opts.rightId);
               
                left.on('click', function () {
                    left.hide();
                    tabUL.animate({
                        left: '+=' + opts.tabWidth
                    }, 300, function () {
                        tabs.trigger('showArrow');
                    });
                })
                
                right.on('click', function () {
                    debugger;
                    right.hide();
                   // console.log(opts.tabWidth)
                    tabUL.animate({
                        left: '-=' + opts.tabWidth
                    }, 300, function () {
                        tabs.trigger('showArrow');
                    });
                });

                var containsObject = function (obj, list) {
                    var i;
                    ///debugger;
                    for (i = 0; i < list.length; i++) {
                        console.log(JSON.stringify(list[i]) == JSON.stringify(obj));
                        if (JSON.stringify(list[i]) == JSON.stringify(obj)) {
                            return true;
                        }
                    }
                    return false;
                }

                tabs.find('a').click(function () {
                    addTab($(this));
                });

                var addTab = function (link) {
                    var id = $(link).attr("rel");
                    var text = $(link).html();
                    var href = $(link).attr("data-href");

                    // If tab already exist in the list, return
                    if ($("#" + id).length != 0) {
                        $("#" + opts.content + " > div").hide();
                        $("#" + opts.tabs + " li").removeClass("current");
                        $("#" + id).parent().addClass("current");
                        $("#" + id + '_content').show();

                        //  //update totalTab
                        var index = $('#' + id).parent().index();
                        tabs.trigger('selectTab', index);
                        return;
                    }
                    
                    // hide other tabs
                    $("#" + opts.tabs+" li").removeClass("current");
                    $("#" + opts.content + " > div").hide();

                    // add new tab and related content
                    $("#" + opts.tabs).append("<li class='current'><a class='tab' id='" +
                        id + "' data-href='" + href + "'>" + text +
                        "</a><a href='#' class='remove'><i class='md-icon-delete material-icons md-card-overlay-toggler'>&#xE14C;</i></a></li>");

                    //tabs.trigger('loadContent', (id, href));
                    loadContent(id, href);
                    
                    // lấy index tab
                    var index = $('#' + id).parent().index();

                    opts.totalTab = $('li', tabUL).length;

                    if (localStorage.getItem("totaltabwidth") != null)
                    {
                        opts.totalTabWidth = parseInt(localStorage.getItem("totaltabwidth"));
                    }

                    opts.tabWidth = $("li", tabUL).outerWidth(true);
                    opts.totalTabWidth += opts.tabWidth;
                    tabUL.css('width', opts.totalTabWidth);

                    //
                    var items = {
                        "id": id,
                        "text": text,
                        "href": href,
                        "width": opts.tabWidth
                    };
                    
                    if (localStorage.getItem("arrtabs") != null) {
                        var data = JSON.parse(localStorage.getItem("arrtabs"));
                        $.each(data, function (i, item) {
                            var exit = containsObject(item, arrTab)
                            if (!exit) {
                                arrTab.push(item);
                            }
                        })
                    }
                    
                    //add items new
                    arrTab.push(items);
                    saveArrTab(arrTab);

                    localStorage.setItem("totaltabwidth", opts.totalTabWidth);
                   
                    //add width in ul
                    if (opts.visibleTab == 0) { //calculate number of visible tab
                        opts.tabWidth = $("li", tabUL).outerWidth(true);
                        opts.visibleTab = Math.floor(opts.tabWidthDefaul / opts.tabWidth);
                    }
                    if (opts.totalTab > opts.visibleTab) {
                        var cuiwidth = tabUL.width();
                        tabUL.css('width', (cuiwidth + opts.tabWidth) + 'px');
                        tabs.trigger('tabMaxLeft');
                    }
                    tabs.trigger('selectTab', index);
                }
                
                var loadTabs = function (id, text, href) {
                    $("#" + opts.tabs).append("<li><a class='tab' id='" +
                        id + "' data-href='" + href + "'>" + text +
                        "</a><a href='#' class='remove'><i class='md-icon-delete material-icons md-card-overlay-toggler'>&#xE14C;</i></a></li>");
                }

                var loadContent= function (id, url) {
                    $("#content").append("<div class='content_tabs' id='" + id + "_content'>Nị dung load ajax ở đây</div>");
                    $("#" + id + "_content").show();

                    //$.ajax({
                    //    type: 'GET',
                    //    dataType: 'html',
                    //    url: url,
                    //    beforeSend: function () {
                    //        // setting a timeout
                    //        $('#loading').show();
                    //    },
                    //    success: function (result) {
                    //        $("#content").append("<div class='content_tabs' id='" + id + "_content'>" +
                    //            result + "</div>");
                    //    },
                    //    complete: function () {
                    //        // set the newly added tab as current
                    //        $("#" + id + "_content").show();
                    //        $('#loading').hide();
                    //    },
                    //});
                }
               
                var saveArrTab = function (arr) {
                    var myJsonString = JSON.stringify(arr);
                    localStorage.setItem("arrtabs", myJsonString);
                }

                var init = function () {
                    var data = JSON.parse(localStorage.getItem("arrtabs"));
                    if (data != null) {
                        //var count = JSON.parse(localStorage.getItem("arrtabs")).length;
                        var total_w = localStorage.getItem('totaltabwidth');
                        tabUL.css('width', total_w + 'px');
                        if (total_w > opts.tabWidthDefaul) {
                            right.show();
                        }
                        else {
                           right.hide();
                        }
                        
                        $.each(data, function (i, item) {
                            opts.tabWidth = item.width;
                            loadTabs(item.id, item.text, item.href);
                        })
                       // right.trigger('click');
                        //left.trigger('click');
                    }
                }
                //if tab closed

                tabUL.on('click', 'a.remove', function () {
                    // Get the tab name
                    var tabid = $(this).parent().find(".tab").attr("id");

                    // remove tab and related content
                    var contentname = tabid + "_content";
                    $("#" + contentname).remove();
                    $(this).parent().remove();

                    // if there is no current tab and if there are still tabs left, show the first one
                    if ($("#" + opts.tabs + " li.current").length == 0 && $("#" + opts.tabs + " li").length > 0) {

                        // find the first tab
                        var firsttab = $("#" + opts.tabs + " li:first-child");
                        firsttab.addClass("current");

                        // get its link name and show related content
                        var firsttabid = $(firsttab).find("a.tab").attr("id");
                        $("#" + firsttabid + "_content").show();
                    }
                    //update totalTab
                    debugger;
                    opts.tabWidth = $("li", tabUL).outerWidth(true);
                    var total_w = tabUL.width() - opts.tabWidth;
                    console.log(total_w);
                    tabUL.css('width', total_w + 'px');
                    
                    tabs.trigger('tabMaxLeft');

                    if (tabUL.position().left < 0) {
                        left.trigger('click');
                       
                    } else if (tabUL.position().left > (opts.maxLeft)) {
                        right.trigger('click');
                    }

                    //if (opts.totalTab <= 0) {
                    //    tabUL.css('visibility', 'hidden');
                    //}
                    // remove stogare

                    var arrdata = JSON.parse(localStorage.getItem("arrtabs"));
                    if (arrdata != null) {
                        arraDataAfterRemove = arrdata.filter(function (el) {
                            return el.id !== tabid;
                        });
                        arrTab = [];

                        $.each(arraDataAfterRemove, function (i, item) {
                            arrTab.push(item);
                        })
                        
                        // lưu lại giá trị
                        saveArrTab(arrTab);

                        console.log("Mảng sau khi xóa: "+ arrTab);
                        // set lại totaltabwidth
                        localStorage.setItem("totaltabwidth", total_w);
                        console.log(localStorage.getItem("totaltabwidth"));
                    }
                });

                tabUL.on('click', 'a.tab', function () {
                    // Get the tab name
                    var id = $(this).attr("id");
                    var href = $(this).attr("data-href");
                    var contentname = id + "_content";
                    // hide all other tabs
                    $("#" + opts.content + " > div").hide();
                    $("#" + opts.tabs + " li").removeClass("current");
                    $(this).parent().addClass("current");
                    
                    if ($("#" + contentname).length > 0) {
                        // show current tab
                        $("#" + contentname).show();
                    }
                    else {
                        loadContent(id, href);
                    }
                });

                tabs.bind('tabMaxLeft', function () {
                    debugger;
                    if (localStorage.getItem("arrtabs") != null) {
                        opts.totalTab = JSON.parse(localStorage.getItem("arrtabs")).length;
                    }
                    opts.visibleTab = Math.floor(opts.tabWidthDefaul / opts.tabWidth);
                    var extraTabs = opts.totalTab - opts.visibleTab;
                    opts.maxLeft = -(extraTabs * opts.tabWidth);
                });

                tabs.bind('selectTab', function (event, index) {
                    debugger;
                    index++;
                    var currentleftPos = tabUL.position().left;
                    var tabHiddenLeft = Math.round(Math.abs(currentleftPos) / opts.tabWidth);
                    opts.visibleTab = Math.floor(opts.tabWidthDefaul / opts.tabWidth);
                    if (tabHiddenLeft >= index) {
                        var rigtAnimate = (tabHiddenLeft - index + 1) * opts.tabWidth;
                        tabUL.animate({
                            left: '+=' + rigtAnimate
                        }, 300, function () {
                            tabs.trigger('showArrow');
                        });
                    } else {
                        var tabonleft = tabHiddenLeft + opts.visibleTab;
                        if (localStorage.getItem("arrtabs") != null)
                        {
                            opts.totalTab = JSON.parse(localStorage.getItem("arrtabs")).length;
                        }
                        var tabHiddenRight = opts.totalTab - tabHiddenLeft - opts.visibleTab;

                        if (tabHiddenRight > 0 && index > tabonleft) {
                            var rightIndex = (index - tabonleft);
                            var leftAnimate = rightIndex * opts.tabWidth;
                            tabUL.animate({
                                left: '-=' + leftAnimate
                            }, 300, function () {
                                tabs.trigger('showArrow');
                            });
                        }
                    }
                });

                tabs.bind('showArrow', function () {
                    opts.totalTab = $('li', tabUL).length;
                    opts.visibleTab = Math.floor(opts.tabWidthDefaul / opts.tabWidth);
                    var currentleftPos = tabUL.position().left;
                    var tabHiddenLeft = Math.round(Math.abs(currentleftPos) / opts.tabWidth);
                    var tabonleft = tabHiddenLeft + opts.visibleTab;
                    var tabHiddenRight = opts.totalTab - tabHiddenLeft - opts.visibleTab;

                    if (tabHiddenLeft > 0) {
                        left.show();
                    } else {
                        left.hide();
                    }

                    if (tabHiddenRight > 0) {
                        right.show();
                    } else {
                        right.hide();
                    }
                });

                // load tabs nếu có localstore
                init();
            });
        }
    });

})(jQuery);