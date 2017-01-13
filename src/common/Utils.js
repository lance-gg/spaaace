var Utils = {};

var query_string = null;
Utils.getUrlVars = function() {
    if (!query_string) {
        query_string = {};
        var query = window.location.search.substring(1).toLowerCase();
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1] !== undefined ? pair[1] : true;
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]], pair[1] ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                if (Array.isArray(query_string[pair[0]])) {
                    query_string[pair[0]].push(pair[1]);
                }
            }
        }
    }

    return query_string;
};

Utils.isTouchDevice = function(){
    return 'ontouchstart' in window        // works on most browsers
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

Utils.shortestArc = function(a, b) {
    if (Math.abs(b-a) < Math.PI) return b-a;
    if (b>a) return b-a-Math.PI*2;
    return b-a+Math.PI*2;
};

module.exports = Utils;