#!/bin/sh
node-inspector &
DEBUG=instacase supervisor --debug server.js
