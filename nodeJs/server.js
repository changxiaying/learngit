var http = require('http'); //http服务器和客户端功能

var fs = require('fs'); //文件系统

var path = require('path'); //内置的path模块提供了与文件系统路径相关的功能

var mime = require('mime'); //根据文件扩展名得出 MIME类型的能力

var cache = {}; // cache是用来缓存文件内容的对象

//三个辅助函数
//请求不存在时发送404错误
function send404 (response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: 1111resource not found');
	response.end();
}
//提供文件数据服务
function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200, {
			"content-type": mime.lookup(path.basename(filePath))
		}
	);
	response.end(fileContents);
}
//访问内存比访问文件系统快得多，node通常会把常用的数据缓存到内存里

function serveStatic(response, cache, absPath) {
	debugger
	if (cache[absPath]) { //检查文件是否缓存在内存中
		sendFile(response, absPath, cache[absPath]); // 从内存中返回文件		
	}else {
		fs.exists(absPath, function(exists) { //检查文件是否存在
			if (exists) {
				fs.readFile(absPath, function(err, data){ //从硬盘中读取文件
					if(err) {
						send404(response);
					}else {
						cache[absPath] = data;
						sendFile(response, absPath, data); //从硬盘读取文件并返回
					}
				})
			} else {
				send404(response);
			}
		});
	}
}

//创建服务器的逻辑
var server = http.createServer(function(request, response) {
	debugger
	var filePath = false;
	if (request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url; //
	}
	var absPath = './' + filePath;
	serveStatic(response, cache, absPath); //返回静态文件
});
//启动服务器
server.listen(3000, function() {
	console.log('Server listening on port 3000');
});

var chartServer = require('./lib/chat_server');
chatServer.listen(server);
var socketio = require('socket.io');

var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};




























