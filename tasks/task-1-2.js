const fs = require("fs");
const csv = require("csvtojson");

const csvFilePath = `./csv/nodejs-hw1-ex1.csv`;

let writeableStream = fs.createWriteStream("output.txt");

csv()
  .fromFile(csvFilePath)
  .on("data", (data) => {
    writeableStream.write(`${data}\n`);
  });

csv().on("done", (error) => {
  writeableStream.end();
});
