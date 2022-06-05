##################################
# 
# Any useful command line code
#
# Reference:
#   https://www.itechinsiders.com/how-to-upload-document-using-file-chooser-in-ionic3-and-ionic4/
# 
##################################


###################
# 
# Initial Setup
# 
###################

# Install ionic & cordova
npm i -g ionic cordova


# Start blank project
ionic start fileExplorer blank --type=angular
cd fileExplorer

ionic cordova plugin add cordova-plugin-filechooser com-badrit-base64
npm i @ionic-native/file-chooser @ionic-native/base64