var http = require("http");

var hostname = "localhost";
var port = process.env.PORT || 4243;
var everything = {};
var formattedEverything = {};

var server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "GET" && request.url === "/map/everything") {
    response.write(JSON.stringify(everything));
    response.end();
  }
  if (request.method === "POST" && request.url === "/map/everything") {
    var body = [];
    request.on("data", function (chunk) {
      body.push(chunk);
    }).on("end", () => {
      body = Buffer.concat(body).toString();
      everything = JSON.parse(body);
      response.end();
    })
  }
  if (request.method === "POST" && request.url === "/map/formatted") {
    request.on("data", function (chunk) {
      for (id in formattedEverything) {
        if (
          formattedEverything[id].formattedHeld ===
          JSON.parse(chunk.toString()).formattedHeld
        ) {
          formattedEverything[id].totalResidents = JSON.parse(
            chunk.toString()
          ).totalResidents;
        }
      }
      formattedEverything[JSON.parse(chunk.toString()).id] = JSON.parse(
        chunk.toString()
      );
      response.end();
    });
  }
  if (request.method === "GET" && request.url === "/map/formatted") {
    response.write(JSON.stringify(formattedEverything));
    response.end();
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
