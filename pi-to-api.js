var http = require("http");
var XLSX = require("xlsx");
var fetch = require("node-fetch");

var hostname = "localhost";
var port = process.env.PORT || 6000;
// var formattedEverything = {};
var addressArray = {};

// Set up workbook for server start
// Get excel document flood-data.xlsx
getWorksheet = () => {
  workbook = XLSX.readFile("./Apartment-Flooding-Survey1.xlsx");
  first_sheet = workbook.SheetNames[0];
  //   console.log(first_sheet);
  //   console.log(workbook.Sheets[first_sheet]);
  return workbook.Sheets[first_sheet];
};
var worksheet = getWorksheet();

getEverything = worksheet => {
  for (i = 2; i > 0; i++) {
    var idCellName = "A" + i;
    var addressCellName = "H" + i;
    var insideDMGCellName = "I" + i;
    var parkingDMGCellName = "J" + i;
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
  getEverything(worksheet);
}, 5000); // 5 seconds

setInterval(() => {
  putEverything(addressArray);
}, 10000); // 10 seconds

var server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "GET" && request.url === "/map/everything") {
    response.write(getEverything(worksheet));
    response.end();
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function putEverything(newObj) {
  try {
    await fetch("http://localhost:4243" + "/map/everything", {
      method: "POST",
      body: JSON.stringify(newObj)
    });
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
