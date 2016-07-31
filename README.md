A web app which build personal IOH Poster.

Since I have quit the job, this repository has nothing to with the organization.
It's just built for fun.

For more information of IOH, pleast visit the [Website](https://ioh.tw)

### Getting Started

First, install [GraphicsMagick](http://www.graphicsmagick.org).

Install dependencies and bower components

`$ npm install && npm run build`

Download [Elasticsearch](https://www.elastic.co/products/elasticsearch) v2.3.4

`$ npm run getelastic`

Concatenate all the HTML imports into a single file: elements.html

`$ npm run vulcanize`

Create your own Firebase project and get [Firebase Key](https://firebase.google.com/docs/server/setup#add_firebase_to_your_app).

Create your own config.js file, which looks like:
```js
"use strict";
var config = {
	port: <port-number>,
	serviceAccount: "./<service-account-credentials>.json",
	databaseURL: "https://<database-name>.firebaseio.com/"
};

module.exports = config;
```

We're almost done, let's run Elasticsearch!

`$ npm run elastic`

Start server!

`$ npm run start`