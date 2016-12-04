var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-type' : 'text/html' });
  res.end(fs.readFileSync(__dirname +  '/index.html', 'utf-8'));
}).listen(3000);

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
  socket.on('client_to_server', function(data) {
    io.sockets.emit('server_to_client', { value : data.value });
  });

  socket.on('client_to_server_broadcast', function(data) {
    socket.broadcast.emit('server_to_client', {value: data.value});          
  });

  socket.on('client_to_server_personal', function(data) {
    var id = socket.id;
    name = data.value;
    var personalMessage = "あなたは" + name + "さんとして入室しました。";
    io.to(id).emit('server_to_client', {value: personalMessage });
  });
});
