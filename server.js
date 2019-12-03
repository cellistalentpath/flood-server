var https = require("https");
//var https = require("https"); ERR_SSL_VERSION_OR_CIPHER_MISMATCH
var XLSX = require("xlsx");
var cors = require("cors");

var hostname = "localhost";
var port = process.env.PORT || 4243;
var formattedEverything = {};

// Set up workbook for server start
// Get excel document flood-data.xlsx
getWorksheet = () => {
  workbook = XLSX.readFile("./flood-data.xlsx");
  first_sheet = workbook.SheetNames[1];
  return workbook.Sheets[first_sheet];
};
var worksheet = getWorksheet();

getEverything = worksheet => {
  var addressArray = {};
  for (i = 2; i > 0; i++) {
    var idCellName = "A" + i;
    var addressCellName = "H" + i;
    var insideDMGCellName = "K" + i;
    var parkingDMGCellName = "L" + i;
    var idCell = worksheet[idCellName];
    var addressCell = worksheet[addressCellName];
    var insideDMGCell = worksheet[insideDMGCellName];
    var parkingDMGCell = worksheet[parkingDMGCellName];
    var idValue = idCell ? idCell.v : undefined;
    var addressValue = addressCell ? addressCell.v : undefined;
    var insideDMGValue = insideDMGCell ? insideDMGCell.v : undefined;
    var parkingDMGValue = parkingDMGCell ? parkingDMGCell.v : undefined;
    if (idValue === undefined) {
      break;
    }
    if (insideDMGValue === "Yes") {
      insideDMGValue = 1;
    } else if (insideDMGValue === "No") {
      insideDMGValue = -1;
    } else {
      insideDMGValue = 0;
    }
    if (parkingDMGValue === "Yes") {
      parkingDMGValue = 1;
    } else if (parkingDMGValue === "No") {
      parkingDMGValue = -1;
    } else {
      parkingDMGValue = 0;
    }

    addressArray[idValue] = {
      addressValue,
      insideDMGValue,
      parkingDMGValue
    };
  }
  return JSON.stringify(addressArray);
};

setInterval(() => {
  worksheet = getWorksheet();
}, 15000); // 15 seconds

var server = https.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "GET" && request.url === "/") {
    response.write(JSON.stringify(formattedEverything));
    response.end();
  }
  // if (request.method === "GET" && request.url === "/map/everything") {
  //   response.write(getEverything(worksheet));
  //   response.end();
  // }
  // if (request.method === "GET" && request.url === "/map/formatted") {
  //   response.write(JSON.stringify(formattedEverything));
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
  //   });
  //   response.end();
  // }
});

server.listen(port, () => {
  //port, ()
  console.log(`Server running at http://${hostname}:${port}/`);
});
