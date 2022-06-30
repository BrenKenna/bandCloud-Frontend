/**
 * App to serve the SPA and proxy requests to backend resources
 *  => Decided to drop for this project as all forwarding requests need to be coded.
 *  => Additionally axios was useful for successul forwarding, but got the below.
 *  => Deployment serves an angular app, not the built distribution
 * 
 * TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. 
 *  Received an instance of Array
 */

// Import required modules
const
    https = require('http'),
    path = require('path'),
    express = require('express'),
    httpProxy = require('http-proxy'),
    axios = require('axios'),
    proxyConf = require('./src/proxy-config.json')
;


///////////////////////////////////////////////////
///////////////////////////////////////////////////
///
/// Web & Proxy Server Config
///
///////////////////////////////////////////////////
///////////////////////////////////////////////////


// Configure the web server
const
    router = express(),
    server = https.createServer(router)
;

// Serve main page
const appDir = __dirname + "/dist/file-explorer/";
router.use(express.static(appDir));
router.use(express.urlencoded({extended: true}));
router.use(express.json());


/**
 * 
 * Configure proxy server
 * 
 */

// Setup proxy
const
    apiProxy = httpProxy.createProxyServer(),
    backendHost = 'localhost',
    apiForwardingUrl = 'http://' + backendHost + ':8080'
;

// Alternative
const instance = axios.create();

// 
// Acknowledged but nothing happens leaving it out
// 

// Define proxy paths
router.all("/projects/listProject", function(req, resp) {

    // Serve back json
    console.log(`A request came in for: ${req.url}`);
    resp.writeHead(200, {'Content-Type': 'application/json'});

    // Fetch promise for the auth page
    let data = instance.get(`${apiForwardingUrl}/projects/listProject`);
    
    // Resolve promise
    data.then( function(res) {
        resp.end(res.data);
    });
});


// List projects
router.all("/projects/listProjects", function(req, resp) {

    // Serve back json
    console.log(`A request came in for: ${req.url}`);
    resp.writeHead(200, {'Content-Type': 'application/json'});

    // Fetch promise for the auth page
    let data = instance.get(`${apiForwardingUrl}/projects/listProjects`);
    
    // Resolve promise
    data.then( function(res) {
        resp.end(res.data);
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
        process.env.PORT || 4200,
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