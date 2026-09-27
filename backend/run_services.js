const { spawn } = require("child_process");
const path = require("path");

const services = [
  { name: "Product Service (5001)", file: "product_service.js", color: "\x1b[32m" }, // Green
  { name: "Search Service (5002)", file: "search_service.js", color: "\x1b[36m" },  // Cyan
  { name: "Order Service (5003)", file: "order_service.js", color: "\x1b[33m" },    // Yellow
  { name: "Cart Service (5004)", file: "cart_service.js", color: "\x1b[34m" },      // Blue
  { name: "Payment Service (5005)", file: "payment_service.js", color: "\x1b[35m" }  // Magenta
];

const resetColor = "\x1b[0m";

console.log("=======================================================");
console.log("🚀 Starting E-Commerce 5-Microservices Architecture...");
console.log("=======================================================\n");

services.forEach((service) => {
  const servicePath = path.join(__dirname, service.file);
  const child = spawn("node", [servicePath]);

  child.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) {
        console.log(`${service.color}[${service.name}]${resetColor} ${line}`);
      }
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) {
        console.error(`${service.color}[${service.name} ERROR]${resetColor} \x1b[31m${line}${resetColor}`);
      }
    });
  });

  child.on("close", (code) => {
    console.log(`${service.color}[${service.name}]${resetColor} exited with code ${code}`);
  });
});
