/**
 * Created by Administrator on 2017/1/12
 * 简易nodeJs服务器
 * author: lzy
 */

var PORT,
  http,
  url,
  mime,
  path,
  setting,
  server;
http = require('http');
url = require('url');
fs = require('fs');
mime = require('./mime').types;
path = require('path');
setting = require('./server.config').config;
PORT = setting.port;

server = http.createServer(function(request, response) {
  var pathname,
    ext,
    realPath,
    def,
    getUrl;
  pathname = url.parse(request.url).pathname;
  def = setting.simple;
  for( var i=0; i< def.length; i++){
    getUrl = pathname.slice(1);
    if(getUrl === def[i]){
        pathname = "/"+setting.default+"."+setting.fileType;
      break;
  }
  }
  realPath = path.join(setting.viewsPath, pathname);
  ext = path.extname(realPath);
  ext = ext ? ext.slice(1) : 'unknown';  //文件路径是否存在
  fs.exists(realPath, function (exists){
    if (!exists) { //不存在
      fs.readFile("error/404.html", "binary", function (err, file) {
        response.writeHead(404 ,{
          'Content-Type': 'text/html'
        });
        response.write(file, "binary");
        response.end();
      });
    } else {
      fs.readFile(realPath, "binary", function (err, file) {
        if(err) {
          response.writeHead(500, {
            'Content-Type': 'text/plain'
          });
        } else {
          var contentType = mime[ext] || 'text/plain';
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.write(file, "binary");
          response.end();
        }
      })
    }
  })
});
server.listen(PORT);
console.log("Server running at port:" + PORT + "." );