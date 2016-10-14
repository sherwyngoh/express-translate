This application uses the Yandex API (https://tech.yandex.com/translate/doc/dg/reference/getLangs-docpage/#JSON) to convert strings between French, English and Spanish.

Stack:

Runtime - node (6.8.0)
Framework - express (4.13.4)
Utilities
  - express-generator : application generator
  - config : secrets management
    - usage:
      `
        var config = require("config");
        apikey = config.get("YandexAPIkey")
      `


Getting started:

1. Clone the repository
2. cd into it
3. `npm install`
4. Obtain a Yandex API key @ (www.yandex.com)
5. `cp config/sample.json config/default.json`
6. Set key in lieu of 'replaceme'
7. Install MongoDB for local database (https://www.mongodb.com/download-center?jmp=nav#community)
8. `mkdir data && mongod --dbpath=./data --port 27017`
9. nodemon to start server and watch for file changes