const fs = require("fs");
const getCarDetails = require("./getCarDetails");
const getCarLink = require("./getCarLink");

const writeToCsv = (data) => {
  const csvData = data
    .map(
      (row) =>
        `${row.name},${row.price},${row.link},${row.depreciation},${row.coe},${row.mileage},${row.regDate},${row.noOwners}`,
    )
    .join("\n");

  fs.writeFileSync(
    "output.csv",
    "Name,Price,Link,Depreciation,COE,Mileage,Reg Date,No of Owners\n" +
      csvData,
    "utf-8",
  );
  console.log("Data has been written to output.csv");
};

(async () => {
  console.log("Processing...");

  const links = await getCarLink();
  const data = [];

  for (const link of links) {
    const row = await getCarDetails(link);
    data.push(row);
  }

  writeToCsv(data);
})();
