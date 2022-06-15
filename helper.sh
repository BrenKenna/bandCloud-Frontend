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
# import { ReactiveFormsModule } from '@angular/forms';
# import {AUDIO_CONTEXT} from '@ng-web-apis/audio';
npm i '@angular/animations' '@angular/material' '@ng-web-apis/audio';
npm i '@angular/forms'

# Create a new app component
ng generate component file-picker
ng generate componenet file-dropzone

# Generate pipe: Transform one value to another
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



# Serve an app: http://localhost:4200
ng serve