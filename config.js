/**
 * Configures the loading and debugging of Cycligent.<br/>
 * <br/>
 * You define this yourself in a file named config.js since it's for
 * application-specific configuration, see {@link cycligent._loader} for an
 * explanation of where the config.js file is loaded from.
 *
 * @member {object}
 *
 * @property {string} appName - The name of the application. Often displayed
 * by the application.
 * @property {string} appDescription - A description of the application. Often
 * displayed by the application in an about box.  Often contains copyright
 * and/or licensing information.
 * @property {string} appVersion - The version of the deployed application.
 * Usually contains the value "M.m.B" (major, minor, build) on a developer's
 * machine. Changed by the build and deploy process so that the deployed
 * application can accurately display the currently running version.
 * @property {boolean} production - When true this indicates that this is being
 * served by a Cycligent server employing advanced caching mechanisms (the
 * versioning of all static resources), otherwise we expect all resources to be
 * served as is. Is is usually set by the build process.
 * @property {boolean} minimizeSource - Typically set by the build process.
 * When true .min files are served.
 * @property {string} startupScript - The name and location of the startup
 * script expressed as either a dotted name or URL. This is the main script
 * that will import all other scripts and start the application. Once the
 * Cycligent bootstrap process has completed, including the loading of all
 * imported scripts, Cycligent calls the main() function. Typically the value
 * of this property is "main" meaning that the file main.js is loaded from
 * the same directory as the HTML file.
 *
 * @property {object} loader
 * @property {string[]} loader.libs - A list of URLs that represent the base library
 * scripts that must be loaded synchronously.
 * @property {object} loader.waitFor - Signals to wait for before starting
 * the application (calling main()).
 * @property {boolean} loader.waitFor.dom - Wait for the DOM to be ready. <b>If the
 * cycligent script tag is placed at the end of the body element, waiting for
 * DOM ready is unnecessary.</b>
 * @property {boolean} loader.waitFor.page - Wait for the page to be ready
 * (window.onload).
 * @property {int} loader.timeout - The maximum time to wait for the application to
 * become ready.
 * @property {object} loader.roots - Map of root namespaces and their associated
 * URLs. Used to shorten dotted names. See example.
 *
 * @property {object} debug - Configures Cycligent Debugging. Properties are in a
 * disabled state by default so that the framework will run as efficiently as
 * possible by performing the fewest checks. You'll want to enable most of these
 * during development, and disable most or all of them in production.
 * @property {boolean} debug.on - When true Cycligent performs debugging functions,
 * when false all debugging functions are disabled.
 * @property {boolean} debug.startup - When true Cycligent sends informational
 * messages to the console during the startup process.
 * @property {boolean} debug.scripts - When true Cycligent sends informational
 * messages to the console on the loading of each script (load started, load
 * completed, redundant load avoided, etc).
 * @property {object} debug.private - Control for private function debugging.
 * @property {boolean} debug.private.check - When true private functions
 * containing cycligent.private are validated.
 * @property {object} debug.args - Control for function argument checking.
 * @property {boolean} debug.args.check - When true arguments to functions
 * containing cycligent.args are validated.
 * @property {object} debug.args.arrays - Control for how array arguments are
 * validated.
 * @property {boolean} debug.args.arrays.check - When true array arguments are
 * validated.
 * @property {boolean} debug.args.arrays.allElements - When true all array
 * elements are validated.  This can be a very time consuming operation and is
 * not recommended.  When false only the first element of the array is
 * validated.
 * @property {object} debug.interface - Control for interface validation.
 * @property {boolean} debug.interface.check - When true interfaces are
 * validated.
 *
 * @example
 * cycligent.config = {
 *
 *     appName: "My Awesome Application",
 *     appDescription: "The most awesome application ever",
 *     appVersion: "M.m.B",
 *
 *     production: false,
 *     minimizeSource: false,
 *
 *     startupScript: "^main",
 *
 *     loader: {
 *         libs: [
 *             '/app/lib/smart/js/libs/jquery-2.0.2.min.js',
 *             '/app/bower_components/angular/angular.min.js',
 *             '/app/bower_components/angular-route/angular-route.min.js'
 *         ],
 *
 *         waitFor:{
 *             dom: true,
 *             page: false
 *         },
 *
 *         timeout: (location.hostname == "localhost" || location.hostname == "" ? 7000 : 70000),
 *
 *         roots: {
 *             cycligent: { root: "/app/lib/cycligent" }
 *         }
 *     },
 *
 *     debug: {
 *         on: true,
 *
 *         startup: false,
 *         scripts: false,
 *
 *         private:{
 *             check: true
 *         },
 *
 *         args: {
 *             check: true,
 *             arrays:{
 *                 check: true,
 *                 allElements: false
 *             }
 *         },
 *
 *         interfaces: {
 *             check: true
 *         }
 *     }
 * };
 */
cycligent.config = {

	appName: "Carvana Annotation Tool",
	appDescription: "(C) Copyright 2014",
	appVersion: "M.m.B",

	production: false,
    minimizeSource: false,

	startupScript: "^main",

    loader: {
        libs: [
            '/app/lib/smart/js/libs/jquery-2.0.2.min.js',
            '/app/bower_components/angular/angular.min.js',
            '/app/bower_components/angular-route/angular-route.min.js'
        ],

        waitFor:{
            dom: false,
            page: false
        },

        timeout: (location.hostname == "localhost" || location.hostname == "" ? 7000 : 70000),

        roots: {
            cycligent: { root: "/app/lib/cycligent" }
        }
    },

    debug: {
        on: true,

        startup: true,
        scripts: false,

        private:{
            check: true,
            exception: true
        },

        args: {
            check: true,
            exception: true,
            arrays:{
                check: true,
                allElements: false
            }
        },

        interfaces: {
            check: true,
            exception: true
        }
    }
};
