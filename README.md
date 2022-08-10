# bandCloud-Frontend

Angular web app for bandCloud, "https://bandcloudapp.com"

Content map under "**<u>*bandCloud-frontend/*</u>**"

| Component                   | Purpose                                                                                                | Path                                                         |
|:---------------------------:|:------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------:|
| **Web server**              | Serve application to users & proxy requests to REST-API                                                | dist-server.js                                               |
| **User Model**              | Models of Account Controller related objects                                                           | src/app/user_model                                           |
| **Audio Models**            | Track and track collection model objects. Translate project meta-data into object holding audio buffer | src/app/services/audio/models                                |
| **Audio Service**           | Attempt at encapsulating common audio tasks into a single object                                       | src/app/services/audio/band-cloud-audio.service.ts           |
| **Accounts Service**        | API calls to the backend account controller                                                            | src/app/services/backend/band-cloud-rest-account.service.ts  |
| **Projects Service**        | API calls to the backend project controller                                                            | src/app/services/backend/band-cloud-rest-projects.service.ts |
| **Project MetaData Models** | Models of the projects controller objects                                                              | src/app/projects/model                                       |
