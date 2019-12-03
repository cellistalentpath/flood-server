var http = require("http");
//var https = require("https"); ERR_SSL_VERSION_OR_CIPHER_MISMATCH
//var XLSX = require("xlsx");
//var cors = require("cors");

var hostname = "localhost";
var port = process.env.PORT || 4243;
//var formattedEverything = {};

setInterval(() => {
  worksheet = getWorksheet();
}, 15000); // 15 seconds

var server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  // if (request.method === "GET" && request.url === "/") {
  //   response.write("nice yeet");
  //   response.end();
  // }
  if (request.method === "GET" && request.url === "/map/everything") {
    response.write(getEverything(worksheet));
    response.end();
  }
  // if (request.method === "GET" && request.url === "/map/formatted") {
  //   response.write(JSON.stringify(formattedEverything));
  //   //fetch;
  //   response.end();
  // }
  // if (request.method === "POST" && request.url === "/map/formatted") {
  //   request.on("data", function(chunk) {
  //     // console.log("Received body data:");
  //     // console.log(chunk.toString());
  //     // console.log(JSON.parse(chunk.toString()).id);
  //     for (id in formattedEverything) {
  //       if (
  //         formattedEverything[id].formattedHeld ===
  //         JSON.parse(chunk.toString()).formattedHeld
  //       ) {
  //         formattedEverything[id].totalResidents = JSON.parse(
  //           chunk.toString()
  //         ).totalResidents;
  //       }
  //     }
  //     formattedEverything[JSON.parse(chunk.toString()).id] = JSON.parse(
  //       chunk.toString()
  //     );
  //     response.end();
  //   });
  // }
});

server.listen(port, () => {
  //port, ()
  console.log(`Server running at http://${hostname}:${port}/`);
});
