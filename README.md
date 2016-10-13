This application uses the Yandex API to convert strings between French, English and Spanish.

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
7. npm start