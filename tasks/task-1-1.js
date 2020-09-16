const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", function (line) {
  const reversedLine = line.split("").reverse().join("");
  console.log(reversedLine);
});
