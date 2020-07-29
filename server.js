var http = require("http");
var fetch = require("node-fetch");

var hostname = "localhost";
var port = process.env.PORT || 4243;
var PI_URL = "http://192.168.1.70:6942";

var server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "POST" && request.url === "/store/formatted") {
    var body = [];
    request
      .on("data", function(chunk) {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        postFormatted(JSON.stringify(JSON.parse(body)));
        response.end();
      });
  }
  if (request.method === "GET" && request.url === "/store/formatted") {
    getFormatted().then(data => {
      response.write(JSON.stringify(data));
      response.end();
    });
  }
  if (request.method === "GET" && request.url === "/store/everything") {
    getEverything().then(data => {
      response.write(JSON.stringify(data));
      response.end();
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function postFormatted(newObj) {
  try {
    await fetch(PI_URL + "/store/formatted", {
      method: "POST",
      body: newObj
    });
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getFormatted() {
  let addresses;
  try {
    const response = await fetch(PI_URL + "/store/formatted");
    addresses = await response.text();
    addresses = JSON.parse(addresses);
    return addresses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getEverything() {
  let addresses;
  try {
    const response = await fetch(PI_URL + "/store/everything");
    addresses = await response.text();
    addresses = JSON.parse(addresses);
    return addresses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// async function getStored() {
//   let addresses;
//   try {
//     const response = await fetch(
//       "http://71.132.173.1:6000" + "/store/formatted"
//     );
//     addresses = await response.text();
//     addresses = JSON.parse(addresses);
//     return addresses;
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }
// }

// async function getNewData() {
//   let addresses;
//   try {
//     const response = await fetch(
//       "http://71.132.173.1:6000" + "/store/formatted"
//     );
//     addresses = await response.text();
//     addresses = JSON.parse(addresses);
//     return addresses;
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }
// }

// sendFormatted = newObj => {
//   var postData = JSON.stringify(newObj);

//   var options = {
//     hostname: "71.132.173.1", //71.132.173.1
//     port: 6000,
//     path: "/store/formatted",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": postData.length
//     }
//   };

//   var req = http.request(options, function(res) {
//     res.setEncoding("utf8");
//     res.on("data", function(chunk) {
//       console.log("BODY: " + chunk);
//     });
//   });

//   req.on("error", function(e) {
//     console.log("problem with request: " + e.message);
//   });

//   // write data to request body
//   req.write(postData);
//   req.end();
// };
