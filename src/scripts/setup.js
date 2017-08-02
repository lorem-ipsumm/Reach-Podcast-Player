const parser = require('rss-parser');
const howler = require('howler');
const fs = require('fs');
const http = require('http');
const request = require('request');
const admin = require('firebase-admin');


angular.module('main',['ngAnimate','rzModule']);


//Google Firebase Setup
var serviceAccount = require("../service-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reach-40be2.firebaseio.com"
});
