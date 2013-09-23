"use strict";

function bind(scope, fn) {
    return function() {
        fn.apply(scope, arguments);
    };
}
