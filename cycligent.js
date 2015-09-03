/**
 * @file Cycligent.js
 *
 * @description
 * <ul><b><li>Asynchronous Script Loading</b> -
 * <span style="background: yellow;">&nbsp;WITHOUT DEPENDENCY DECLARATION&nbsp;</span>
 * <li><b>Classic Object Model</b> - classes, inheritance and interfaces
 * <li><b>Function Argument Augmentation</b>
 * <li><b>Advanced Testing Support</b>
 * </ul>
 * Details:<br>
 * <ul>
 * <li>Asynchronous loading of scripts via import
 * <ul><li>Dependencies do not need to be declared
 *     <li>Dependencies are automatically determined during startup for Cycligent
 *     classes and modules.
 * </ul>
 * <li>A classic object model
 * <ul><li>inheritance
 *     <li>interfaces
 *     <li>private methods (no syntactical sugar required)
 * </ul>
 * <li>Function argument augmentation and validation.
 * <ul><li>Mapped or ordered arguments to the same function
 *     <li>Default values for optional arguments
 *     <li>Validation of supplied arguments (required, quantity and
 *         type)
 *     <li>Handling of advance types (Arrays and HTML elements)
 *     <li>Reuse of argument specifications, especially as it relates to
 *         interfaces.
 * </ul>
 * <li>Advanced testing support
 * <ul><li>Unit
 *     <li>End-to-end
 * </ul>
 * <li>Works with other JavaScript frameworks, including Angular.js.
 * <li>Supports IE9+, Firefox, Chrome, and Safari.
 * <li>No external dependencies.
 * </ul>
 *
 * Changes from the previous version:
 * <ul>
 *     <li>cycligent.url got rid of '/' as having meaning within dotted names,
 *     and now takes the presence of a slash to mean that we're working with a URL.
 *     <li>kernel.js has been combined with cycligent.js
 * </ul>
 *
 * @version 1.0.0
 * @author Frank Garcia
 * @copyright 2008-2015 Improvement Interactive All Rights Reserved Worldwide
 * @license
 * Copyright 2008-2015 Improvement Interactive All Rights Reserved Worldwide
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The Cycligent namespace
 *
 * @namespace cycligent
 */

if (!window.cycligent) {
    window.cycligent = {
        /**
         * Holds information regarding the web application root structures
         * of the application and the environment it runs in.
         *
         * This is automatically created by the Cycligent framework,
         * but you can define it yourself before the framework loads
         * if it's necessary to direct the framework to use non-standard
         * locations for resources (for example, in some testing environments.)
         *
         * @member {object}
         * @memberof cycligent
         *
         * @property {string} app - The application root as an absolute URL
         * @property {string} name - Just the application root name
         * @property {string} client - Root directory for client-side resources
         * as an absolulte URL. Typically used with server-side JavaScript
         * environments where both server and client resources look the same but
         * are placed in different directories. For other environments it is the
         * same as app root.
         * @property {string} deploy - Deployment directory absolute URL, used
         * for accessing other deployed applications, often libraries.
         * @property {string} context - Testing context provides tests with a
         * context for realizing relative paths, essentially the same as what
         * window.location would have been in the actual running code.
         *
         * @example
         * app == "http://some.cloud.com/myApp"
         * name == "myApp"
         * client == "http://some.cloud.com/myApp/client"
         * deploy == "http://some.cloud.com"
         * context == "http://some.cloud.com/myApp/client/myPage"
         */
        root: {
            app: '',
            name: '',
            client: '',
            deploy: '',
            context: ''
        }
    };
}

/**
 * Loads a bootstrap file (before the normal load/import
 * functionality is available).
 *
 * @protected
 * @ignore
 */
cycligent.EarlyLoader = function (id, fileToLoad, successCallBack) {

    var timeoutId = setTimeout(
        /**
         * Handles the kernel file load timeout event.
         *
         * @private
         */
            function () {
            console.error('The load of "' + fileToLoad + '" failed. The system is unable to start the application.');
        },
        (location.hostname == "localhost" || location.hostname == '' ? 7000 : 70000)
    );

    var js = document.createElement("script");
    js.id = id;
    js.type = "text/javascript";
    js.src = fileToLoad;

    /**
     * Handles the file loaded event.
     *
     * @private
     */
    function fileLoaded() {

        if (navigator.appName.indexOf("Netscape") < 0) {
            if (window.event.srcElement.readyState != "loaded" && window.event.srcElement.readyState != "complete") {
                return;
            }
        }

        if (navigator.appName.indexOf("Netscape") >= 0) {
            js.removeEventListener("load", fileLoaded, false);
        }
        else {
            js.detachEvent("onreadystatechange", fileLoaded);
        }

        clearTimeout(timeoutId);
        successCallBack();

    }

    if (navigator.appName.indexOf("Netscape") >= 0) {
        js.addEventListener("load", fileLoaded, false);
    }
    else {
        js.attachEvent("onreadystatechange", fileLoaded);
    }

    document.getElementsByTagName("head")[0].appendChild(js);

};

/**
 * Details the browser in which the code is running.
 *
 * @member {object}
 *
 * @property {boolean} ie      - True when the browser is Internet Explorer
 * @property {boolean} chrome  - True when the browser is Chrome
 * @property {boolean} firefox - True when the browser is Firefox
 * @property {boolean} safari  - True when the browser is Safari
 * @property {float}   version - For IE holds the version number of the browser.
 *
 * @Example
 * if( cycligent.browser.ie ){
 *    alert( "I am running in Internet Explorer!" );
 * }
 */
cycligent.browser = (function () {
    var browser = {
        ie: false,
        chrome: false,
        firefox: false,
        safari: false,
        version: null
    };

    var agent = navigator.userAgent;

    if (navigator.appName.indexOf("Netscape") >= 0) {
        if (agent.indexOf("Chrome") >= 0) {
            browser.chrome = true;
        } else {
            if (agent.indexOf("Firefox") >= 0) {
                browser.firefox = true;
            } else {
                if (agent.indexOf("Safari") >= 0) {
                    browser.safari = true;
                } else {
                    var rv = -1;
                    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[/.0-9]{0,})");
                    if (re.exec(agent) != null){
                        rv = parseFloat( RegExp.$1 );
                    }

                    if(rv >= 10){
                        browser.ie = true;
                        browser.version = rv;
                    }
                }
            }
        }
    }
    else {
        browser.ie = true;
        var offset = agent.indexOf("MSIE ");
        if (offset >= 0) {
            browser.version = parseFloat(agent.substring(offset + 5, agent.indexOf(";", offset)));
        }
    }

    return browser;

})();

/**
 *  Capture console messages and logs them for display (or sending to a
 *  monitoring API)
 *
 *  @module cycligent.console
 */
cycligent.console = (function () {

    var messages = [];
    var notifyFunctions = [];
    var consoleMap = {};
    var countMap = {};

    var messageType = {
        /** Informational message, typically progress message */
        info: "info",
        /** Message that should be logged */
        log: "log",
        /** Warning message, should be reviewed for possible action */
        warn: "warn",
        /** Error message, action required, potential for data loss */
        error: "error"
    };

    var Message = function(type, message, timestamp){

        if(messageType[type] === undefined){
            console.error("Unknown message type '" + type + "' detected in cycligent.console.");
        }

        this.type = type;
        this.message = message;
        if(timestamp){
            //noinspection JSUnusedGlobalSymbols
            this.timestamp = timestamp;
        } else {
            //noinspection JSUnusedGlobalSymbols
            this.timestamp = new Date();
        }
    };

    /**
     * Send notifications to registered notify functions
     *
     * @private
     * @inner
     *
     * @param {Message} [message] - The message
     * associated with the notification or undefined if the notification is due
     * to messages being cleared.
     */
    function notify(message){
        for (var index = 0; index < notifyFunctions.length; index++) {
            notifyFunctions[index](message);
        }
    }

    function clear() {

        messages.splice(0, messages.length);

        for (var index in messageType) {
            if(messageType.hasOwnProperty(index)){
                countMap[index] = 0;
            }
        }

        notify();
    }

    clear();

    /**
     * Adds a message the console message queue
     *
     * @memberof cycligent.console
     * @private
     *
     * @param {cycligent.console.messageType | string} type - The type of message being added.
     * @param {object[]} args - The arguments to be logged
     * (see {@link https://developer.mozilla.org/en-US/docs/Web/API/console})
     */
    function messageAdd(type, args) {

        var text = "";

        // TODO: 5. Could handle string substitution here in the style of the browser console.
        for (var arg = 0; arg < args.length;  arg++) {
            var item = args[arg];
            if (item === null)
                text += "null";
            else if (item === undefined)
                text += "undefined";
            else
                text += args[arg].toString();
        }

        var message = new Message(type, text);

        messages.push(message);

        if (messages.length > 100) {
            messages.shift();
        }

        if (consoleMap[type]) {
            /*
             If you followed a stack trace here, odds are good this isn't where the error came from,
             check a few levels up the stack. We capture and redirect messages sent to the console,
             and this is where that happens. When running on localhost you can prevent this behavior
             by setting cycligent.config.debug.doNotCatchAllExceptionsOnLocalHost to true.
             */
            consoleMap[type].apply(console, args);
        }

        if(countMap[type] !== undefined){
            countMap[type]++;
        }

        notify(message);
    }

    //noinspection JSUnusedGlobalSymbols
    return {
        init: function () {
            // Capture the console if we can
            if (window.console && window.console.log && window.console.log.apply) {
                consoleMap["info"] = console.info;
                consoleMap["log"] = console.log;
                consoleMap["warn"] = console.warn;
                consoleMap["error"] = console.error;
            } else {
                window.console = {};
            }

            window.console.info = cycligent.console.info;
            window.console.log = cycligent.console.log;
            window.console.warn = cycligent.console.warn;
            window.console.error = cycligent.console.error;
            window.console.exception = cycligent.console.error;
        },

        /**
         * Message Type Enumeration
         *
         * @enum {string}
         */
        messageType: messageType,

        /**
         * Console message class
         *
         * @param {cycligent.console.messageType} type - Type of console message.
         * @param {string} message - The text of the message
         * @param {Date} [timestamp=new Date()] - The timestamp of the message
         *
         * @property {cycligent.console.messageType} type - Type of console message.
         * @property {string} message - The text of the message
         * @property {Date} [timestamp=new Date()] - The timestamp of the message
         *
         * @constructor
         * @static
         */
        Message: Message,

        /**
         *  Array of console messages (last 100)
         *
         *  @member {cycligent.console.Message[]}
         */
        messages: messages,

        /**
         * Clear console messages
         *
         * @method
         */
        clear: clear,

        /**
         * Get message count by type or all
         *
         * @method
         *
         * @param {cycligent.console.messageType} [type] - The type of message
         * for which the count is desired, or blank to get the total message
         * count.
         *
         * @return {int} The count
         */
        count: function(type){
            if(type === undefined){
                return messages.length;
            }

            if(countMap[type] === undefined){
                return 0;
            } else {
                return countMap[type];
            }
        },

        /**
         * Register a notification function
         *
         * @method
         *
         * @param func {function} The function to be called whenever a console
         * message is logged or console messages are cleared. The notify function
         * should accept one argument ({@link cycligent.console.Message}) which
         * will be contain the new console message. If the message is not passed
         * to the function (undefined) then the console messages were cleared.
         */
        notify: function (func) {
            // Make sure we don't add a function more than once.
            for(var index = 0; index < notifyFunctions.length; index++){
                if(func === notifyFunctions[index]){
                    return;
                }
            }
            notifyFunctions.push(func)
        },

        /**
         * Unregister a notification function
         *
         * @method
         *
         * @param func {function} The notify function to unregister.
         */
        notifyClear: function (func) {
            for(var index = 0; index < notifyFunctions.length; index++){
                if(func === notifyFunctions[index]){
                    notifyFunctions.splice(index,1);
                    index--;
                }
            }
        },

        /**
         * Log message and present on console.
         *
         * @method
         *
         * @param {cycligent.console.messageType} messageType - The type of message
         * ("info", "log", "warn", "error").
         * @param {(string|object)} messageOrObject - Message or object in the
         * style of console.
         * @param {...object=} additionalOutput - Additional values or objects for
         * output.  If the first parameter was a string then these additional values
         * replace the %<char> items in order, if the first parameter was an object
         * then the additional objects are concatenated to it for output.
         */
        message: function(messageType, messageOrObject, additionalOutput){
            var args = [];
            for(var index = 1; index < arguments.length; index++){
                args.push(arguments[index]);
            }
            messageAdd(messageType, args);
        },

        /**
         * @summary
         * Log informational message and present on console.
         *
         * @description
         * Avoid calling directly in favor of using the standard console.info()
         * function which this simply captures.
         *
         * @method
         *
         * @param {(string|object)} messageOrObject - Message or object in the
         * style of console.
         * @param {...object=} additionalOutput - Additional values or objects for
         * output.  If the first parameter was a string then these additional values
         * replace the %<char> items in order, if the first parameter was an object
         * then the additional objects are concatenated to it for output.
         */
        info: function (messageOrObject, additionalOutput) {
            messageAdd(messageType.info, arguments);
        },

        /**
         * @summary
         * Log informational message and present on console.
         *
         * @description
         * Avoid calling directly in favor of using the standard console.log()
         * function which this simply captures.
         *
         * @method
         *
         * @param {(string|object)} messageOrObject - Message or object in the
         * style of console.
         * @param {...object=} additionalOutput - Additional values or objects for
         * output.  If the first parameter was a string then these additional values
         * replace the %<char> items in order, if the first parameter was an object
         * then the additional objects are concatenated to it for output.
         */
        log: function (messageOrObject, additionalOutput) {
            messageAdd(messageType.log, arguments);
        },

        /**
         * @summary
         * Log informational message and present on console.
         *
         * @description
         * Avoid calling directly in favor of using the standard console.warn()
         * function which this simply captures.
         *
         * @method
         *
         * @param {(string|object)} messageOrObject - Message or object in the
         * style of console.
         * @param {...object=} additionalOutput - Additional values or objects for
         * output.  If the first paramater was a string then these additional values
         * replace the %<char> items in order, if the first parameter was an object
         * then the additional objects are concatenated to it for output.
         */
        warn: function (messageOrObject, additionalOutput) {
            messageAdd(messageType.warn, arguments);
        },

        /**
         * @summary
         * Log informational message and present on console.
         *
         * @description
         * Avoid calling directly in favor of using the standard console.error()
         * function which this simply captures.
         *
         * @method
         *
         * @param {(string|object)} messageOrObject - Message or object in the
         * style of console.
         * @param {...object=} additionalOutput - Additional values or objects for
         * output.  If the first parameter was a string then these additional values
         * replace the %<char> items in order, if the first parameter was an object
         * then the additional objects are concatenated to it for output.
         */
        error: function (messageOrObject, additionalOutput) {
            messageAdd(messageType.error, arguments);
        }
    }
})();

cycligent.console.init();

/**
 * @summary
 * Converts a string, which can be either a URL, or a dotted name into a fully
 * realized URL.
 *
 * @description
 * If the string contains one or more slashes '/' it is treated as a URL.<br>
 * <ul>
 * <li>If the string contains '//', then the string is treated as an absolute
 * URL and is returned as is with an added extension if the extension was not
 * present.
 * <li>If the string begins with a '/', the URL is realized relative to the
 * deploy directory.
 * <li>If the string begins with '@/', the URL is realized relative to the
 * current application root.
 * <li>Otherwise, the URL is realized relative to the current HTML file.
 * </ul>
 * If the string does not contain a slash it is treated as a dotted name.<br>
 * <ul>
 * <li>If the dotted name begins with a '^', the URL is realized relative to
 * the deploy directory.
 * <li>If the dotted name begins with '@', the URL is realized relative to the
 * current application root.
 * <li>If the dotted name begins with '.', the URL is realized relative to the
 * current HTML (window.location) file.
 * <li>Otherwise,
 * <ul>
 * <li>If a dotted name begins with a recognized root then the name is resolved
 * relative to that root (this has the affect of making the '^' optional).
 * <li>Otherwise, the dotted name is resolved relative to the current HTML file
 * (window.location). This has the affect of making the '.' optional in all
 * instances except where the first sub-directory was named the same as the
 * root directory.
 * </ul></ul>
 *
 * @method cycligent.url
 *
 * @param {String} dottedNameOrUrl - The dotted name or URL to resolve.
 * @param {String} [extension='js'] - The file type (extension) of the file
 * for which the URL is to be generated. Defaults to "js" for JavaScript.
 * Only applies to dotted names, URLs must specify the extension.
 *
 * @return {String} - The fully realized (absolute) URL (the location on
 * the server (URL) of the specified resource)
 *
 * @example
 * If we imported the JavaScript file "cycligent.startup.info",
 *   we would be referring to the script named "info.js" in the startup folder,
 *   of a root named "cycligent".
 * If we imported the JavaScript file "^cycligent.startup.info",
 *   we would be referring to the same thing as above, the "^" is a way of
 *   being explicit about the fact that "cycligent" is a root, and not a
 *   folder relative to where the user is. (since the Cycligent Framework
 *   will recognize roots in dotted names, the "^" is optional. You might
 *   want to specify it to be clear to others reading your code that what
 *   you are specifying is from an application root.)
 * If we imported the JavaScript file "@cmn.dashboard.graph",
 *   this refers to an file named "graph.js"  in the "cmn/dashboard"
 *   folder of the current application root. "@" means current
 *   application root.
 * If we imported the JavaScript file ".utils",
 *   we would be referring to a file named "utils.js" in the same folder as
 *   the current HTML file.
 * If we imported the JavaScript file "utils",
 *   it would do the same as above. Thus, if you are loading a file relative to
 *   the current HTML page, you do not need to use the "." in most cases, unless
 *   the file or folder you are loading from has the same name as an application
 *   root.
 * If we imported the JavaScript file //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
 *   that URL would be returned as-is.
 * If we imported the JavaScript file //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min
 *   the extension, which defaults to .js, will be added to the URL.
 * If we imported the JavaScript file, /jquery.min.js
 *   and the application was deploy directory was www.cycligent.com, we would
 *   be referring to www.example.com/jquery.min.js
 * If we imported the JavaScript file, @/jquery.min.js
 *   and the current application root was www.example.com/app, we would
 *   be referring to www.example.com/app/jquery.min.js
 */
cycligent.url = function (dottedNameOrUrl, extension) {

    var fileType = extension;
    if (!fileType) {
        fileType = "js";
    }

    var dottedId = dottedNameOrUrl;

    function extensionEnsure(url, extension) {

        var candidate = /(?:\.([^.]+))?$/.exec(url)[1];

        // If extension already present just return as is - make sure NOT to treat .min as an extension
        // List of extensions could be commented out if desired and then anything other than "min" that
        // looks like an extension will be treated as an extension.
        if (candidate && candidate != 'min' && [
            'htm',
            'html',
            'js',
            'css',
            'gif',
            'jpg',
            'png',
            'cgi',
            'pl',
            'java',
            'class',
            'php',
            'php3',
            'shtm',
            'shtml',
            'asp',
            'cfm',
            'cfml'
        ].indexOf(candidate) >= 0) {
            return url;
        }

        return url + "." + extension;
    }

    if (!dottedId || dottedId === "") {
        console.error("Required argument 'dottedId' was not supplied to cycligent.url.");
    }

    if (dottedId.indexOf("//") >= 0) {
        // Its an absolute path so just return it.
        return extensionEnsure(dottedId, fileType);
    }

    if (dottedId.substr(0, 1) == '/') {
        return extensionEnsure(cycligent.root.deploy + dottedId, fileType);
    }

    if (dottedId.indexOf("@/") == 0) {
        return extensionEnsure(cycligent.root.app + dottedId.substr(1), fileType);
    }

    var elements;
    var url;

    /**
     * Build a url for bases and elements
     *
     * @memberof cycligent.url
     * @inner
     * @private
     *
     * @param {string[]} elements - The segments of the URL to construct
     * @param {string} rootBase - A recognized root to use as the base
     * @param {string} nonRootBase - A non-recognized base to use for the first part of the URL
     *
     * @returns {string} - The built URL
     */
    function urlBuild(elements, rootBase, nonRootBase) {

        var root = cycligent.config.loader.roots[elements[0]];
        var url;

        if (root) {
            url = rootBase + root.root;
        } else {
            url = nonRootBase;
            if (nonRootBase.substr(nonRootBase.length - 1) != "/" && nonRootBase.substr(nonRootBase.length - 1) != "\\") {
                url += "/";
            }
            url += elements[0];
        }
        elements.splice(0, 1);

        if (elements.length > 0) {
            // Make sure the root path ends with a path delimiter
            if (url.substr(url.length - 1, 1) != "/"
                && url.substr(url.length - 1, 1) != "\\"
                ) {
                url += "/";
            }
        }

        return url;
    }

    /**
     * Strips the file portion out of path are returns just the path
     *
     * @memberof cycligent.url
     * @inner
     * @private
     *
     * @param {string} path - The full path, containing a file name
     *
     * @returns {string} - The path without the file name
     */
    function pathNoFile(path) {
        var segments = path.split("/");
        var segment = segments[segments.length - 1];

        if (segment.indexOf(".htm") > 0) {
            segments.splice(segments.length - 1, 1);
        }

        var retVal = segments.join("/");

        if (retVal == "/") {
            retVal = "";
        }

        return retVal;
    }

    // First check for an anchor character...

    switch (dottedId.substr(0, 1)) {
        case '.':   // HTML file (current window location) relative anchor
            elements = dottedId.substr(1).split(".");
            url = window.location.protocol + "//" + window.location.host + pathNoFile(window.location.pathname) + "/";
            break;

        case '^':   // Deploy directory anchor
            elements = dottedId.substr(1).split(".");
            url = urlBuild(elements, cycligent.root.deploy, cycligent.root.deploy);
            break;

        case '@':   // Current application directory anchor
            elements = dottedId.substr(1).split(".");
            url = cycligent.root.client + "/";
            break;

        default:
            elements = dottedId.split(".");
            url = urlBuild(elements, cycligent.root.deploy, window.location.protocol + "//" + window.location.host +
                pathNoFile(window.location.pathname));
            break;
    }

    url += elements.join("/");

    if (cycligent.config.production) {
        url += "-" + cycligent.config.appVersion;
    }

    if (cycligent.config.minimizeSource && (fileType == 'js' || fileType == 'css')) {
        url += ".min";
    }

    return url + "." + fileType;
};

/**
 * @summary
 * Measures application performance.
 *
 * @description
 * Cycligent timing simplifies performance measurement in asynchronous
 * applications. It is basically a continuous timeline that can reviewed.
 * It provides durations of events, including idle time. Cycligent timing
 * is timeline/event oriented. You do not have to issue starts and stops
 * for each item you want to time.  Instead you just signal events and
 * Cycligent does the rest.
 * <br>
 * <ul><li>Event Organization<br>
 * <br>
 * Cycligent timing events can be organized by using indent and unindent
 * functions. These events can then be viewed in a tree fashion. Cycligent
 * extends the indent/unindent approach to handle idle events that are hard
 * to signal because of multiple overlapping asynchronous processes needing
 * to complete. The start of such events can be signaled via
 * [cycligent.timing.asyncBegin]{@link cycligent.module:timing.asyncBegin} or
 * [cycligent.timing.idleIndent]{@link cycligent.module:timing.idleIndent}.
 * The async process can then be completed either
 * [cycligent.timing.idle]{@link cycligent.module:timing.idle}
 * or [cycligent.timing.asyncEnd]{@link cycligent.module:timing.asyncEnd}.
 * When the last asynchronous operation completes the application is marked
 * as idle on the timeline.<br>
 * <br>
 * <li>Idle Tracking & Overlapping Asynchronous Events<br>
 * <br>
 * Multiple overlapping asynchronous events can cause the timeline
 * durations to become muddled (the exact duration of a given operation
 * being cut short by another event with another event looking like it took
 * lonoger).  Cycligent timing does its best to rectify these issues where
 * possible. That being said, Cycligent does not try to eliminate these
 * occurrences. This is because in practice the items are easy to
 * identify when viewed and it is possible to determine the duration of
 * a given process from the timeline.  We have, therefore, favored keeping
 * the API, and the output, simple.<br>
 * <br>
 * <li>External Timing Inclusion<br>
 * <br>
 * Cycligent timing also provides for the inclusion of external performance
 * (timing) information. Normally a duration is not supplied to
 * [cycligent.timing.event]{@link cycligent.module:timing.event} or other event
 * signalling functions. But, if a duration is supplied, then the event is
 * marked as occurring externally. This is useful for including server processing
 * times, such as database query times, in the timeline.  The timeline still tracks
 * durations on either side of the external events with actual durations.
 * If the immediately preceding event in the timeline is at the same
 * indent level as the first external event (usually a single event with
 * descendents) then it duration is automatically subtracted from the
 * duration of the preceding event, which would have normally been the case
 * had the external events occurred internally.<br>
 * <br>
 * <li>Timing Start<br>
 * <br>
 * Cycligent automatically starts timing as soon as it is loaded. You can
 * measure from an earlier point by adding a script tag to the top of your
 * HEAD section, in the initial HTML file loaded, that sets the global
 * variable cycligentRunningBase to the time from which you want to being
 * the running timer.  See the example below.  The example provided
 * measures everything but the time it takes to load the initial HTML
 * file. All scripts, css, etc that it loads, even in the head section,
 * are measured.
 *
 * @module cycligent.timing
 *
 * @example
 * Setting the startring load time via cycligentRunningBase (place at the
 * top of your HEAD section):
 *
 *     <script>window.cycligentRunningBase = (new Date()).getTime();</script>
 *
 * Example of using timings from within an angularjs application:
 *
 * cycligent.timing.eventIndent(false, "Get data", 1);
 * $http.get('/api/data/all')
 *     .success(function (data) {
 *         cycligent.timing.event("Process data", 1);
 *         for (var d in data) {
 *             processData(data[d]);
 *         }
 *         cycligent.timing.event("Process view", 1);
 *         deferred.resolve(data);
 *         cycligent.timing.idle();
 *     });
 */
cycligent.timing = function() {

    var events = [];
    var notifyFunctions = [];
    var indentCurrent = 0;
    var runningBase = (new Date()).getTime();
    var idle = false;
    var idleIndent = 0;

    var TimingEvent = function(title, indent, duration){

        this.title = title;
        this.startTime = (new Date()).getTime();
        if(idle){
            runningBase = this.startTime;
            idle = false;
        }

        if(indent != undefined){
            indentCurrent = indent;
        }

        this.indent = indentCurrent;
        //noinspection JSUnusedGlobalSymbols
        this.hasChildren = false;
        //noinspection JSUnusedGlobalSymbols
        this.expanded = false;
        //noinspection JSUnusedGlobalSymbols
        this.visible = this.indent == 0;

        if(events.length > 0){
            if(events[events.length-1].indent < this.indent) {
                events[events.length - 1].hasChildren = true;
            }
        }

        if(duration === undefined){
            this.pending = true;
            this.external = false;
            this.duration = 0;
        } else {
            this.duration = duration;
            this.pending = false;
            this.external = true;
        }

        this.index = events.length;
        events.push(this);

        scanBackward(this);

        function scanBackward(eventFrom) {

            // Update running times and durations

            var index = events.length - 2;

            var event;
            var eventLast;
            while (index >= 0) {
                eventLast = events[index+1];
                event = events[index];

                if (event.pending) {
                    if (!event.external) {
                        event.duration = eventFrom.startTime - event.startTime;

                        if(eventLast.external && event.indent == eventLast.indent){
                            event.duration -= eventLast.duration;
                        }
                    }
                    if (event.indent >= eventFrom.indent) {
                        event.endTime = eventFrom.startTime;
                    }
                }

                if (event.indent == 0) {
                    scanForward(index);
                    break;
                }

                index--;
            }
        }

        function scanForward(index) {
            var event;
            while (index < events.length) {
                event = events[index];

                if (event.pending) {
                    event.running = event.startTime - runningBase + event.duration;
                    event.pending = event.endTime === undefined;
                }

                index++;
            }

            if(events.length > 200){
                while(events.length > 200){
                    events.shift();
                }

                // Renumber indexes
                for(var i = 0; i < events.length; i++){
                    events[i].index = i;
                }
            }
        }
    };

    /**
     * Send notifications to registered notify functions
     *
     * @private
     * @inner
     *
     * @param {Event} [event] - The timing segment
     * associated with the notification or undefined if the notification is due
     * to timings being cleared.
     */
    function notify(event){
        for (var index = 0; index < notifyFunctions.length; index++) {
            notifyFunctions[index](event);
        }
    }

    function clear() {

        events.splice(0, events.length);
        var event = new TimingEvent("Timings cleared", 0);
        event.idle = true;
        event.running = 0;
        notify();
    }

    /**
     * Cycligent automatically starts timing as soon as it is loaded. You can
     * measure from an earlier point by adding a script tag to the top of your
     * HEAD section, in the initial HTML file loaded, that sets the global
     * variable cycligentRunningBase to the time from which you want to being
     * the running timer.  See the example below.  The example provided
     * measures everything but the time it takes to load the initial HTML
     * file. All scripts, css, etc that it loads, even in the head section,
     * are measured.
     *
     * @example
     * Setting the starting load time via cycligentRunningBase (place at the
     * top of your HEAD section):
     *
     * <script>window.cycligentRunningBase = (new Date()).getTime();</script>
     *
     * @global
     * @type {Date}
     * @name cycligentRunningBase
     */
    if(window.cycligentRunningBase){
        var event = new TimingEvent("Load HTML file components (css & scripts) - does not include HTML file", 0);
        event.startTime = window.cycligentRunningBase;
        runningBase = window.cycligentRunningBase;
    }

    //noinspection JSUnusedGlobalSymbols
    return {

        /**
         * Array of timing events
         *
         * @static
         * @member {cycligent.timing.TimingEvent[]}
         */
        events: events,

        /**
         * Clear console messages
         *
         * @static
         * @method
         */
        clear: clear,

        /**
         * Holds information regarding a performance (timing) event.
         *
         * @class
         * @static
         *
         * @param {string} title - Title of timing event.
         * @param {int} [indent] - The nested level of the event. If not provided
         * the current indent level is used.  The current indent level is the
         * indent last provided to an Event constructor or as modified by
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * or [cycligent.timing.unindent]{@link cycligent.module:timing.unindent}.
         * @param {int} [duration] - Milliseconds event lasted. Only used when
         * the event occurred out-of-band (such as on a server) and the event
         * is being logged to account for those times (such as the time it took
         * for a query to run on the server).
         *
         * @property {string} title - Title of timing event.
         * @property {int} startTime - The number of milliseconds after the
         * JavaScript Epoch that the event started.
         * @property {int} endTime - The number of milliseconds after the
         * JavaScript Epoch that the event ended.
         * @property {int} duration - Milliseconds event lasted.
         * @property {int} running - Total duration of the time line (since the
         * last event at indent level 0).
         * @property {int} indent - The nested level of the event.
         * @property {boolean} pending - True when the event has not yet completed.
         * @property {boolean} external - True when the event was provided by an
         * external source and entered into the event array as is, the duration
         * being computed by the external source. Overall timings are still
         * computed based on the internal clock.
         * @property {boolean} expanded - Indicates if the indent levels beneath
         * this event are displayed.
         * @property {boolean} idle - Indicates that this is an idle event, a
         * period of time where the application is idle, often used to modify
         * the display of the event.
         * @property {boolean} visible - Indicates that the event is visible
         * (not collapsed).
         * @property {boolean} hasChildren - Indicates that this is event has
         * children events underneath it.  Please note, that the event list
         * is a single list (timeline) and that events don't actually have
         * children objects.  Children, here, means that there are items directly
         * beneath this item with a indent level greater than its own.
         *
         * @constructor
         */
        TimingEvent: TimingEvent,

        /**
         * Signals a timing event
         *
         * @static
         *
         * @param {string} title - Title of timing event.
         * @param {int} [indent] - The nested level of the event. If not provided
         * the current indent level is used.  The current indent level is the
         * indent last provided to an Event constructor or as modified by
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * or [cycligent.timing.unindent]{@link cycligent.module:timing.unindent}.
         * @param {int} [duration] - Milliseconds event lasted. Only used when
         * the event occurred out-of-band (such as on a server) and the event
         * is being logged to account for those times (such as the time it took
         * for a query to run on the server).
         */
        event: function(title, indent, duration){
            new TimingEvent(title, indent, duration);
            notify();
        },

        /**
         * @summary
         * Creates a primary event and its first indented event.
         *
         * @description
         * The first indented event, being created at the same time as the
         * primary event, ensures that the indented event durations will
         * total the primary event duration. Durations might not otherwise
         * total the primary event duration because of time passing between
         * the creation of the primary event and its first child event.
         * This is normal but some people like to see the totals add up.
         * While this could be accomplished by simply calling
         * [cycligent.timing.event]{@link cycligent.module:timing.event}
         * in succession, this event provides the same functionality in
         * a single call.<br>
         * <br>
         * In addition to just making the childrens' durations total the
         * primary duration, this function can increase the idle indent.
         * Idle indent allows the determination of an idle state easier
         * when there are multiple overlapping asynchronous events. See
         * {@link cycligent.timing} for more information.
         *
         * @static
         *
         * @param {boolean} increaseIdleIndent
         * @param {string} title
         * @param {int} [indent] - The nested level of the primary (first)
         * event. If not provided the current indent level is used.  The
         * current indent level is the indent last provided to an Event
         * constructor or as modified by [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * or [cycligent.timing.unindent]{@link cycligent.module:timing.unindent}.
         * @param {string} [title2] - The title of the first indented
         * event to the primary event, which is created automatically.
         * Title2 defaults to "Network/Other" and serves as a catch all
         * for any time not required by other segments occurring under
         * the primary event.
         */
        eventIndent: function(increaseIdleIndent, title, indent, title2){

            new TimingEvent(title, indent);
            new TimingEvent(title2 ? title2 : "Network/Other", indent + 1);

            if(increaseIdleIndent) {
                idleIndent++;
            }
            notify();
        },

        /**
         * @summary
         * Begins tracking of an asynchronous process and increases the
         * idle indent.
         *
         * @description
         * Cycligent extends the indent/unindent approach (see
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * and [cycligent.timing.unindent]{@link cycligent.module:timing.unindent})
         * to handle idle events that are hard to signal because of multiple
         * overlapping asynchronous processes needing to complete. The start of such
         * events can be signaled via
         * [cycligent.timing.asyncBegin]{@link cycligent.module:timing.asyncBegin} or
         * [cycligent.timing.idleIndent]{@link cycligent.module:timing.idleIndent}.
         * The async process can then be completed either
         * [cycligent.timing.idle]{@link cycligent.module:timing.idle} or
         * [cycligent.timing.asyncEnd]{@link cycligent.module:timing.asyncEnd}.
         * When the last asynchronous operation completes the application is marked
         * as idle on the timeline.
         *
         * @static
         *
         * @param {string} title - Title of timing event.
         * @param {int} [indent] - The nested level of the event. If not provided
         * the current indent level is used.  The current indent level is the
         * indent last provided to an Event constructor or as modified by
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * or [cycligent.timing.unindent]{@link cycligent.module:timing.unindent}.
         */
        asyncBegin: function(title, indent){
            new TimingEvent(title, indent);
            idleIndent++;
            notify();
        },

        /**
         * @summary
         * End tracking of an asynchronous event and decreases the idle indent.
         * Identical to [cycligent.timing.idle]{@link cycligent.module:timing.idle}.
         *
         * @description
         * Cycligent extends the indent/unindent approach (see
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * and [cycligent.timing.unindent]{@link cycligent.module:timing.unindent})
         * to handle idle events that are hard to signal because of multiple
         * overlapping asynchronous processes needing to complete. The start of such
         * events can be signaled via
         * [cycligent.timing.asyncBegin]{@link cycligent.module:timing.asyncBegin} or
         * [cycligent.timing.idleIndent]{@link cycligent.module:timing.idleIndent}.
         * The async process can then be completed either
         * [cycligent.timing.idle]{@link cycligent.module:timing.idle} or
         * [cycligent.timing.asyncEnd]{@link cycligent.module:timing.asyncEnd}.
         * When the last asynchronous operation completes the application is marked as
         * idle on the timeline.
         *
         * @static
         */
        asyncEnd: function(){
            this.idle();
        },

        /**
         * @static
         *
         * @summary
         * Increases the idle indent
         *
         * @description
         * Cycligent extends the indent/unindent approach (see
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * and [cycligent.timing.unindent]{@link cycligent.module:timing.unindent})
         * to handle idle events that are hard to signal because of multiple
         * overlapping asynchronous processes needing to complete. The start of such
         * events can be signaled via
         * [cycligent.timing.asyncBegin]{@link cycligent.module:timing.asyncBegin} or
         * [cycligent.timing.idleIndent]{@link cycligent.module:timing.idleIndent}.
         * The async process can then be completed either
         * [cycligent.timing.idle]{@link cycligent.module:timing.idle} or
         * [cycligent.timing.asyncEnd]{@link cycligent.module:timing.asyncEnd}.
         * When the last asynchronous operation completes the application is marked
         * as idle on the timeline.
         *
         * @static
         */
        idleIndent: function(){
            idleIndent++;
        },

        /**
         * @summary
         * Indicates that the application is in an idle state, or is potentially
         * in an idle state in the case of multiple overlapping asynchronous
         * events.
         *
         * @description
         * Cycligent extends the indent/unindent approach (see
         * [cycligent.timing.indent]{@link cycligent.module:timing.indent}
         * and [cycligent.timing.unindent]{@link cycligent.module:timing.unindent})
         * to handle idle events that are hard to signal because of multiple
         * overlapping asynchronous processes needing to complete. The start of such
         * events can be signaled via
         * [cycligent.timing.asyncBegin]{@link cycligent.module:timing.asyncBegin} or
         * [cycligent.timing.idleIndent]{@link cycligent.module:timing.idleIndent}.
         * The async process can then be completed either
         * [cycligent.timing.idle]{@link cycligent.module:timing.idle} or
         * [cycligent.timing.asyncEnd]{@link cycligent.module:timing.asyncEnd}.
         * When the last asynchronous operation completes the application is marked
         * as idle on the timeline.
         *
         * @static
         */
        idle: function(){

            // Check to see if one or more other async processes are pending

            if(idleIndent > 1){

                // They are so we are not really idle, so do nothing now
                idleIndent--;

            } else {

                idleIndent = 0;
                // Force times to be computed
                var event = new TimingEvent("Idle", 0);

                event.idle = true;
                event.running = 0;

                idle = true;
                runningBase = undefined;
                notify();
            }
        },

        /**
         * Increase the current indent level by one, up to a maximum of 25.
         *
         * @static
         */
        indent: function(){
            if(indentCurrent < 25) {
                indentCurrent++;
            }
        },

        /**
         * Decrease the current indent level by one, to a minimum of 0.
         *
         * @static
         */
        unindent: function(){
            if(indentCurrent > 0) {
                indentCurrent--;
            }
        },

        /**
         * Register a notification function
         *
         * @param func {function} The function to be called whenever a timing
         * event is logged or timings are cleared. The notify function
         * should accept one argument
         * ([cycligent.timing.TimingEvent]{@link cycligent.module:timing.TimingEvent})
         * which will be contain the new timing segment. If the segment is not
         * passed to the function (undefined) then the timings were cleared.
         *
         * @static
         */
        notify: function (func) {
            // Make sure we don't add a function more than once.
            for(var index = 0; index < notifyFunctions.length; index++){
                if(func === notifyFunctions[index]){
                    return;
                }
            }
            notifyFunctions.push(func)
        },

        /**
         * Unregister a notification function
         *
         * @param func {function} The notify function to unregister.
         *
         * @static
         */
        notifyClear: function (func) {
            for(var index = 0; index < notifyFunctions.length; index++){
                if(func === notifyFunctions[index]){
                    notifyFunctions.splice(index,1);
                    index--;
                }
            }
        }
    }
}();


/**
 * Validates that the loader configuration loaded is valid.  If it finds any
 * required items to be undefined, sets them to their default values.
 *
 * @protected
 * @ignore
 *
 * @returns {boolean} - True if the loader configuration was valid, or made
 * to be valid.
 */
cycligent.loaderValid = function () {

    if (cycligent.config.loader === undefined) {
        console.error("Loader section, cycligent.config.loader, is missing from the configuration file.");
        return false;
    }

    if (cycligent.config.loader.roots === undefined) {
        console.error("Root definitions are required but the roots sections, cycligent.config.loader.roots, is missing from the configuration file.");
        return false;
    }

    if (cycligent.config.loader.timeout === undefined) {
        cycligent.config.loader.timeout = (location.hostname == "localhost" || location.hostname == '' ? 7000 : 70000);
    }

    return true;
};

/**
 * Validates that the debug configuration loaded is valid.  If it finds any
 * required items to be undefined, sets them to their default values.
 *
 * @protected
 * @ignore
 *
 * @returns {boolean} - True if the debug configuration was valid, or made to
 * be valid.
 */
cycligent.debugValid = function () {

    //noinspection JSValidateTypes
    if (cycligent.config.debug === undefined) {
        //noinspection JSValidateTypes
        cycligent.config.debug = {};
    }

    if (cycligent.config.debug.private === undefined) {
        //noinspection JSPrimitiveTypeWrapperUsage
        cycligent.config.debug.private = {};
    }

    if (!cycligent.config.debug.on) {
        cycligent.config.debug.private.check = false;
    }

    if (cycligent.config.debug.args === undefined) {
        //noinspection JSPrimitiveTypeWrapperUsage
        cycligent.config.debug.args = {};
    }

    if (!cycligent.config.debug.on) {
        cycligent.config.debug.args.check = false;
    }

    if (cycligent.config.debug.args.arrays === undefined) {
        cycligent.config.debug.args.arrays = {};
    }

    if (!cycligent.config.debug.args.check) {
        cycligent.config.debug.args.arrays.check = false;
    }

    if (cycligent.config.debug.interfaces === undefined) {
        //noinspection JSPrimitiveTypeWrapperUsage
        cycligent.config.debug.interfaces = {};
    }

    if (!cycligent.config.debug.on) {
        cycligent.config.debug.interfaces.check = false;
    }

    if (!cycligent.config.debug.on) {
        //noinspection JSPrimitiveTypeWrapperUsage
        cycligent.config.debug.scripts = false;
    }

    return true;
};

/*************************
 *   B O O T S T R A P   *
 *************************/

/**
 * Bootstraps Cycligent after dependencies have been loaded.
 *
 * @module cycligent.boot
 *
 * @private
 */
cycligent.boot = function() {

    cycligent.timing.event("Boot Cycligent", 0);

    /**
     * Provides functions that supply debugging information. Typically used
     * internally by the Cycligent. This support object allows argument types
     * to functions to be output, as well as function names.
     *
     * @module cycligent.debug {object}
     * @protected
     * @ignore
     */
    cycligent.debug = {

        /**
         * Given an argument passed to a function this function returns a
         * string representing the argument's type.
         *
         * @param {({tagName: (string|undefined)}|*)} argType
         *
         * @return {string} The type, as a string, of the argument passed.
         */
        argTypeText: function (argType) {

            var text;

            if(argType === null){
                return "null";
            }

            if (argType.tagName !== undefined) {
                text = "HtmlElement:" + argType.tagName +
                    " or XmlNode:" + argType.tagName;
            }
            else if (argType.nodeName && argType.nodeName == "#document") {
                text = "Document";
            }
            else {
                if (argType.cycligentClass) {
                    text = argType.cycligentClass;
                } else if (argType.prototype instanceof Interface) {
                    text = argType.name;
                }
                else {
                    if (argType.constructor === Function) {
                        text = cycligent.debug.functionName(argType);
                    }
                    else {
                        text = cycligent.debug.functionName(argType.constructor);

                        if (text == "(?)") {
                            text = "Unknown";
                        }
                    }
                }
            }

            return text;
        },

        /**
         * Given an item of an cycligent argument specification, returns the
         * type, in the form of a string, that the specification requires
         * for that item (argument). For more information on cycligent
         * arguments specifications please see {@link cycligent.args}.
         *
         * @return {string} The type, in a string, required by the specification
         * for a string.
         */
        specTypeText: function (specType) {

            var text;

            if (typeof specType == "string") {
                text = specType;
            }
            else {
                if (specType.prototype && specType.prototype.cycligentClass) {
                    text = specType.prototype.cycligentClass;
                }
                else {
                    text = this.argTypeText(specType);
                }
            }

            return text;
        },

        /**
         * Given a function, returns its name as a string.
         *
         * @return {string} The name of the function.
         */
        functionName: function (fn) {

            var text;

            var match = fn.toString().match(/function\s*(\w+)\(/);

            if (match === null) {
                //noinspection JSUnresolvedVariable
                if (fn === jQuery) {
                    text = "jQuery"
                } else {
                    text = "(?)"; //"ANONYMOUS";
                }
            }
            else {
                text = match[1];
            }

            return text;
        }

    };

    /**
     * Base class for providing classical inheritance<br>
     * Inspired by John Resig (http://ejohn.org/blog/simple-javascript-inheritance/)
     * which in turn was inspired by base2 and Prototype.
     *
     * @method _classicalClass
     * @memberof cycligent.boot
     * @private
     */
    (function _classicalClass() {
        var initializing = false;

        /**
         * Internal base class implementation providing classical inheritance.
         *
         * @memberof cycligent.boot
         */
        window.Class = function () { };

        /**
         * Extends a class. Creates a new class that inherits from this class
         *
         * @memberof cycligent.boot
         * @private
         *
         * @param {string} cycligentClass - Name of cycligent class
         * @param {object} prop - The class declaration in the form of an object.
         *
         * @return {Class} Returns the new class.
         */
        Class.extend = function(cycligentClass, prop) {
            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            prototype.cycligentClass = cycligentClass;
            initializing = false;

            // Copy the properties over onto the new prototype
            // The follow loop was modified from the inspiration to correctly
            // support stack traces.
            var holder;
            for (var name in prop) {
                if (!prop.hasOwnProperty(name)) continue;

                holder = prototype[name];
                prototype[name] = prop[name];

                if (typeof prototype[name] == "function" && holder) {
                    prototype[name].super = holder;
                }

            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init) {
                    this.init.apply(this, arguments);
                }
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };
    })();


    /**
     * Base interface for providing classical interfaces.
     *
     * @method _classicalInterface
     * @memberof cycligent.boot
     * @private
     */
    (function _classicalInterface() {

        /**
         * Internal base interface implementation providing classical inheritance.
         *
         * @memberof cycligent.boot
         */
        window.Interface = function () { };

        /**
         * Extends an Interface.
         *
         * @memberof cycligent.boot
         * @private
         *
         * @param {object} prop - The interface declaration in the form of an
         * object literal.
         *
         * @return {Interface} Returns the new interface.
         */
        Interface.extend = function(prop) {

            var prototype = new this();
            // Copy the properties over onto the new prototype
            for (var name in prop) {
                if (prop.hasOwnProperty(name)) {
                    prototype[name] = prop[name];
                }
            }

            // The dummy interface constructor
            function Interface() { }

            // Populate our constructed prototype object
            Interface.prototype = prototype;

            // Enforce the constructor to be what we expect
            Interface.constructor = Interface;

            // And make this class extend-able
            Interface.extend = arguments.callee;

            return Interface;
        };
    })();


    /**
     * Enhances and optionally validates the arguments passed to a function.<br>
     * <br>
     * cycligent.args always takes the form cycligent.args(arguments, [ArgumentSpec]);<br>
     * <br>
     * Argument specifications take the form of an object literal which contains
     * one or more properties.  Each of these properties represents an argument.
     * Each of the argument properties contains another object literal that
     * defines the attributes of the argument.  The available argument attributes
     * are type, required and defaultValue. See examples below for how to structure
     * argument specifications.<br>
     * <br>
     * The Cycligent Framework provides the following enhancement for function arguments:
     * <br>
     * <br>
     * <li>Mapped or ordered arguments for the same function</li>
     * <li>Default values for optional arguments</li>
     * <li>Validation of supplied arguments (required, quantity and type)</li>
     * <li>Handling of advanced types (Arrays and HTML elements)</li>
     * <li>Reuse of argument specifications, especially useful with interfaces</li>
     * <br>
     * cycligent.args supports either mapped or ordered arguments.  When a single
     * argument is passed to a function, and that argument is an object,
     * and that object contains a property named the same as an argument,
     * it is assumed to be an argument map. In all other cases the system
     * treats the arguments as ordered. To pass a single object to a function
     * that has a property with the same name as an argument
     * it must be passed in  as a map. (function( object ) will not work).
     * The construct of  function( {argumentName: object} ) must be used
     * instead. When a map is not used the arguments must be passed in the
     * order of their declaration.<br>
     * <br>
     * cycligent.args will also provide default values for optional arguments that
     * are not supplied, if a default value for the optional argument has been
     * provided.<br>
     * <br>
     * Supplied arguments can be validated for correctness. Validations are
     * performed when {@link cycligent.config.debug.on} and
     * {@link cycligent.config.debug.args.check} are true. When validation is active
     * arguments are validated for the correct type, that all required
     * arguments were supplied, and that the correct number of arguments were
     * supplied.<br>
     * <br>
     * All required arguments must appear before any optional arguments. This
     * conventions allows cycligent.args to successfully parse arguments which are
     * passed to a function but are not in a map.<br>
     * <br>
     * cycligent.args supports advanced types. Array arguments can be specified
     * by wrapping the type in square brackets, as in "[String]" (which indicates
     * that the function takes an array of strings).  When validation is on,
     * {@link cycligent.config.debug.args.arrays.check} is true, then arrays are checked
     * for the correct type.  When {@link cycligent.config.debug.args.arrays.allElements}
     * is true, elements of the array validated to contain the correct type.
     * This can be very time consuming and is not recommended.  Therefore,
     * {@link cycligent.config.debug.args.arrays.allElements} defaults to false, in which
     * case only the first element of the array is validated.<br>
     * <br>
     * In addition to arrays, cycligent.args supports special types.  Specials types are
     * passed as a string.  Currently cycligent.args supports Document, HTML elements and
     * XML nodes as special types. Document is a DOM/XML document. If an argument
     * can take any HTML element then
     * the argument specification would be "HtmlElement".  Likewise for any XML
     * node the argument would by "XmlNode". If an argument requires a specific
     * type of HTML element or XML node, such as a div, then that is specified
     * by postfixing the "HtmlElement" or "XmlNode" with a colon and the elements
     * tag name (in all lowercase) as in "HtmlElement:div" or "XmlNode:item".<br>
     * <br>
     * Argument specifications can be stored in a variable and reused. This is
     * especially helpful when interfaces are declared. When an interface is
     * declared the signatures for its methods are stored in the interfaces
     * prototype. This allows the developer to use these prototype properties
     * in the creation of methods on an object that implements the interface.<br>
     * <br>
     * The convention when working with the cycligent framework is to use a
     * variable named 'a' to hold the return value from cycligent.args.
     * variable named 'a' to hold the return value from cycligent.args.
     *
     * @method cycligent.args
     *
     * @param {arguments[]} argsIn - The arguments object that is
     * passed/present in a function.
     * @param {Object} spec - The argument specification.
     * @param {Boolean} [ignoreExtraArguments=false] - When true extra arguments are
     * ignored. Typically used by base classes that are inherited to allow
     * the super class to pass the argument list passed to it to the base
     * class.
     *
     * @Example
     * // Using examples from the Cycligent framework itself:
     *
     * cycligent.class = function(){
     *     var a = cycligent.args(arguments, {
     *         name:{type: String},                         // The fully qualified name of the class being created
     *         definition:{type: Object},                   // The object literal that defines the class
     *         extends:{type: Object, required: false},     // The class from which this class inherits its methods and properties
     *         implements:{type: [Object], required: false} // The newly created class implements the interface class or classes specified
     *     });
     *     ...
     *
     * ********** OR VIA REUSABLE ARGS **********
     * 
     * cycligent.classArgs = {
     *     name:{type: String},                             // The fully qualified name of the class being created
     *     definition:{type: Object},                       // The object literal that defines the class
     *     extends:{type: Object, required: false},         // The class from which this class inherits its methods and properties
     *     implements:{type: [Object], required: false}     // The newly created class implements the interface class or classes specified
     * };
     *
     * cycligent.class = function(){
     *     var a = cycligent.args(arguments, cycligent.classArgs);
     *     ...
     *
     * ********** OR VIA INTERFACE **********
     * 
     * cycligent.tracerMessageArgs = {
     *     message:{type: String},                          // The trace message.
     *     type:{type: Number, required: false, defaultValue: cycligent.traceTypes.information }, // The trace type (a value from cycligent.traceTypes).
     *     category:{type: String, required: false, defaultValue: ""}, // A string representing the category of the trace. Used for filtering (see cycligent.config.trace).
     *     ex: {type: Object, required: false}
     * };
     * 
     * cycligent.interface({
     *     name: "cycligent.TracerInt",
     *     definition:{
     *         getElement: {},                              // Gets the HTML element that holds the trace information.
     *         setElement: {element: {type: "HtmlElement:DIV"}}, // Sets the HTML element that holds the trace information.
     *         trace: cycligent.tracerMessageArgs                  // Issue a trace.
     *     }
     * });
     * 
     * ...
     * trace: function(){
     *     cycligent.args(arguments,cycligent.TracerInt.prototype.trace);
     * ...
     */
    cycligent.args = function(argsIn, spec, ignoreExtraArguments) {

        var argsInSeen = 0;
        var argsOut = {};

        var specIndex;

        var value;
        var positionIndex = 0;

        // Was argument list passed as an object or as separate arguments?

        // When a single object is passed as the only argument. We assume that
        // it is a map.  To pass only a single object as the only argument to a
        // function it must be passed in as a map

        // Assume it was.
        var map = false;

        if (argsIn.length == 1) {
            for (specIndex in spec) {
                if (!spec.hasOwnProperty(specIndex)) continue;
                if (argsIn[0] !== undefined && argsIn[0] !== null && argsIn[0][specIndex] !== undefined) {
                    map = true;
                    break;
                }
            }
        }


        // We use two loops so that we don't have to test map on every iteration
        // of the loop.
        if (map) {
            for (specIndex in spec) {
                if (!spec.hasOwnProperty(specIndex)) continue;
                value = argsIn[0][specIndex];
                if (value !== undefined) {
                    argsOut[specIndex] = value;
                    argsInSeen++;
                }
                else {
                    argsOut[specIndex] = spec[specIndex].defaultValue;
                }
            }
        }
        else {
            for (specIndex in spec) {
                if (!spec.hasOwnProperty(specIndex)) continue;
                value = argsIn[positionIndex++];
                if (value !== undefined) {
                    argsOut[specIndex] = value;
                    argsInSeen++;
                }
                else {
                    argsOut[specIndex] = spec[specIndex].defaultValue;
                }
            }
        }

        // CycligentBuilder.delete.start
        /**
         * Validates a single argument against its expected type
         *
         * @method
         * @memberof cycligent.args
         * @inner
         * @private
         *
         * @param {*} argType - The expected type of the argument
         * @param {*} argActual - The actual argument
         *
         * @returns {boolean} - True if the argument is valid, false if it is invalid
         */
        function argValid(argType, argActual) {
            // Check for a "special" type
            if (typeof argType == "string") {

                var baseType;
                var baseTypeMatch = argType.match(/\w+(?=($|:))/);
                if (baseTypeMatch === null) {
                    baseType = baseTypeMatch;
                }
                else {
                    baseType = baseTypeMatch[0];
                }

                switch (baseType) {

                    case "Any":
                        return true;

                    case "HtmlElement":

                        if (argActual.tagName === undefined) {
                            return false;
                        }
                        else {
                            // Check for a specific element type
                            if (argType.substr(11, 1) == ":") {
                                if (argType.substr(12).toLowerCase() != argActual.tagName.toLowerCase()) {
                                    return false;
                                }
                            }
                        }

                        break;

                    case "XmlNode":

                        if (argActual.tagName === undefined) {
                            return false;
                        }
                        else {
                            // Check for a specific element type
                            if (argType.substr(7, 1) == ":") {
                                if (argType.substr(8).toLowerCase() != argActual.tagName.toLowerCase()) {
                                    return false;
                                }
                            }
                        }

                        break;

                    case "Document":

                        if (!argActual.nodeName || argActual.nodeName != "#document") {
                            return false;
                        }

                        break;

                    default:
                        console.error("An unknown special type '" + baseType +
                            "' was specified for the argument '" + specIndex +
                            "'.");
                        return false;
                }
            }
            else {
                if (argActual !== null && !(argActual.constructor == argType || argActual instanceof argType)) {
                    if (argActual.isPrototypeOf != argType.isPrototypeOf) {
                        // Handle the special case of the same object type being compared in two different windows
                        // This is not a perfect check but the best we can do across windows
                        var argClass = cycligent.debug.argTypeText(argActual);
                        var specClass = cycligent.debug.specTypeText(argType);
                        if (argClass != specClass) {
                            // Check for a subclass
                            if (argClass.substr(0, specClass.length + 1) != specClass + ".") {
                                if (argClass.split(".")[0] == specClass.split(".")[0]) {
                                    console.warn("An unverifiable type (due to cross window access) of '" + argClass +
                                            "' was assumed to by of type '" + specClass +
                                            "' because the first segment of the dotted name matched."
                                    );

                                } else {
                                    return false;
                                }
                            }
                        }
                    } else if (argType.prototype instanceof Interface) {
                        return (argActual.cycligentInterfaces && argActual.cycligentInterfaces.indexOf(argType) != -1);
                    } else {
                        return false;
                    }
                }
            }

            return true;
        }

        if (cycligent.config.debug.args.check) {
            // Validate that the spec (specification) has all required arguments first.

            for (specIndex in spec) {
                if (!spec.hasOwnProperty(specIndex)) continue;
                var typeIsArray = spec[specIndex].type.constructor == Array || spec[specIndex].type.constructor instanceof Array;
                var typeCurrent;
                if (typeIsArray) {
                    typeCurrent = spec[specIndex].type[0];
                } else {
                    typeCurrent = spec[specIndex].type;
                }
                var isInterface = (typeCurrent.prototype instanceof Interface);
                var defaultTypeMessage;
                if (isInterface) {
                    defaultTypeMessage = "which does not declare that it implements the interface";
                } else {
                    defaultTypeMessage = "but is required to be of type";
                }

                if (argsOut[specIndex] === undefined) {
                    // Validate required arguments
                    if (spec[specIndex].required === undefined || spec[specIndex].required) {
                        var notSuppliedMessage;
                        if (isInterface) {
                            notSuppliedMessage = "which must implement the interface";
                        } else {
                            notSuppliedMessage = "of type";
                        }
                        console.error("The required argument '" + specIndex +
                            "' " + notSuppliedMessage + " '" + cycligent.debug.specTypeText(typeCurrent) +
                            "' was not supplied." + (map ? " A single object must be passed as a map. If appropriate use: {" + specIndex + ":[Object]} to pass a single object for this function." : ""));
                    }
                }
                else {
                    if (typeIsArray) {
                        //Validate array arguments
                        if (argsOut[specIndex] && (argsOut[specIndex].constructor == Array || argsOut[specIndex].constructor instanceof Array)) {
                            if (cycligent.config.debug.args.arrays.check) {
                                if (cycligent.config.debug.args.arrays.allElements) {
                                    var arrayIndex;
                                    for (arrayIndex = 0; arrayIndex < argsOut[specIndex].length; arrayIndex++) {
                                        if (!argValid(typeCurrent, argsOut[specIndex][arrayIndex])) {
                                            console.error("Element '" + arrayIndex + "' of the array passed as an argument was of type '" + cycligent.debug.argTypeText(argsOut[specIndex][arrayIndex]) + "' " + defaultTypeMessage + " '" + cycligent.debug.specTypeText(typeCurrent) + "'.");
                                            break;
                                        }
                                    }
                                }
                                else {
                                    if (argsOut[specIndex].length > 0 && !argValid(typeCurrent, argsOut[specIndex][0])) {
                                        console.error("The first element of the array passed as an argument was of type '" + cycligent.debug.argTypeText(argsOut[specIndex][0]) + "' " + defaultTypeMessage + " '" + cycligent.debug.specTypeText(typeCurrent) + "'.");
                                    }
                                }
                            }
                        }
                        else {
                            // Spec called for an array argument but an array
                            // argument was not supplied.

                            console.error("An array argument was required but instead an argument of type '" + cycligent.debug.argTypeText(argsOut[specIndex]) + "' was supplied.");
                        }
                    }
                    else {
                        // Validate a non array argument
                        if (!argValid(typeCurrent, argsOut[specIndex])) {
                            console.error("The argument '" + specIndex + "' was of type '" + cycligent.debug.argTypeText(argsOut[specIndex]) + "' " + defaultTypeMessage + " '" + cycligent.debug.specTypeText(typeCurrent) + "'.");
                        }
                    }
                }
            }

            if (!ignoreExtraArguments) {

                if (map) {
                    for (var inIndex in argsIn[0]) {
                        if (!argsIn[0].hasOwnProperty(inIndex)) continue;
                        if (!spec[inIndex]) {
                            console.error("Unrecognized argument '" + inIndex + "' was supplied.");
                        }
                    }
                }
                else {
                    if (argsInSeen > argsIn.length) {
                        console.error("Extra arguments were supplied.");
                    }
                }


            }
        }
        // CycligentBuilder.delete.end

        return argsOut;
    };

    cycligent.definitionGetArgs = {
        "name": { "type": String, "required": false } // Name of the definition to find (e.g. cycligentClass, cycligentInterface, etc.)
    };

    /**
     * Finds a definition value, where the definition name is allowed to be a string
     * that has dots in it, and will be properly found nested within a JavaScript object.
     * It is common in Cycligent to define class names using a dotted syntax, such as cycligent.console.
     * These names are stored as nested JavaScript objects, but the names are also commonly passed
     * around as strings, which becomes difficult when you want to access them easily from the
     * string name, this function and {@link cycligent.definitionSet} help make this
     * very simple and easy. The definition is found starting from the window object.
     *
     * This function assumes that the nested structure you're trying to pull data out of exists.
     *
     * @method cycligent.definitionGet
     *
     * @param {string} dottedName - The dotted name to find.
     *
     * @return {object} - The value of the dotted name
     *
     * @Example
     * cycligent.definitionGet("MyNamespace.MyClass");
     */
    cycligent.definitionGet = function(dottedName) {
        var args = cycligent['args'](arguments, cycligent.definitionGetArgs);
        if (args.name === undefined)
            return undefined;

        var split = args.name.split('.');
        var currentObj = window;
        for (var i = 0; i < split.length; i++) {
            currentObj = currentObj[split[i]];
        }
        return currentObj;
    };

    cycligent.definitionSetArgs = {
        "name": { "type": String }, // Name of the definition to find (e.g. cycligentClass, cycligentInterface, etc.)
        "value": { "type": "Any" } // Value to set the name to.
    };

    /**
     * Sets a definition to a value, where the definition name is allowed to be a string
     * that has dots in it, and will be properly assigned to a nested JavaScript object.
     * It is common in Cycligent to define class names using a dotted syntax, such as cycligent.Tracer.
     * These names are stored as nested JavaScript objects, but the names are also commonly passed
     * around as strings, which becomes difficult when you want to access them easily from the
     * string name, this function and {@link cycligent.definitionGet} help make this
     * very simple and easy. The definition is assigned starting from the window object.
     *
     * This function assumes that the nested structure you're trying to put data into exists.
     *
     * @method cycligent.definitionSet
     *
     * @param {(string | object)} dottedName - The dotted name to set. Or a map of the
     * arguments.
     * @param {*} [value] - The value to set the dotted name to.
     * @return {*}
     *
     * @Example
     * cycligent.definitionSet("MyNamespace.MyClass", classDefinition);
     */
    cycligent.definitionSet = function(dottedName, value) {
        var args = cycligent['args'](arguments, cycligent.definitionSetArgs);

        var split = args.name.split('.');
        var currentObj = window;
        for (var i = 0; i < split.length-1; i++) {
            currentObj = currentObj[split[i]];
        }

        currentObj[split[split.length-1]] = args['value'];
        return args['value'];
    };

    // The following two objects facilitate the validation of interfaces
    // implemented by classes.
    cycligent.classes = {};
    cycligent.interfaces = {};

    cycligent.classesToProcess = [];
    cycligent.interfacesToProcess = [];

    /**
     * Arguments for cycligent.class.
     *
     * @memberof cycligent
     *
     * @property {string} name - The fully qualified dotted name fo the class.
     * @property {string} [extends] - The fully qualified dotted name of the
     * class to extend.
     * @property {...string} [implements] - The fully qualified dotted names of the
     * interfaces required by the class. If the class implements multiple
     * interfaces, separate them by commas.
     * @property {object} definition - The object, usually from a code literal,
     * that defines the class.
     *
     * @see {@link cycligent.class}
     */
    cycligent.classArgs = {
        name: { type: String },							// The fully qualified name of the class being created.
        definition: { type: Object },						// The object literal that defines the class.
        extends: { type: String, required: false },		// The class name, as a string, from which this class inherits its methods and properties. Defaults to "Class".
        implements: { type: String, required: false }		// The newly created class implements the interface or interface names specified. This argument should be passed as a string, multiple interfaces should be seperated by a comma.
    };

    //noinspection ReservedWordAsName
    /**
     * @summary
     * Declares a class that supports classical inheritance and interfaces.
     *
     * @description
     * cycligent.class allows a class to be created that extends (inherits from) another
     * class. It also provides for the implementation of interfaces. To make class
     * definitions easy to follow, it is recommended that calls to cycligent.class use
     * mapped arguments in the following order: name, extends, implements, definition.
     * See the example below. cycligent.class also validates that the first character of
     * the class name is an uppercase letter, which is the common convention in
     * JavaScript.<br>
     * <br>
     * cycligent.class definitions should be placed outside of functions. This allows
     * them to be processed at startup. The processing of class definitions that
     * are dependant on other class definitions that have not yet been processed
     * are deferred until they can be processed.  This allows race conditions
     * during the asynchronous loading of scripts at startup to be avoided, and makes the
     * order in which scripts are loaded unimportant.<br>
     * <br>
     * If enabled in the configuration settings (see {@link cycligent.config.debug.interfaces})
     * the interfaces implemented by the class are validated. This is done by checking
     * the class's source to see if it is calling {@link cycligent.args} on the argument
     * definition defined by the interface.
     * <br>
     * Note that if you define a class, you can create it as a singleton using
     * {@link cycligent.singleton}. Singleton classes can have an initSingleton that
     * will be called when the class is instantiated as a singleton.
     *
     * @method cycligent.class
     *
     * @param {object} map - The object that specifies the class, typically
     * from an object literal in code (see example, and {@link cycligent.classArgs}).
     *
     * @property {string} cycligentClass - The name of the class as a property
     * of the prototype.
     *
     * @see {@link cycligent.singleton}
     *
     * @Example
     * cycligent.class({
     *     name: "cycligent.Tracer",
     *     extends: "cycligent.ExtendThisClassExample"
     *     implements: "cycligent.TracerInt, cycligent.anotherInterface",
     *     definition: {
     *         ...
     *     }
     * });
     */
    cycligent.class = function(map) {
        var args = cycligent.args(arguments, cycligent.classArgs);

        // Converts implements argument into an array
        if (args.implements) {
            args.implements = args.implements.split(",");
            // Trim the elements of the array
            for (var index = 0; index < args.implements.length; index++) {
                args.implements[index] = args.implements[index].replace(/(^\s*|\s*$)/g, "");
            }
        }

        // Check to see if this class is ready to be processed (all of its
        // dependencies have already been processed).

        if (cycligent.classMissing(args) == "") {
            cycligent.classProcess(args);
            cycligent.classProcessDeferred();
        }
        else {
            cycligent.classes[args.name] = false;
            cycligent.classesToProcess.push(args);
        }
    };

    /**
     * Takes a class name and returns a singleton object.  If the singleton
     * object already exists it simply returns it, if not, it creates it.
     *
     * @method cycligent.singleton
     *
     * @param {string} name - The name of the class from which to construct the singleton
     * @param {...*} arguments - Arguments to singleton constructor
     *
     * @property {function} initSingleton - If initSingleton is defined by the
     * class it is called when the singleton is instantiated.
     *
     * @returns {Object}
     *
     * @see {@link cycligent.class}
     *
     * @example
     * cycligent.define("app");
     * cycligent.class({
     *     name: "app.Session",
     *     definition: {
     *         initSingleton: function() {
     *             cycligent.args(arguments, {});
     *             var me = this;
     *             $.get("/sessionData", function(data) {
     *                 me.data = data;
     *             });
     *         },
     *
     *         userName: function() {
     *             return this.data.username;
     *         }
     *     }
     * });
     *
     * function main() {
     *     var session = cycligent.singleton("app.Session");
     * }
     */
    cycligent.singleton = function(name) {
        var args = cycligent.args(arguments, {
            className: { type: String }
        });

        var className = args.className + ".singleton";

        var classValue = cycligent.definitionGet(className);

        if (!classValue) {
            classValue = cycligent.definitionSet({
                "name": className,
                "value": new (cycligent.definitionGet(args['className']))()
            });

            if (classValue.initSingleton) {
                var a = [];
                for (var i = 2; i < arguments.length; i++) {
                    a.push(arguments[i]);
                }
                classValue.initSingleton.apply(classValue, a);
            }
        }

        return classValue;
    };

    /**
     * Checks to see if all dependencies of a given class
     * are defined. If so, returns true to indicate that the class can be
     * processed, otherwise false is returned.
     *
     * @protected
     * @ignore
     */
    cycligent.classMissing = function (args) {

        var missing = "";

        // Check to see if all elements of the name are defined.
        var splits = args.name.split(".");
        var dependantVar = window;
        var dependantVarName = "window";
        var index;

        if (splits.length > 1) {
            for (index = 0; index < splits.length - 1; index++) {
                dependantVarName += "." + splits[index];
                if (!dependantVar[splits[index]]) {
                    missing = dependantVarName;
                    break;
                }
                dependantVar = dependantVar[splits[index]];
            }
        }

        if (!missing && args.extends && !cycligent.classes[args.extends]) {
            missing = args.extends;
        }

        if (!missing && args.implements) {
            for (index = 0; index < args.implements.length; index++) {
                if (!cycligent.interfaces[args.implements[index]]) {
                    missing = args.implements[index];
                    break;
                }
            }
        }

        return missing;
    };

    /**
     * Processes any classes whose processing has been
     * deferred but which are now ready to be processed.
     *
     * @protected
     * @ignore
     */
    cycligent.classProcessDeferred = function() {

        var ProcessSeen = false;
        var index;
        var args;

        do {
            ProcessSeen = false;

            for (index = 0; index < cycligent.classesToProcess.length; index++) {

                args = cycligent.classesToProcess[index];

                if (args !== null && cycligent.classMissing(args) == "") {
                    ProcessSeen = true;
                    cycligent.classProcess(args);
                    cycligent.classesToProcess[index] = null;
                }

            }

            while (cycligent.classesToProcess.length > 0
                && cycligent.classesToProcess[cycligent.classesToProcess.length - 1] === null) {
                cycligent.classesToProcess.pop();
            }

            while (cycligent.classesToProcess.length > 0 && cycligent.classesToProcess[0] === null) {
                cycligent.classesToProcess.shift();
            }

        } while (ProcessSeen);

    };

    /**
     * Process a class. See {@link cycligent.class}
     *
     * @protected
     * @ignore
     */
    cycligent.classProcess = function(args) {

        var newClass;

        // Check to make sure the class starts with an uppercase letter
        var className = args.name.match(/\.\w+$/);

        if (className === null) {
            className = args.name;
        }
        else {
            className = className[0].substr(1);
        }

        if (className.substr(0, 1).search(/[A-Z]/) < 0) {
            console.error("Class '" +
                args.name +
                "of the expression '" + args.name +
                "' should begin with an uppercase letter.");

        }
        // End name check

        var Extends = cycligent.definitionGet(args.extends);

        if (Extends) {
            newClass = Extends.extend(args.name, args.definition);
        }
        else {
            newClass = Class.extend(args.name, args.definition);
        }

        if (cycligent.config.debug.on) {

            if (cycligent.config.debug.args.check) {

                if (Extends) {
                    if (!Extends.cyName || cycligent.classes[Extends.cyName] === undefined) {
                        console.error("Class '" +
                            args.name +
                            "' tries to extend a non-Class based object '" +
                            (Extends && Extends.cyName ? Extends.cyName : "UNKNOWN") +
                            "'.");
                    }
                }
            }

            if (cycligent.config.debug.interfaces.check || cycligent.config.debug.args.check) {
                if (args.implements) {
                    // Make an array if only a single item passed
                    var ImplementsString = args.implements;
                    if (!(args.implements instanceof Array)) {
                        ImplementsString = [ImplementsString];
                    }

                    // Contain an array to contain the actual interface references (versus their names as a string)
                    var Implements = [];

                    for (interfaceIndex = 0; interfaceIndex < ImplementsString.length; interfaceIndex++) {
                        Implements.push(cycligent.definitionGet(ImplementsString[interfaceIndex]));
                    }
                    newClass.prototype.cycligentInterfaces = Implements;
                } else {
                    newClass.prototype.cycligentInterfaces = [];
                }
            }

            if (args.implements && cycligent.config.debug.interfaces.check) {

                var currentInterface;
                var interfaceIndex;
                var methodIndex;
                var source = "";

                for (interfaceIndex in Implements) {
                    if (!Implements.hasOwnProperty(interfaceIndex)) continue;
                    currentInterface = Implements[interfaceIndex];

                    if (!currentInterface || !currentInterface.cyName || cycligent.interfaces[currentInterface.cyName] === undefined) {
                        console.error("Class '" +
                            args.name +
                            "' tries to implement a non-Interface based object '" +
                            (currentInterface && currentInterface.cyName ? currentInterface.cyName : "UNKNOWN") +
                            "'.");

                    }

                    for (methodIndex in currentInterface.prototype) {

                        if (!currentInterface.prototype.hasOwnProperty(methodIndex)) continue;

                        if (methodIndex in newClass.prototype) {
                            if (newClass.prototype[methodIndex] instanceof Function) {

                                // Validate arguments being passed
                                source = newClass.prototype[methodIndex].toString();

                                //ROADMAP: This check will be problematic if the same method supports separate interfaces
                                if (source.search(
                                    new RegExp(
                                            "cycligent\\.args\\s*\\(\\s*arguments\\s*\\,\\s*" +
                                            currentInterface.cyName +
                                            "\\.prototype\\." +
                                            methodIndex +
                                            "\\s*\\)\\s*\\;"
                                    )
                                ) < 0) {
                                    console.error("Class " + (args.name ? args.name : "?") + " tries to implement the interface " + currentInterface.cyName + " but the method '" + methodIndex + "' does not have the required signature (" + currentInterface.cyName + ".prototype." + methodIndex + "). Check to make sure you did not forget the .prototype. as part of the name.");
                                }
                            }
                            else {
                                console.error("Class " + (args.name ? args.name : "?") + " tries to implement the interface " + currentInterface.cyName + " but does not contain the required method: " + methodIndex + ", although it is present as a non-function.");
                            }
                        }
                        else {
                            console.error("Class " + (args.name ? args.name : "?") + " tries to implement the interface " + currentInterface.cyName + " but does not contain the required method: " + methodIndex + ".");
                        }
                    }
                }

            }
        }

        newClass.cyName = args.name;
        cycligent.definitionSet({"name": args.name, "value": newClass});

        cycligent.classes[args.name] = true;

        return newClass;
    };

    /**
     * Arguments for cycligent.interface.
     *
     * @memberof cycligent
     *
     * @property {string} name - The fully qualified dotted name fo the class.
     * @property {string} [extends] - The fully qualified dotted name of the
     * class to extend.
     * @property {object} definition - The object, usually from a code literal,
     * that defines the class.
     *
     * @see {@link cycligent.interface}
     */
    cycligent.interfaceArgs = {
        name: { type: String, required: true },				// The fully qualified name of the interface being created.
        definition: { type: Object },							// The object literal that defines the interace.
        extends: { type: String, required: false }			// The class from which this interface inherits its methods.
    };

    //noinspection ReservedWordAsName
    /**
     * @summary
     * Declares a classic interface (for use with classical inheritance classes).
     *
     * @description
     * cycligent.interface defines an interface that other classes can implement.
     * It allows the methods of the interface, and their signatures,
     * to be specified. It also allows for the method signature definition to be
     * reused by {@link cycligent.args}. It is recommended that calls to cycligent.interface
     * use mapped arguments in the following order: name, extends, definition.
     * See the example below.<br>
     * <br>
     * cycligent.interface definitions should be placed outside of functions. This allows
     * them to be processed at startup. The processing of interface definitions that
     * are dependant on other interface definitions (for example, if you extend an interface
     * to create a new one with more methods) that have not yet been processed
     * are deferred until they can be processed.  This allows race conditions
     * during the asynchronous loading of scripts at startup to be avoided, and makes the
     * order in which scripts are loaded unimportant.<br>
     * <br>
     * Depending on configuration settings (see {@link cycligent.config.debug.interfaces})
     * the implementation of interfaces by the class are validated.
     *
     * @method cycligent.interface
     *
     * @param {object} map - The object that specifies the interface, typically
     * from an object literal in code (see example, and {@link cycligent.interfaceArgs}).
     *
     * @Example
     * // The Interface:
     * cycligent.interface({
     *     name: "cycligent.TracerInt",
     *     definition:{
     *         getElement: {},										// Gets the HTML element that holds the trace information.
     *         setElement: {element: {type: "HtmlElement:div"}},	// Sets the HTML element that holds the trace information.
     *         trace: cycligent.tracerMessageArgs							// Issue a trace.
     * }
     *
     * // A class that implements that interface:
     * cycligent.Class({
     *     name: "cycligent.Tracer",
     *     implements: "cycligent.TracerInt",
     *     definition: {
     *         getElement: function() {
     *             cycligent.args(arguments, cycligent.TracerInt.prototype.getElement);
     *             // ... implementation ...
     *         },
     *
     *         setElement: function() {
     *             cycligent.args(arguments, cycligent.TracerInt.prototype.setElement);
     *             // ... implementation ...
     *         },
     *
     *         trace: function() {
     *             cycligent.args(arguments, cycligent.TracerInt.prototype.trace);
     *             // ... implementation ...
     *         }
     *     }
     * });
     */
    cycligent.interface = function(map) {
        var args = cycligent.args(arguments, cycligent.interfaceArgs);

        // Check to see if this class is ready to be processed (all of its
        // dependencies have already been processed).

        if (cycligent.interfaceMissing(args) == "") {
            cycligent.interfaceProcess(args);
            cycligent.interfaces[args.name] = true;
            cycligent.interfaceProcessDeferred();
        }
        else {
            cycligent.interfaces[args.name] = false;
            cycligent.interfacesToProcess.push(args);
        }
    };

    /**
     * Checks to see if all dependencies of a given interface
     * are defined. If so, returns true to indicate that the interface can be
     * processed, otherwise false is returned.
     *
     * @protected
     * @ignore
     */
    cycligent.interfaceMissing = function(args) {

        var missing = "";

        // Check to see if all elements of the name are defined.
        var splits = args.name.split(".");
        var dependantVar = window;
        var dependantVarName = "window";
        var index;

        if (splits.length > 1) {
            for (index = 0; index < splits.length - 1; index++) {
                dependantVarName += "." + splits[index];
                if (!dependantVar[splits[index]]) {
                    missing = dependantVarName;
                    break;
                }
                dependantVar = dependantVar[splits[index]];
            }
        }

        if (!missing && args.extends && !cycligent.interfaces[args.extends]) {
            missing = args.extends;
        }

        return missing;
    };

    /**
     * Processes any interfaces whose processing has been
     * deferred but which are now ready to be processed.
     *
     * @protected
     * @ignore
     */
    cycligent.interfaceProcessDeferred = function() {

        var interfaceProcessed = false;
        var processSeen = false;
        var index;
        var args;

        do {
            processSeen = false;

            for (index = 0; index < cycligent.interfacesToProcess.length; index++) {

                args = cycligent.interfacesToProcess[index];

                if (args !== null && cycligent.interfaceMissing(this) == "") {

                    processSeen = true;
                    interfaceProcessed = true;
                    cycligent.interfaceProcess(this);
                    cycligent.interfacesToProcess[index] = null;

                }

            }

            while (cycligent.interfacesToProcess.length > 0
                && cycligent.interfacesToProcess[cycligent.interfacesToProcess.length - 1] === null) {
                cycligent.interfacesToProcess.pop();
            }

            while (cycligent.interfacesToProcess.length > 0 && cycligent.interfacesToProcess[0] === null) {
                cycligent.interfacesToProcess.shift();
            }

        } while (processSeen);

        if (interfaceProcessed) {
            cycligent.classProcessDeferred();
        }

    };

    /**
     * Process a interface. See {@link cycligent.interface}
     *
     * @protected
     * @ignore
     */
    cycligent.interfaceProcess = function(args) {

        var newInterface;

        if (args.extends) {
            cycligent.definitionGet(args.extends).extend(args.definition);
        }
        else {
            newInterface = Interface.extend(args.definition);
        }

        newInterface.cyName = args.name;
        cycligent.definitionSet(args.name, newInterface);

    };

    /////////////////////////////
    //  D E F I N I T I O N S  //
    /////////////////////////////

    cycligent.definitionsToProcess = [];
    cycligent.priorityDefinitions = [];

    /**
     * @summary
     * Allows the creation of identifiers in a way that takes into account dependencies
     * and optionally allows for a function to be run when the identifier is created or
     * during a prioritized startup.
     *
     * @description
     * cycligent.define allows files to be loaded in any order
     * and thus enables asynchronous loading of JavaScript files.  The actual definition
     * (creation) of the identifier does not happen until all of it dependencies are
     * defined.<br>
     * <br>
     * If a definition function is defined and no priority is defined the definition
     * function is called immediately upon the creation of the identifier (the
     * identifier is defined when the function is called). If a definition function and
     * priority are specified then the call of the definition function is delayed until
     * all startup process have completed and then the definition function is called, in
     * the order indicated by priority, just before main() is called.<br>
     * <br>
     * All priority 1 functions are called first, then all priority 2 functions, and so on
     * and so forth. Please note that the order of calls within a priority are random.  So,
     * for instance, if you set three functions as priority 1 you are assured that these
     * function will be called before any other definition functions, but you don't know
     * which of these three functions will be called first, second or third.<br>
     * <br>
     * If after all scripts have been loaded the dependencies for a given define have not
     * been created, then Cycligent creates those dependencies as blank objects.  So, for
     * instance, if there was a define of 'demo.something.here' and after all
     * scripts had loaded only 'demo' was defined then Cycligent would define 'something'
     * as a blank object and then define 'here' as well.<br>
     *
     * @method cycligent.define
     *
     * @param {string} name - The fully qualified name/namespace to define
     * @param {*} [definition] - Value/object/definition to be assigned to the name
     * @param {number} [priority] - The priority order, if any. If zero or undefined
     * the definition to be executed as soon as all dependencies are available. If a
     * non-zero priority is defined then the definition is not executed until all
     * scripts have been loaded and all definitions with a lower priority have been
     * executed.
     */
    cycligent.define = function (name, definition, priority) {
        var args = cycligent.args(arguments, {
            name: { type: String },					        // The fully qualified namespace to define
            definition: { type: "Any", required: false },	// The optional init function used to initialize the definitions of the namespace
            priority: { type: Number, required: false }     // The optional priority of the definition.  The priority if undefined or zero causes
        });

        if (cycligent.definitionMissing(args) == "") {
            cycligent.definitionProcess(args);
            cycligent.definitionProcessDeferred();
        }
        else {
            cycligent.definitionsToProcess.push(args);
        }
    };

    /**
     * Executes definitions
     *
     * @protected
     * @ignore
     */
    cycligent.define.execute = function () {

        // First sort for priorities
        cycligent.priorityDefinitions.sort
        (function (a, b) {
                return a.priority - b.priority;
            }
        );

        for (var definitionIndex in cycligent.priorityDefinitions) {

            if (!cycligent.priorityDefinitions.hasOwnProperty(definitionIndex)) continue;

            if (cycligent.priorityDefinitions[definitionIndex].definition instanceof Function) {
                var returnValue = cycligent.priorityDefinitions[definitionIndex].definition();
                if (returnValue) {
                    cycligent.definitionSet({
                        "name": cycligent.priorityDefinitions[definitionIndex].name,
                        "value": returnValue
                    });
                }
            } else {
                cycligent.definitionSet({
                    "name": cycligent.priorityDefinitions[definitionIndex].name,
                    "value": cycligent.priorityDefinitions[definitionIndex].definition
                });
            }
            cycligent.classProcessDeferred();
            cycligent.interfaceProcessDeferred();
        }
    };

    /**
     * Checks to see if all dependencies of a given class
     * are defined. If so, returns true to indicate that the class can be
     * processed, otherwise false is returned.
     *
     * @protected
     * @ignore
     */
    cycligent.definitionMissing = function (args) {

        var missing = "";

        // Check to see if all elements of the name are defined.
        var splits = args.name.split(".");
        var dependantVar = window;
        var dependantVarName = "window";
        var index;

        if (splits.length > 1) {
            for (index = 0; index < splits.length - 1; index++) {
                dependantVarName += "." + splits[index];
                if (!dependantVar[splits[index]]) {
                    missing = dependantVarName;
                    break;
                }
                dependantVar = dependantVar[splits[index]];
            }
        }

        return missing;
    };

    /**
     * Processes any classes whose processing has been
     * deferred but which are now ready to be processed.
     *
     * @protected
     * @ignore
     */
    cycligent.definitionProcessDeferred = function () {

        var ProcessSeen = false;
        var index;
        var args;

        do {
            ProcessSeen = false;

            for (index = 0; index < cycligent.definitionsToProcess.length; index++) {

                args = cycligent.definitionsToProcess[index];

                if (args !== null && cycligent.definitionMissing(args) == "") {
                    ProcessSeen = true;
                    cycligent.definitionProcess(args);
                    cycligent.definitionsToProcess.splice(index, 1);
                    index--;
                }
            }

        } while (ProcessSeen);
    };

    /**
     * First step in define process. See {@link cycligent.define}
     *
     * @protected
     * @ignore
     */
    cycligent.definitionProcess = function (args) {

        // Create the namespace
        if (!cycligent.definitionGet(args.name)) {
            cycligent.definitionSet({
                "name": args.name,
                "value": {}
            });
        }

        cycligent.definitionProcess2(args);
    };

    /**
     * Second step in define process. See {@link cycligent.define}
     *
     * @protected
     * @ignore
     */
    cycligent.definitionProcess2 = function (args) {

        if (args.definition) {
            if (args.priority) {
                cycligent.priorityDefinitions.push(args);
            } else {
                if (args.definition instanceof Function) {
                    var returnValue = args.definition();
                    if (returnValue) {
                        cycligent.definitionSet({
                            "name": args.name,
                            "value": returnValue
                        });
                    }
                } else {
                    cycligent.definitionSet({
                        "name": args.name,
                        "value": args.definition
                    });
                }
            }
        }
    };

    //noinspection ReservedWordAsName
    /**
     * @summary
     * cycligent.private is used during debugging to ensure that private methods are only
     * called by methods of the object in which it is defined.
     *
     * @description
     * To use cycligent.private simply place "cycligent.private(this);" at the top of the
     * function. The cycligent framework will then throw an error if the call
     * to the function was made from outside the object.
     *
     * @method cycligent.private
     *
     * @param {object} alwaysThis - the only parameter to cycligent.private is always the "this" keyword.
     *
     * @Example
     * cycligent.class({
     *     name: "Person",
     *     definition:{
     *         init: function(){
     *             var a = cycligent.args(arguments, PersonArgs );
     *             	
     *             var name = a.name;
     *             
     *             this.getProtectedName = function Person_init_getProtectedName(){
     *                 cycligent.private(this);
     *                 return name;
     *             };
     *         },
     *
     *         nameGet: function(){
     *             return this.getProtectedName();
     *         }
     *     }
     * });
     */
    cycligent.private = function(alwaysThis) {

        if (!cycligent.config.debug.private.check) {
            return;
        }

        var me = alwaysThis;

        if (!me) {
            me = this;
        }

        var caller = arguments.callee.caller.caller;
        var found = false;
        var index;

        for (index in me) {
            if (!me.hasOwnProperty(index)) continue;
            if (caller == me[index]) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.error("Private method accessed by a method outside of the defining class.");
            if(console.trace) {
                console.trace();
            }
        }

    };


    //TODO: 5. Have Cycligent Builder remove cycligent.doc blocks
    cycligent.doc = function(){
        /**
         * Represents a JavaScript script that loads asynchronously.
         *
         * @class cycligent.Script
         *
         * @property {string} scriptId - Dotted name or URL of script to load. See {@link cycligent.url}.
         * @property {function|undefined} callback - The function to callback when the script loads successfully.
         * @property {string} url - The computed location (URL) of the script on the server (see {@link cycligent.url}).
         * @property {int} interval - The ID for the interval that checks if the script load timed out.
         * @property {boolean} loaded - True when the script has successfully loaded
         * @property {boolean} debugging - True when script loading is being debugged, which causes extra messages
         * to be logged.
         *
         * @param {string} scriptId - Dotted name or URL of script to load. See {@link cycligent.url}.
         * @param {function} [callback=cycligent.imports.scriptLoaded] - The function to callback when the script loads
         * successfully.
         */
        cycligent.Script = function (scriptId, callback) {};
    };
    cycligent.class({
        name: "cycligent.Script",
        definition: {

            init: function () {
                var a = cycligent.args(arguments, {
                    scriptId: { type: String, required: true },
                    callback: { type: Function, required: false, defaultValue: cycligent.imports.scriptLoaded }
                });

                this.scriptId = a.scriptId;
                this.callback = a.callback;

                this.url = cycligent.url(this.scriptId);

                if (this.debugging) {
                    console.info("Importing script: " + this.scriptId + " (" + this.url + ")");
                }

                var me = this;

                var script = document.createElement("script");
                script.id = this.scriptId;
                script.type = "text/javascript";
                script.src = this.url;

                script.addEventListener("load", function() { me.scriptLoaded(); }, false);

                this.interval = setInterval(function() { me.timeout(); }, cycligent.config.loader.timeout);

                document.getElementsByTagName("head")[0].appendChild(script);
            },

            scriptId: null,
            url: null,
            interval: null,
            loaded: false,
            debugging: cycligent.config.debug.scripts,

            /**
             * Called by the system when a script has completed loading.
             * @inner
             * @private
             */
            scriptLoaded: function () {

                var me = this;

                clearInterval(me.interval);

                me.loaded = true;

                if (me.debugging) {
                    console.info("Import Complete (Script Loaded): " + me.scriptId);
                }

                if (me.callback) {
                    me.callback();
                }
            },

            /**
             * Called by the system when a script fails to load
             * within a specified amount of time.
             * @inner
             * @private
             */
            timeout: function () {
                clearInterval(this.interval);
                console.error("Script Import Failed: " + this.scriptId);
            }

        }
    });

    cycligent.doc = function(){
        /**
         * Manager for dynamically importing JavaScript files asynchronously.
         * See {@link cycligent.Imports.Import}.
         *
         * @class
         * @protected
         * @ignore
         */
        cycligent.Imports = function () {};
    };
    cycligent.class({
        name: "cycligent.Imports",
        definition: {

            init: function () {
                cycligent.args(arguments, {});
            },

            scriptsPending: 1, // INTERNAL USE ONLY. The number of JavaScript files currently being loaded. Set to 1 instead of zero so we're sure we wait for the startupScript to be loaded.
            scripts: [],
            scriptsCount: 0,

            /**
             * See {@link cycligent.import}
             *
             * @private
             */
            Import: function () {
                var args = cycligent.args(arguments, {
                    scriptId: { type: String, required: true } // Id or URL of the script to load.
                });

                if (cycligent.test && !cycligent.test.doImports) {
                    return;
                }

                if (cycligent.imports.scripts[args.scriptId]) {
                    if (cycligent.config.debug.scripts) {
                        console.info("Redundant import of '" + args.scriptId + "' avoided.");
                    }
                }
                else {
                    cycligent.imports.scriptsPending++;
                    cycligent.imports.scriptsCount++;
                    cycligent.imports.scripts[args.scriptId] = new cycligent.Script(args.scriptId);
                }
            },

            /**
             * See {@link cycligent.styleRequired}
             *
             * @private
             */
            StyleRequired: function (dottedNameOrUrl) {
                cycligent.args(arguments, {
                    styleId: { type: String, required: true } // Id or URL of the script to load.
                });

                function isLoaded() {
                    var a = cycligent.args(arguments, {
                        url: { type: String, required: true } // Id or URL of the script to load.
                    });

                    for (var index = 0; index < document.styleSheets.length; index++) {
                        if (document.styleSheets[index].href == a.url) {
                            return true;
                        }
                        if (document.styleSheets[index].href == window.location.protocol + "//" + window.location.host +  a.url) {
                            return true;
                        }
                    }

                    return false;
                }


                var url = cycligent.url(dottedNameOrUrl, "css");
                if (!isLoaded(url)) {
                    console.error("Style '" + url + "' was not loaded as required.");
                }
            },

            /**
             * Called by the system when a script being
             * loaded asynchronously has completed loading.
             *
             * @private
             */
            scriptLoaded: function () {

                cycligent.classProcessDeferred();
                cycligent.interfaceProcessDeferred();

                cycligent.imports.scriptsPending--;
                if (cycligent.imports.scriptsPending === 0) {

                    cycligent.appLoad.allScriptsLoaded();
                }
            }

        }
    });

    cycligent.doc = function(){

        //noinspection ReservedWordAsName
        /**
         * @summary
         * Dynamically imports a JavaScript file asynchronously via either a
         * dotted name (ID) or a URL.
         *
         * @description
         * The Cycligent Framework provides the
         * following support for the loading of JavaScript files:<br>
         * <br>
         * <li>Dynamic loading
         * <li>Asynchronous loading
         * <li>Common configuration
         * <li>Logging
         * <li>Versioning
         * <li>Advanced caching
         * <li>Namespace root location specification
         * <li>Loading of compressed or uncompressed scripts
         * <br>
         * Scripts that depend on other scripts can import them using cycligent.import. These
         * scripts are then loaded asynchronously and in parallel to the degree
         * allowed by the browser.<br>
         * <br>
         * HTML files only need include the cycligent script tag. For more information
         * on the Cycligent bootstraping process see {@link cycligent._loader}.<br>
         * <br>
         * Once Cycligent has successfully booted it loads the main.js that is in the
         * same directory as the HTML file, or the startup script specified.
         * It will also load any scripts imported by this script and any script
         * they import and so on. Once the system has successfully loaded all scripts, any
         * initialization code for the loaded file is run (see {@link cycligent.define}).
         * Once all initialization code has completed the system calls main(). <br>
         * <br>
         * Cycligent provides a logging mechanism that provides information
         * on the loading of scripts and thier success or failure.<br>
         * <br>
         * The versioning feature of Cycligent not only supports the loading of
         * the correct version of a code set, but also supports an
         * advanced caching mechanism.  For more information on versioning please
         * see {@link https://www.cycligent.com}.<br>
         * <br>
         * Advanced caching allows the expires headers of all javascript files to be
         * set such that they "never" expire.  This not only eliminates the
         * re-downloading of scripts but also the costly tcp/ip connection and
         * communication around determining if an item in the cache is older than the
         * current item on the server. <br>
         * <br>
         * Normally this technique would make it impossible to update the scripts
         * once released.  By using cycligent.import and by incrementing the version on a
         * release the code sets will automatically refresh on the client as needed.<br>
         * <br>
         * The location from which a given code set is loaded can also be configured
         * via the {@link cycligent.config.roots} section of the common configuration
         * {@link cycligent.config}).  For more information on how these root locations
         * are specified see {@link cycligent.root}.<br>
         * <br>
         * Finally a configuration switch {@link cycligent.config.minimizeSource}
         * can be thrown to either load the uncompressed or the compressed versions
         * of the scripts. This is typically done by a production build process.<br>
         * <br>
         * Scripts to be imported can be specified either in the form of a dottend name or
         * a URL. For more information on dotted name and URL usage see
         * {@link cycligent.url}
         *
         * @method cycligent.import
         *
         * @param {string} dottedNameOrUrl - The script to import, specified
         * as either a dotted name or a URL. For more information on name
         * and URL handling see {@link cycligent.url}
         * @param {string} [extension='js'] - The extenstion to be used with
         * dotted names. Defaults to 'js'.
         *
         * @Example
         *    cycligent.import( "app.sub.myScript" );
         *    cycligent.import( "/myApp/mySubDirectory/myScript.js" );
         */
        cycligent.import = function(dottedNameOrUrl,extension){};
    };

    cycligent.doc = function(){
        /**
         * @summary
         * Specifies that a particular stylesheet is required.
         *
         * @description
         * Missing styles can make it appear as though code is not functioning.
         * When code is dependent on styles in a particular stylesheet you can
         * use cycligent.styleRequired to indicate the required dependency. If
         * the stylesheet does not load successfully during application loading
         * Cycligent throws an error.
         *
         * @method cycligent.styleRequired
         *
         * @param {string} dottedNameOrUrl - The script to import, specified
         * as either a dotted name or a URL. For more information on name
         * and URL handling see {@link cycligent.url}
         *
         * @example
         *    cycligent.styleRequired( "app.common.css.myStyles" );
         *    cycligent.styleRequired( "/app/common/css/myStyles.css" );
         */
        cycligent.styleRequired = function(dottedNameOrUrl){};
    };

    /**
     * Loads (starts) the application by importing the startup
     * script specified in {@link cycligent.config.loader.libs}.
     * This function is called from Config.js when both the Kernel script and the
     * jQuery script have completed loading.
     *
     * @protected
     * @ignore
     */
    cycligent.appLoad = (function() {

        var scriptsReady = false;
        var domReady = false;
        var pageReady = false;
        var appLoadFinished = false;
        var notifyFunctions = [];

        /**
         * Checks to see if all startup tasks have
         * completed, and if they have starts the application by
         * calling main().
         * Each time readyCheck is called it provides trace information
         * about the various statuses associated with startup.
         *
         * @private
         */
        function readyCheck() {

            if(!appLoadFinished && cycligent.config.debug.startup) {
                console.info("Scripts " + (scriptsReady ? "" : "not ") +  "ready, " +
                        "DOM " + (domReady ? "" : "not ") + "ready, " +
                        "page " + (pageReady ? "" : "not ") + "ready."
                );
            }

            if (scriptsReady
                && domReady
                && pageReady
                ) {
                if (window.cycligentConfigOverride) {
                    console.log("Configuration override was present in markup.");
                }

                if(!appLoadFinished && cycligent.config.debug.startup) {
                    console.info("Cycligent starting application.");
                }

                _executeMain();
            }
        }

        /**
         * Create the necessary blank definitions
         *
         * @private
         */
        function _createAssumedDefinitions() {

            var defIndex;
            var definition;

            for(defIndex = 0; defIndex < cycligent.definitionsToProcess.length; defIndex++){

                definition = cycligent.definitionsToProcess[defIndex];

                var splits = definition.name.split(".");
                var dependantVar = window;
                var index;

                for (index = 0; index < splits.length; index++) {
                    if (!dependantVar[splits[index]]) {
                        dependantVar[splits[index]] = {};
                    }
                    dependantVar = dependantVar[splits[index]];
                }

                cycligent.definitionProcess2(definition);
            }

            cycligent.classProcessDeferred();
            cycligent.interfaceProcessDeferred();

            _allScriptsLoaded2();
        }

        /**
         * Second step of all script loading process
         *
         * @private
         */
        function _allScriptsLoaded2() {
            cycligent.define.execute();

            readyCheck();
        }

        /**
         * Execute main process with error trapping.
         *
         * @private
         */
        function _executeMain() {

            var index;
            var o;

            for(index = 0; index < cycligent.interfacesToProcess.length; index++){
                o = cycligent.interfacesToProcess[index];
                console.error("The interface '" + o.name + "' failed to process at startup. Missing dependency '" + cycligent.interfaceMissing(o) + "'.");
            }

            for(index = 0; index < cycligent.classesToProcess.length; index++){
                o = cycligent.classesToProcess[index];
                console.error("The class '" + o.name + "' failed to process at startup. Missing dependency '" + cycligent.classMissing(o) + "'.");
            }

            cycligent.timing.event("Initialize application (time first call to timing.event)", 0);

            function mainGo(){
                if (cycligent.test) {
                    cycligent.test.scaffoldingReady = true;
                } else if (appLoadFinished == false) {
                    //noinspection JSUnresolvedFunction
                    main();
                }

                appLoadFinished = true;

                for (var i = 0; i < notifyFunctions.length; i++) {
                    notifyFunctions[i]();
                }
            }

            if(cycligent.config.debug.doNotCatchAllExceptionsOnLocalHost &&
                (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1")){
                mainGo();
            } else {
                try {
                    mainGo();
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        }

        /**
         * @summary
         * Handles the DOM loaded event.
         *
         * @description
         * The DOM loaded event does not successfully fire in IE when
         * the window is loaded into a frame.  Use of the onload attribute
         * of the <body> tag is recommended to overcome this IE issue.
         *
         * @private
         *
         * @example
         * 	<body id="appBody" onload="cycligent.forcepageReady = true;">
         */
        function domLoaded() {
            domReady = true;
            cycligent.timing.event("DOM ready", 1);
            readyCheck();
        }

        /**
         * @summary
         * Handles the body loaded event.
         *
         * @description
         * The body loaded event does not successfully fire in IE when
         * the window is loaded into a frame.  Use of the onload attribute
         * of the <body> tag is recommended to overcome this IE issue.
         *
         * @private
         *
         * @example
         * 	<body id="appBody" onload="cycligent.forcepageReady = true;">
         */
        function pageLoaded() {
            pageReady = true;
            cycligent.timing.event("Page ready", 1);
            readyCheck();
        }

        /**
         * Load the application
         *
         * @private
         */
        function load() {

            cycligent.timing.event("Load script dependencies", 0);

            cycligent.imports = new cycligent.Imports();
            cycligent.import = cycligent.imports.Import;
            cycligent.styleRequired = cycligent.imports.StyleRequired;

            if (!cycligent.test && cycligent.config.loader.waitFor.dom) {
                /*
                 * contentloaded.js
                 *
                 * Author: Diego Perini (diego.perini at gmail.com)
                 * Summary: cross-browser wrapper for DOMContentLoaded
                 * Updated: 20101020
                 * License: MIT
                 * Version: 1.2
                 *
                 * URL:
                 * http://javascript.nwbox.com/ContentLoaded/
                 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
                 *
                 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                 * THE SOFTWARE.
                 */
                (function contentLoaded(win, fn) {

                    var done = false, top = true,

                        doc = win.document, root = doc.documentElement,

                        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
                        rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
                        pre = doc.addEventListener ? '' : 'on',

                        init = function(e) {
                            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                            (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                            if (!done && (done = true)) fn.call(win, e.type || e);
                        },

                        poll = function() {
                            try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
                            init('poll');
                        };

                    if (doc.readyState == 'complete') fn.call(win, 'lazy');
                    else {
                        if (doc.createEventObject && root.doScroll) {
                            try { top = !win.frameElement; } catch(e) { }
                            if (top) poll();
                        }
                        doc[add](pre + 'DOMContentLoaded', init, false);
                        doc[add](pre + 'readystatechange', init, false);
                        win[add](pre + 'load', init, false);
                    }

                })(window, domLoaded);
            }
            else {
                domReady = true;
            }

            if (!cycligent.test && cycligent.config.loader.waitFor.page) {
                window.onload = pageLoaded;
            }
            else {
                pageReady = true;
            }

            if (!cycligent.test || cycligent.test.doImports) {
                cycligent.timing.event("Load startup script and its dependencies", 1);
                cycligent.imports.scriptsPending--; // Decrement because we initially set this 1 higher than it needed to be so we would be sure to wait to load main.js.
                cycligent.import({ scriptId: cycligent.config.startupScript });
            } else {
                scriptsReady = true;
                if(cycligent.config.debug.startup) {
                    console.info("Running module initialization code in test mode.");
                }

                if (cycligent.definitionsToProcess.length > 0) {
                    _createAssumedDefinitions();
                } else {
                    _allScriptsLoaded2();
                }
            }
        }

        return {

            /**
             * INTERNAL USE ONLY. Continues loading of the application after
             * the boot of cycligent.
             *
             * @protected
             * @inner
             * @ignore
             */
            load: load,

            /**
             * INTERNAL USE ONLY. Handles the all import scripts loaded event.
             *
             * @protected
             * @inner
             * @ignore
             */
            allScriptsLoaded: function () {
                if (cycligent.config.debug.scripts) {
                    console.info(cycligent.imports.scriptsCount + " script(s) loaded.");
                }
                scriptsReady = true;

                if(cycligent.config.debug.startup) {
                    console.info("Running module initialization code.");
                }

                if (cycligent.definitionsToProcess.length > 0) {
                    cycligent.timing.event("Create assumed definitions", 1);
                    _createAssumedDefinitions();
                } else {
                    _allScriptsLoaded2();
                }

            },

            /**
             * Register a notification function
             *
             * @param func {function} The function to be called whenever a script
             * loading pass gets completed.
             *
             * @static
             */
            notify: function (func) {
                // Make sure we don't add a function more than once.
                for(var index = 0; index < notifyFunctions.length; index++){
                    if(func === notifyFunctions[index]){
                        return;
                    }
                }
                notifyFunctions.push(func);
            },

            /**
             * Unregister a notification function
             *
             * @param func {function} The notify function to unregister.
             *
             * @static
             */
            notifyClear: function (func) {
                for(var index = 0; index < notifyFunctions.length; index++){
                    if(func === notifyFunctions[index]){
                        notifyFunctions.splice(index,1);
                        index--;
                    }
                }
            },

            finished: function () {
                return appLoadFinished;
            }
        };
    })();

    cycligent.appLoad.load();
};

/*******************
 *   L O A D E R   *
 *******************/

cycligent.doc = function(){
    /**
     * @summary
     * Loads Cycligent and its dependencies.
     *
     * @description
     * Implemented as a function that executes immediately. _loader should not be
     * called but is documented here to provide information about Cycligent's
     * bootstrapping process and it associated configurations.<br>
     * <br>
     * At startup the first file loaded by cycligent is config.js. Config.js
     * contains the global configuration for cycligent.<br>
     *<br>
     * By default config.js is loaded from the root directory for servers
     * that do not have a concept of application root or from the application
     * root for servers that do have the concept of an application root.
     * <br>
     * <br>
     * If the default method of guessing where config.js is doesn't work in
     * your environment, the config.js location can be specified in the
     * following ways:
     *
     * <ul>
     *     <li>config-location (or x-config-location or data-config-location) attribute
     *         on the script tag. (recommended)
     *     <li>config-depth (or x-config-depth or data-config-depth) attribute on the
     *         script tag. This attribute is the depth within the path hierarchy from
     *         the current HTML file (window.location), where a depth of zero is the
     *         root directory of the server.
     *     <li>Specifying a URL of the config location in
     *     window.cycligentConfigLocationOverride (often useful in testing.)
     * </ul>
     * By default the application root is determined in the same manner as for the
     * config.js file. If the default method of figuring out the app root doesn't
     * work in your environment, the application root can be specified via the
     * config-app-root (or x-config-app-roox or data-config-app-root) attribute.
     * No trailing slash should be used when specifying the path.
     *
     * @method cycligent._loader
     *
     * @example
     * Example 1 (config-depth="0")
     * Requested URL: http://localhost:3680/app/myApp/myPage/index.html
     * <script id="cycligent-script" src="/app/lib/cycligent/cycligent.js" data-config-depth="0"></script>
     * config file will be read from /config.js.
     *
     * Example 2 (config-depth="2")
     * Requested URL: http://localhost:3680/app/myApp/myPage/index.html
     * <script id="cycligent-script" src="/app/lib/cycligent/cycligent.js" data-config-depth="2"></script>
     * config file will be read from /app/myApp/config.js
     *
     * Example 3 (config-location="/app/config.js")
     * Requested URL: http://localhost:3680/app/myApp/myPage/index.html
     * <script id="cycligent-script" src="/app/lib/cycligent/cycligent.js" data-config-location="/app/config.js"></script>
     * config file will be read from /app/config.js
     *
     * Example 4 (window.cycligentConfigLocationOverride="/app/config.js")
     * Requested URL: http://localhost:3680/app/myApp/myPage/index.html
     * <script type="text/javascript">window.cycligentConfigLocationOverride = "/app/config.js";</script>
     * <script id="cycligent-script" src="/app/lib/cycligent/cycligent.js"></script>
     * config file will be read from /app/config.js
     */

    cycligent._loader = function(){};
};

(function() {
    try {
        (function () {

            var configLocationOverride = window.cycligentConfigOverride;

            if (!cycligent.root.deploy) {            // This will be set when unit testing is active

                var clientIndex = window.location.href.indexOf("/client/");
                var cycligentScript = document.getElementById("cycligent-script");
                if (cycligentScript && configLocationOverride === undefined)
                    configLocationOverride = attributeGet(cycligentScript, "config-location");

                if(clientIndex < 0 && configLocationOverride){
                    clientIndex = configLocationOverride.indexOf("/client/");
                }

                if (clientIndex >= 0) {
                    // Assume Cycligent server
                    cycligent.root.client = window.location.href.substr(0, clientIndex + 7);
                    if (cycligentScript) {
                        cycligent.root.app = attributeGet(cycligentScript, "config-app-root");
                    }
                    if(!cycligent.root.app) {
                        cycligent.root.app = window.location.href.substr(0, clientIndex);
                    }
                    cycligent.root.deploy = cycligent.root.app.substr(0, cycligent.root.app.lastIndexOf("/"));
                } else {

                    var splits = window.location.pathname.split('/');
                    cycligent.root.deploy = window.location.protocol + "//" + window.location.host;

                    var depth;
                    if (cycligentScript)
                        depth = parseInt(attributeGet(cycligentScript, "config-depth"));

                    if (depth === undefined || depth === null || isNaN(depth)) {
                        if (splits[1] != "" && splits[1].indexOf('.htm') < 0) {
                            depth = 1;   // Assume Java server (context roots, not sure how we could approach it any other way)
                        } else {
                            depth = 0;   // First split is html file, so we must be running off the root!
                        }
                    }

                    for (var index = 0; index < depth; index++) {
                        cycligent.root.deploy += "/" + splits[index + 1];
                    }

                    cycligent.root.client = cycligent.root.deploy;
                    cycligent.root.app = cycligent.root.deploy;
                }

                var split = cycligent.root.app.split('/');
                cycligent.root.name = split[split.length - 1];
            }

            var configLocation = cycligent.root.client + "/" + "config.js";

            if (configLocationOverride) {
                configLocation = configLocationOverride;
            }

            if (cycligent.test) {
                cycligent.boot();
            } else {
                new cycligent.EarlyLoader("Config", configLocation, function () {
                    if (cycligent.config) {

                        // Check for configuration overrides in the markup file (typically markup.htm)

                        if (!cycligent.loaderValid()) {
                            return;
                        }

                        if (!cycligent.debugValid()) {
                            return;
                        }

                        loadLibs();

                    }
                    else {
                        console.error("The configuration loaded but failed to start. The system is unable to start the application.");
                    }
                });
            }


            /**
             * Load library dependencies that must be loaded in order.
             *
             * @method
             * @memberof cycligent._loader
             * @inner
             * @private
             */
            function loadLibs() {

                cycligent.timing.event("Load frameworks / synchronous scripts", 0);

                var libIndex = 0;
                loadLibLoop();

                /**
                 * Asynchronous loop control function for loading initial
                 * libraries
                 *
                 * @method
                 * @memberof cycligent._loader.loadLibs
                 * @inner
                 * @private
                 */
                function loadLibLoop() {
                    if (!cycligent.test || cycligent.test.doImports) {
                        if (libIndex < cycligent.config.loader.libs.length) {
                            loadLib(cycligent.config.loader.libs[libIndex++]);
                        } else {
                            loadLibEnd();
                        }
                    } else {
                        loadLibEnd();
                    }
                }

                /**
                 * Loads specified library and proceeds with loop only after
                 * it has loaded successfully.
                 *
                 * @method
                 * @memberof cycligent._loader.loadLibs
                 * @inner
                 * @private
                 * @param {string} lib - The URL or dotted name where the library can be found.
                 */
                function loadLib(lib) {

                    cycligent.timing.event(lib, 1);

                    if (cycligent.config.debug.scripts) {
                        console.info("Loading boot library '" + lib + "'");
                    }
                    new cycligent.EarlyLoader("lib" + libIndex + "-script", cycligent.url(lib), function () {
                        if (cycligent.config.debug.scripts) {
                            console.info("Loaded boot library '" + lib + "'");
                        }
                        loadLibLoop();
                    });
                }

                /**
                 * Wrap out the library loading loop/process
                 *
                 * @method
                 * @memberof cycligent._loader.loadLibs
                 * @inner
                 * @private
                 */
                function loadLibEnd() {
                    cycligent.boot();
                }

            }


            /**
             * Get an attribute from an element with or without common
             * prefixes (x- and data-).
             *
             * @method
             * @memberof cycligent._loader
             * @inner
             * @private
             *
             * @param {HTMLElement} element - The element from which to get
             * the attribute.
             * @param {string} name - The name of the attribute to get without
             * the 'x-' or 'data-' prefix.
             *
             * @returns {string} - The value of the attribute or undefined if
             * the attribute does not exist on the element.
             */
            function attributeGet(element, name) {

                var value = element.getAttribute("data-" + name);

                if (value) {
                    return value;
                }

                value = element.getAttribute("x-" + name);

                if (value) {
                    return value;
                }

                value = element.getAttribute(name);

                return value;

            }


        })();
    }
    catch (ex) {
        console.error("Uncaught exception in loader. Exception message: " + ex.message);
        if (ex.stack)
            console.error(ex.stack);
    }
})();