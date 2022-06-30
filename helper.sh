###############################################################
###############################################################
# 
# Supporting Code for app
# 
# References:
#  - PWA Angular Apress Book
#  - https://www.npmjs.com/package/ngx-file-helpers
#  - App structure etc
#     https://stackblitz.com/edit/ngx-file-helpers-demo
# 
###############################################################
###############################################################


#####################
# 
# Setup etc
# 
#####################

# Install angular
npm install --save -g @angular/cli

# Initalize an app
ng new file-explorer --routing --style=scss
cd file-explorer

# Install dependancies
npm i '@angular/animations' '@angular/material' '@angular/forms';
npm i angular-audio-context;

# Create a new app component
ng generate component file-picker
ng generate componenet file-dropzone

# Generate pipe: Transform one type to another
# kinda like how eunms can work with strategy pattern
ng generate pipe read-mode-pipe

# Generate service to manage audio & talk to backend api
ng generate service services/backend/bandCloud-rest-account
ng generate service services/backend/bandCloud-rest-projects
ng generate service services/audio/bandCloud-audio


# Create account components
ng generate component account-manager
ng generate component account-displayer
ng generate component projects


# Create user model, register & login components
ng generate component register
ng generate component login
ng generate class user_model/user
ng generate enum user_model/user_validation
ng generate enum user_model/accountTypes
ng generate class user_model/user-display/user-display
ng generate class user_model/user-display/user-display-update


# Create projects module & models
ng generate component projects/projects-viewer
ng generate module projects/projects-viewer --routing

ng generate class projects/model/projects-model
ng generate class projects/model/project-model
ng generate class projects/model/file-metadata
ng generate class projects/model/file-tag
ng generate class projects/model/token-tag


# Generate project page etc
ng generate component projects/project-page
ng generate module projects/project-page --routing



#######################################
#######################################
#
# Serving notes
#
#######################################
#######################################

# Proxy config
ls 'src/proxy-config.json'


# Serve an app: http://localhost:4200
ng serve


# Build and serve with dev tool
npm install --global lite-server # Above app
ng build # At app level
lite-server -c bs-config.json

``
- Serves nicely but does not proxy requests
- Need to change some of the paths. Currently set with "assests/"
    ls dist/file-explorer/assets/
        site_audio_acoustic.mp3
    22.06.30 11:27:45 404 GET /assest/site_audio_acoustic.mp3

{
    "injectChanges": false,
    "files": [ "./**/*.{html,htm,css,js}" ],
    "watchOptions": { "ignored": "node_modules" },
    "port": 4200,
    "server": { "baseDir": "./dist/file-explorer" }
}

``

# Install modules: Tried these but too much at this stage
#   => Just going to deploy via "ng serve"
npm i -g express http-proxy axios


################################
# 
# Generate Self-Signed Cert
# 
#   Bugging out now
# 
################################


# Generate self-signed cert
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem