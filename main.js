const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const howler = require('howler');


let win;

app.on('ready',function() {
  var win = new BrowserWindow({
     width: 600,
     height: 450,
     frame: false,
     radii: [5,5,5,5],
     transparent: true
   });

  win.loadURL('file://' + __dirname + '/src/index.html');
  //win.webContents.openDevTools();
});


app.on('window-all-closed', function(){
  app.quit();
});
