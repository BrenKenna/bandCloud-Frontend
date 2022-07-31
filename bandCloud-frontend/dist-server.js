/**
 * App to serve the SPA and proxy requests to backend resources
 * => Proxy do work, but cookies are forwarded.
 * => Data is recived by this server, can it under
 *      res.headers['set-cookie']
 * => Perhaps there is a better way to do this
 * 
 * 
 * 
 * 
 
POST - http://54.216.44.111:8080/account/manage/register
{
    "username": "maidenIron",
    "email": "harris@maiden.com",
    "password": "harris@maiden.com",
    "accountHolder": "GOLD"
}

POST - http://54.216.44.111:8080/account/manage/login
{
    "username": "maidenIron",
    "email": "harris@maiden.com",
    "password": "harris@maiden.com"
}

GET - http://54.216.44.111:8080/account/display/view


POST - http://54.216.44.111:8080/account/display/update?updateName=true&updateEmail=true&updateAuth=true&updateAccount=true
{
    "username": "donald-duck",
    "email": "donald-duck@donaldTheDuck.com",
    "password": "P@5St0rD",
    "accountHolder": "SILVER"
}
 */

// Import required modules
const
    https = require('http'),
    path = require('path'),
    express = require('express'),
    axios = require('axios'),
    proxyConf = require('./src/proxy-config.json'),
    fs = require('fs'),
    cookieParser = require('cookie-parser');
;
// httpProxy = require('http-proxy');
// bodyParser = require('body-parser');

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///
/// Web & Proxy Server Config
///
///////////////////////////////////////////////////
///////////////////////////////////////////////////

// Read ssl cert
const options = {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
};


// Configure the web server
// Provide the above for https server
const
    router = express(),
    server = https.createServer(router)
;

// Serve main page
const appDir = __dirname + "/dist/bandCloud-frontend/";
router.use(express.static(appDir));
router.use(express.urlencoded({extended: false}));
router.use(express.json());
router.use(cookieParser());
// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * 
 * Configure proxy server
 * 
 */

// Setup proxy
const instance = axios.create(
    {
        withCredentials: true
    }
);
const
    backendHost = 'resource.bandcloud.com',
    apiForwardingUrl = 'http://' + backendHost + ':8080'
;
// apiProxy = httpProxy.createProxyServer();


/**
 * Configure accounts-manage proxy paths
 *  => application/...form... because forwarded request was empty
 *  => 'Required request body is missing' not being handled correctly
 *      => Tried stringifying body
*/

// Registration: 
router.post("/account/manage/register", function(req, resp) {

    // Serve back json
    console.log(`\n\nA request came in for: ${req.url}`);
    console.log(req.body);
    console.log(JSON.stringify(req.body));

    // Fetch promise for the auth page
    let data = instance.post(
        `${apiForwardingUrl}/account/manage/register`,
        JSON.stringify(req.body),
        {
            headers: {
                'Content-Type': 'application/json',
                'Proxy-Connection': 'keep-alive'
            }
        }
    );
    
    // Resolve promise
    data.then( function(res) {
        
        // Check backend response
        // console.dir(res.headers['set-cookie']);
        for(let cookieData of res.headers['set-cookie']) {

            // Get cookie key & value
            let cookieKey = cookieData.split(";")[0].split("=")[0];
            let cookieVal = cookieData.split(";")[0].split("=")[1];

            // Create cookie
            resp.cookie(cookieKey, cookieVal, {
                maxAge: (3 * 24 * 60 * 60),
                httpOnly: true,
                path: "/"
            });
        }

        // Send response
        // console.dir(resp, {depth: null});
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        if( error.response.data != undefined ) {
            resp.writeHead(error.response.status, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(error.response.data));
        }
        //console.dir(error.response, {depth: null});
    });
});


// Login
router.post("/account/manage/login", function(req, resp) {

    // Serve back json
    console.log(`A request came in for: ${req.url}`);
    // console.dir(req, {depth: null});

    // Fetch promise for the auth page
    let data = instance.post(
        `${apiForwardingUrl}/account/manage/login`,
        JSON.stringify(req.body),
        {
            headers: {
                'Content-Type': 'application/json',
                'Proxy-Connection': 'keep-alive'
            }
        }
    );
    
    // Resolve promise
    data.then( function(res) {
        
        // Set response cookie
        // console.dir(res.headers['set-cookie']);
        for(let cookieData of res.headers['set-cookie']) {

            // Get cookie key & value
            let cookieKey = cookieData.split(";")[0].split("=")[0];
            let cookieVal = cookieData.split(";")[0].split("=")[1];

            // Create cookie
            resp.cookie(cookieKey, cookieVal, {
                maxAge: (3 * 24 * 60 * 60),
                httpOnly: true,
                path: "/"
            });
        }

        // Send response
        // console.dir(resp, {depth: null});
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        if( error.response.data != undefined ) {
            resp.writeHead(error.response.status, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(error.response.data));
        }
        // console.dir(error.response, {depth: null});
    });
});


// Deregister
router.post("/account/manage/deregister", function(req, resp) {

    // Serve back json
    console.log(`A request came in for: ${req.url}`);
    

    // Fetch promise for the auth page
    let data = instance.post(
        `${apiForwardingUrl}/account/manage/deregister`,
        JSON.stringify(req.body),
        {
            headers: {
                'Content-Type': 'application/json',
                'Proxy-Connection': 'keep-alive'
            }
        }
    );
    
    // Resolve promise
    data.then( function(res) {
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        if( error.response.data != undefined ) {
            resp.writeHead(error.response.status, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(error.response.data));
        }
        console.dir(error.response, {depth: null});
    });
});


/**
 * Configure User Display proxy paths
 * 
 * Server replies unauthorized based on cookie, tried:
 *  - Sending as is
 *  - Sending the req object
 *      => Worked fine, dropping caused unauthorized error
 * 
 */

// Define proxy paths
router.get("/account/display/view", function(req, resp) {

    // Serve back json
    console.log(`\n\nA request came in for: ${req.url}`);
    

    // Fetch promise for the auth page
    let data = instance.get(
        `${apiForwardingUrl}/account/display/view`,
        req
    );
    
    // Resolve promise
    data.then( function(res) {
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        if( error.response.data != undefined ) {
            resp.writeHead(error.response.status, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(error.response.data));
        }
        console.dir(error.response, {depth: null});
    });
});


/**
 * Define proxy for user account updates
 * 
 * Forwarding request = Unsupported Media Type
 *  - Both the req.headers & req.cookies => have the data
 *  - Tried adding the cookie to head via ` 'Cookie': req.headers.cookie `
 *      => Worked fine, API responds with new session
 */
router.post("/account/display/update", function(req, resp) {

    // Serve back json
    console.log(`\n\nA request came in for: ${apiForwardingUrl + req.url}`);
    console.dir(req.body, {depth: null});
    console.dir(req.headers, {depth: null});
    console.dir(req.cookies, {depth: null});
    // console.dir(req, {depth: null});

    // Fetch promise for the auth page
    let data = instance.post(
        `${apiForwardingUrl + req.url}`,
        JSON.stringify(req.body),
        {
            headers: {
                'Content-Type': 'application/json',
                'Proxy-Connection': 'keep-alive',
                'Cookie': req.headers.cookie
            }
        }
    );
    
    // Resolve promise
    data.then( function(res) {

        // Set response cookie
        console.dir(res.headers['set-cookie']);
        for(let cookieData of res.headers['set-cookie']) {

            // Get cookie key & value
            let cookieKey = cookieData.split(";")[0].split("=")[0];
            let cookieVal = cookieData.split(";")[0].split("=")[1];

            // Create cookie
            resp.cookie(cookieKey, cookieVal, {
                maxAge: (3 * 24 * 60 * 60),
                httpOnly: true,
                path: "/"
            });
        }

        // Send response
        resp.writeHead(200, {'Content-Type': 'application/json'});
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        if( error.response.data != undefined ) {
            resp.writeHead(error.response.status, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(error.response.data));
        }
        console.dir(error.response, {depth: null});
    });
});



/**
 * Configure projects proxy paths
*/


// Define proxy paths
router.get("/projects/listProject", function(req, resp) {

    // Serve back json
    console.log(`\n\nA request came in for: ${req.url}`);
    resp.writeHead(200, {'Content-Type': 'application/json'});

    // Fetch promise for the auth page
    let data = instance.get(`${apiForwardingUrl}/projects/listProject`);
    
    // Resolve promise
    data.then( function(res) {
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        console.log(error);
    });
});


// List projects
router.get("/projects/listProjects", function(req, resp) {

    // Serve back json
    console.log(`\n\nA request came in for: ${req.url}`);
    resp.writeHead(200, {'Content-Type': 'application/json'});

    // Fetch promise for the auth page
    let data = instance.get(`${apiForwardingUrl}/projects/listProjects`);
    
    // Resolve promise
    data.then( function(res) {
        resp.end(JSON.stringify(res.data));
    })
    .catch( (error) => {
        console.log(error);
    });
});


// Post recording
router.all("/projects/post-recording", function(req, resp) {

    // Serve back json
    console.log(`A request came in for: ${req.url}`);
    resp.writeHead(200, {'Content-Type': 'application/json'});

    // Fetch promise for the auth page
    let data = instance.get(`${apiForwardingUrl}/projects/post-recording`);
    
    // Resolve promise
    data.then( function(res) {
        resp.end(res.data);
    })
    .catch( (error) => {
        console.log(error);
    });
});


///////////////////////////////////////////////////
///////////////////////////////////////////////////
/// 
/// Serve app
/// 
///////////////////////////////////////////////////
///////////////////////////////////////////////////


// Run server
server.
    listen(
        process.env.PORT || 8080,
        process.env.IP || '0.0.0.0',
        () => {

            // Log Address of web server + serving dir
            let srvrAddr = server.address();
            console.log(`BandCloud listening on port = ${srvrAddr.port}, address = ${srvrAddr.address}`);
            console.log(`Backend API = ${apiForwardingUrl}`);
            console.log(`Current directory: ${appDir}`);
        }
    )
;
