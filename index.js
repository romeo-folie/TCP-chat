const net = require('net');
var count = 0
var users = {}


net.createServer((conn) => {
  var grammar;
  if (count < 1){
    grammar = " persons connected at this time";
  }
  else if (count === 1){
    grammar = " other person connected"
  }
  else{
    grammar = " other people connected"
  }
  conn.write("\n > welcome to chat"
+ "\n > " + count + `${grammar}.`
+ "\n > please write your name and press enter: ");
count ++

var nickname;

//sets encoding for data to be transmitted. Originally appears as just Buffer
conn.setEncoding('utf-8')

//Client departure alert
function broadcast (msg) {
  for (var i in users) {
    if (i != nickname) {
      users[i].write(msg);
    }
  }
}
console.log("new connection")

//data event listener
conn.on('data', function (data) {
  data = data.replace('\r\n', '');
  // console.log(data)
  //expect first data to be nickname
  if (!nickname) {
    if (users[data]) {
      conn.write("nickname already in use. try again:");
      return;
    } else {
      nickname = data;
      users[nickname] = conn;
      for (var i in users) {
        users[i].write("\n"+nickname + " joined the room\n");
        }
      }
    }
    else {
      // otherwise consider it a chat message
      //broadcast it to everyone that is not me.
      for (var i in users) {
        if (i != nickname) {
          users[i].write("\n" + nickname + ": " + data + "\n");
          }
        }
      }
});

conn.on('close', () => {
  if (nickname != undefined){
    broadcast("\n"+nickname + "left the room\n")
    count--
    delete users[nickname]
  }
});

}).listen(3000, () => {
    console.log("Server listening on port 3000");
});
