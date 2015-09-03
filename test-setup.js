window.cycligent = {};

/**
 * Cycligent Test Structure - When cycligent.test is defined Cycligent changes
 * it behavior to facilitate testing.
 *
 * @module cycligent.test
 *
 * @property {boolean} scaffoldingReady - False until the test environment is
 * fully initialized and ready at which time it becomes true. Provided so tests
 * can watch and wait for the appropriate moment to start testing. Avoids tests
 * starting early and causing erroneous failure reports.
 * @property {boolean} clientOnly - Disable server-side functionality so tests
 * can be run in a client only environment, when unit testing, for example.
 * @property {boolean} doImports - When true the Cycligent import facilities
 * continue to load scripts. When false Cycligent import facilities do not load
 * any scripts, assuming they are loaded by the test setup.
 * @property {object} instrument - Designates authorization and which scripts
 * should be instrumented via istanbul for code coverage. This is useful when
 * Cycligent import is still employed but the code coverage is desired.
 * Cycligent Cloud will automatically instrument the code for testing and code
 * coverage. The scripts to be instrumented are provided as a map followed by
 * a boolean to indicated if they should be instrumented.  This allows certain
 * files to have their instrumentation toggled easily. See the example.
 * @property {string} markupBase - Constructed during test setup. The absolute
 * URL of the initial HTML file loaded.
 * @property {string} root - The application root directory. USED ONLY DURING
 * TEST STARTUP TO CONSTRUCT OTHER CYCLIGENT PROPERTIES.
 * @property {string} context - Testing context provides tests with a
 * context for realizing relative paths, essentially the same as what
 * window.location would have been in the actual running code. USED ONLY DURING
 * TEST STARTUP TO CONSTRUCT OTHER CYCLIGENT PROPERTIES.
 * @property {string} host - The host running the tests. USED ONLY DURING
 * TEST STARTUP TO CONSTRUCT OTHER CYCLIGENT PROPERTIES.
 * @property {string} markupFile - The name, without the extension, of the
 * initial HTML file loaded. USED ONLY DURING TEST STARTUP TO CONSTRUCT OTHER
 * CYCLIGENT PROPERTIES.
 * @property {string} markupExtension - The extension of the initial HTML file
 * loaded. USED ONLY DURING TEST STARTUP TO CONSTRUCT OTHER CYCLIGENT PROPERTIES.
 */
cycligent.test = {

    // The following properties modify behavior
    scaffoldingReady: false,
    clientOnly: true,
    doImports: false,
    instrument: {
        certificate: 'MRmS5UymV%3gynWK'
        ,'/projects/client/layout/main.js': true
        ,'/projects/client/layout/app.js': false
        ,'/projects/client/common/more.js': true
    },

    // The following properties are only used to construct other properties during test startup
    root: '',
    context: '',
    host: window.location.protocol + "//" + window.location.host,
    markupFile: 'markup',
    markupExtension: '.html'
};

cycligent.test.markupBase = cycligent.test.root + '/client/' + cycligent.test.context + cycligent.test.markupFile;

(function () {
    cycligent.root = {
        name: "",
        client: cycligent.test.host + cycligent.test.root,
        app: cycligent.test.host + cycligent.test.root,
        deploy: cycligent.test.host,
        context: ""
    };
    var split = cycligent.root.server.split('/');
    cycligent.root.name = split[split.length - 1];
})();

/**
 * Allows the location of config.js to be overridden, typically by a testing
 * environment. Usually not defined.
 *
 * @global
 * @type {string}
 */
window.cycligentConfigOverride = '/config.js';



