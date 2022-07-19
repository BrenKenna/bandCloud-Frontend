/**
 * App to serve the SPA and proxy requests to backend resources
 *  => Decided to not explore further for this project as all forwarding requests needs to be coded.
 * 
 *  => Additionally axios was useful for successul forwarding. 
 *      In that I could maybe do something more, but it didn't work "of the shelf" and got the below error.
 *      The request is successfully sent to the backend & the response does send back data in body
 *          => Maybe something here is the issue, checkout in another project.
 * 
 *  => Using angluar clients development server, as fallback for proxying requests
 *      => But running on EC2 asks for user input so not doing that
 * 
 *  => I can however deploy this, use a shell script to update the backend ELB and access app over the web
 *      => While the docker container will be big, I still have a frontend that:
 *          1. Is accessible over the web (ie makes use of cloud infrastructure)
 *          2. Can talk to the backend REST API
 *          3. Can be updated for using a valid X509 cert so that communications are encrypted
 *              => Self-signed certs causing issues that they weren't before.
 *                  Ignoring it, but leaving the code in
 * 
 *          4. Can be further developed to proxy requests to backend resources, in a customizable manner
 *          5. Have done everything I have set out to do :)
 * 
 * TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. 
 *  Received an instance of Array
 */

// Import required modules
const
    https = require('http'),
    path = require('path'),
    express = require('express'),
    axios = require('axios'),
    proxyConf = require('./src/proxy-config.json'),
    fs = require('fs')
;
// httpProxy = require('http-proxy')

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
//  Deployment version localhost = TEMPLATE_ELB_DNS
const
    backendHost = 'resource.bandcloud.com',
    apiForwardingUrl = 'http://' + backendHost + ':8080'
;
// apiProxy = httpProxy.createProxyServer();

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