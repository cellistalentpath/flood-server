var http = require("http");
var fetch = require("node-fetch");

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
    request.on("data", function(chunk) {
      everything = JSON.parse(chunk.toString());
    });
    response.end();
  }
  if (request.method === "POST" && request.url === "/map/formatted") {
    request.on("data", function(chunk) {
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
      sendFormatted(formattedEverything);
      response.end();
    });
  }
  if (request.method === "GET" && request.url === "/map/formatted") {
    getStored().then(data => {
      response.write(JSON.stringify(data));
      response.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function getStored() {
  let addresses;
  try {
    const response = await fetch(
      "http://71.132.173.1:6000" + "/store/formatted"
    );
    addresses = await response.text();
    addresses = JSON.parse(addresses);
    return addresses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

sendFormatted = newObj => {
  var postData = JSON.stringify(newObj);

  var options = {
    hostname: "71.132.173.1",
    port: 6000,
    path: "/store/formatted",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length
    }
  };

  var req = http.request(options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      console.log("BODY: " + chunk);
    });
  });

  req.on("error", function(e) {
    console.log("problem with request: " + e.message);
  });

  // write data to request body
  req.write(postData);
  req.end();
};
