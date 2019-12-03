const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3100;

// Set up workbook for server start
// Get excel document flood-data.xlsx
getWorksheet = () => {
  workbook = XLSX.readFile("./flood-data.xlsx");
  first_sheet = workbook.SheetNames[1];
  return workbook.Sheets[first_sheet];
};
let worksheet = getWorksheet();

// Get all addresses from excel document
getAddresses = worksheet => {
  addressArray = [];
  for (i = 2; i > 0; i++) {
    let cellName = "H" + i;
    cell = worksheet[cellName];
    value = cell ? cell.v : undefined;
    if (value === undefined) {
      break;
    }
    addressArray[i - 2] = value;
  }
  return JSON.stringify(addressArray);
};

getDidAddressesFlood = worksheet => {
  didItFloodArray = [];
  for (i = 2; i > 0; i++) {
    let cellName = "K" + i;
    cell = worksheet[cellName];
    value = cell ? cell.v : undefined;
    if (value === undefined) {
      break;
    }
    didItFloodArray[i - 2] = value;
  }
  return JSON.stringify(didItFloodArray);
};

// let addresses = getAddresses(getWorksheet());

// Update worksheet every 30 seconds (one drive updates every minute)
setInterval(function() {
  worksheet = getWorksheet();
}, 30000);

app.get("/map/addresses", (req, res) => {
  res.send(getAddresses(worksheet));
});

app.post("/map/did-location-flood", (req, res) => {
  res.send(getDidAddressesFlood(worksheet));
});

app.get("/", (req, res) => res.send(addresses));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
