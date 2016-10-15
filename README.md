### Express-translate


This application uses the [Yandex API](https://tech.yandex.com/translate/doc/dg/reference/getLangs-docpage/#JSON) to convert strings between French, English and Spanish.

#### Stack:

- Runtime
  - node 
- Framework 
  - express 
- Application Utilities
  - express-generator : application generator
  - config : secrets management
  - pug : templating
  - database: mongodb
  - nodemon: hot code restarts for server
- Testing
  - mocha
  - sinon
  - supertest
  - should

#### Local Setup:

* Ensure that you have git and mocha installed globally, and obtain a Yandex API key [here](http://www.yandex.com). Install [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) for dev/test database*

- `git clone git@github.com:sherwyngoh/express-translate.git && cd express-translate/`
- `npm install`
- `cp config/sample.json config/default.json`
  -_Remember to set your APIkey in config/default.json_
- if you don't have nodemon, `npm install -g nodemon`
- `mkdir data && mongod --dbpath=./data --port 27017`
- `npm test`
- `nodemon`