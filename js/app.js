
var MTruong = window.MTruong || (window.MTruong = {});

MTruong.addTab = function(link) {
// If tab already exist in the list, return
    if ($("#" + $(link).attr("rel")).length != 0) {
        $("#content p").hide();
        $("#tabs li").removeClass("current");
        $("#" + $(link).attr("rel")).parent().addClass("current");
        $("#" + $(link).attr("rel") + '_content').show();
        return;
    }

    // hide other tabs
    $("#tabs li").removeClass("current");
    $("#content p").hide();

    // add new tab and related content
    $("#tabs").append("<li class='current'><a class='tab' id='" +
        $(link).attr("rel") + "' href='#'>" + $(link).html() +
        "</a><a href='#' class='remove'>x</a></li>");

    $("#content").append("<p id='" + $(link).attr("rel") + "_content'>" +
        $(link).attr("title") + "</p>");

    // set the newly added tab as current
    $("#" + $(link).attr("rel") + "_content").show();
}

MTruong.execDom = function () {
    $("#documents a").click(function() {
        MTruong.addTab($(this));
    });

    $('#tabs').on('click', 'a.tab', function() {
        // Get the tab name
        var contentname = $(this).attr("id") + "_content";

        // hide all other tabs
        $("#content p").hide();
        $("#tabs li").removeClass("current");

        // show current tab
        $("#" + contentname).show();
        $(this).parent().addClass("current");
    });

    $('#tabs').on('click', 'a.remove', function() {
        // Get the tab name
        var tabid = $(this).parent().find(".tab").attr("id");

        // remove tab and related content
        var contentname = tabid + "_content";
        $("#" + contentname).remove();
        $(this).parent().remove();

        // if there is no current tab and if there are still tabs left, show the first one
        if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

            // find the first tab
            var firsttab = $("#tabs li:first-child");
            firsttab.addClass("current");

            // get its link name and show related content
            var firsttabid = $(firsttab).find("a.tab").attr("id");
            $("#" + firsttabid + "_content").show();
        }
    });
}

MTruong.init = function () {
    MTruong.execDom();
}

$(document).ready(MTruong.init);
