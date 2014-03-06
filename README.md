instacase
=========

iPhone Case App

Quickstart
----------

Run with `npm start` and go to `http://localhost:3000`

Debugging
---------

- `sudo npm install -g supervisor node-inspector`

For automatic server reloading when source files change
- `supervisor server.js`

Enable debug statements in console
- `DEBUG=instacase supervisor server.js`

Debug node.js code in browser
- `node-inspector &`
- `supervisor --debug server.js`
- Go to `http://localhost:8080/debug?port=5858`
