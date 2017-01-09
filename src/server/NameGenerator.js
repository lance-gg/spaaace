'use strict';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// name_generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/

var name_set = {};
var chain_cache = {};

name_set.general = require("./NameSet");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generator function

function generate_name (type) {
    var chain; if (chain = markov_chain(type)) {
        return markov_name(chain);
    }
    return '';
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// generate multiple

function name_list (type, n_of) {
    var list = [];

    var i; for (i = 0; i < n_of; i++) {
        list.push(generate_name(type));
    }
    return list;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// get markov chain by type

function markov_chain (type) {
    var chain; if (chain = chain_cache[type]) {
        return chain;
    } else {
        var list; if (list = name_set[type]) {
            var chain; if (chain = construct_chain(list)) {
                chain_cache[type] = chain;
                return chain;
            }
        }
    }
    return false;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct markov chain from list of names

function construct_chain (list) {
    var chain = {};

    var i; for (i = 0; i < list.length; i++) {
        var names = list[i].split(/\s+/);
        chain = incr_chain(chain,'parts',names.length);

        var j; for (j = 0; j < names.length; j++) {
            var name = names[j];
            chain = incr_chain(chain,'name_len',name.length);

            var c = name.substr(0,1);
            chain = incr_chain(chain,'initial',c);

            var string = name.substr(1);
            var last_c = c;

            while (string.length > 0) {
                var c = string.substr(0,1);
                chain = incr_chain(chain,last_c,c);

                string = string.substr(1);
                last_c = c;
            }
        }
    }
    return scale_chain(chain);
}
function incr_chain (chain, key, token) {
    if (chain[key]) {
        if (chain[key][token]) {
            chain[key][token]++;
        } else {
            chain[key][token] = 1;
        }
    } else {
        chain[key] = {};
        chain[key][token] = 1;
    }
    return chain;
}
function scale_chain (chain) {
    var table_len = {};

    var key; for (key in chain) {
        table_len[key] = 0;

        var token; for (let token in chain[key]) {
            var count = chain[key][token];
            var weighted = Math.floor(Math.pow(count,1.3));

            chain[key][token] = weighted;
            table_len[key] += weighted;
        }
    }
    chain['table_len'] = table_len;
    return chain;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct name from markov chain

function markov_name (chain) {
    var parts = select_link(chain,'parts');
    var names = [];

    var i; for (i = 0; i < parts; i++) {
        var name_len = select_link(chain,'name_len');
        var c = select_link(chain,'initial');
        var name = c;
        var last_c = c;

        while (name.length < name_len) {
            c = select_link(chain,last_c);
            name += c;
            last_c = c;
        }
        names.push(name);
    }
    return names.join(' ');
}
function select_link (chain, key) {
    var len = chain['table_len'][key];
    var idx = Math.floor(Math.random() * len);

    var t = 0; for (let token in chain[key]) {
        t += chain[key][token];
        if (idx < t) { return token; }
    }
    return '-';
}


module.exports = generate_name;