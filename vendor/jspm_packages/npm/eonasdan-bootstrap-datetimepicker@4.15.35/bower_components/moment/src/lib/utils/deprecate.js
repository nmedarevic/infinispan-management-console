/* */ 
"format cjs";
import extend from './extend';
import { hooks } from './hooks';

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

export function deprecate(msg, fn) {
    var firstTime = true,
        msgWithStack = msg + '\n' + (new Error()).stack;

    return extend(function () {
        if (firstTime) {
            warn(msgWithStack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

export function deprecateSimple(name, msg) {
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;

