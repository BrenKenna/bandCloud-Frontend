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
npm i '@angular/animations' '@angular/material'


# Create a new app component
ng generate component file-picker
ng generate componenet file-dropzone

# Generate pipe?
ng generate pipe read-mode-pipe

# Serve an app
ng serve