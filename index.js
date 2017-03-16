"use strict";
var es6_promise_1 = require("es6-promise");
function isLoaded() {
    return typeof window['require'] !== 'undefined';
}
function dojoPromise(modules) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        // If something goes wrong loading the esri/dojo scripts, reject with the error.
        window['require'].on("error", reject);
        window['require'](modules, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Resolve with the parameters from dojo require as an array.
            resolve(args);
        });
    });
}
function esriBootstrap(url) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        if (isLoaded()) {
            // If the API is already loaded, reject with an error message.
            reject('The ArcGIS API for JavaScript has already been loaded!');
        }
        if (!url) {
            url = 'https://js.arcgis.com/4.3/';
        }
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function () {
            // Resolve after the script is loaded.
            resolve();
        };
        // Reject if something goes wrong loading the script.
        script.onerror = reject;
        document.body.appendChild(script);
    });
}
exports.esriBootstrap = esriBootstrap;
function esriPromise(modules) {
    if (!isLoaded()) {
        return esriBootstrap().then(function () { return dojoPromise(modules); });
    }
    else {
        return dojoPromise(modules);
    }
}
exports.esriPromise = esriPromise;
//# sourceMappingURL=index.js.map