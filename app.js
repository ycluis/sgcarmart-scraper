const fs = require("fs");
const ora = require("ora");
const spinners = require("cli-spinners");
const getCarDetails = require("./getCarDetails");
const getCarLink = require("./getCarLink");

const spinner = ora();
spinner.spinner = spinners.line;

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
  spinner.succeed(`Data has been written to output.csv`);
};

(async () => {
  try {
    spinner.start("Processing...");

    const links = await getCarLink();
    const data = [];

    for (const link of links) {
      const row = await getCarDetails(link);
      data.push(row);
    }

    writeToCsv(data);
  } catch (err) {
    console.log(err);
    spinner.fail(err);
    process.exit(1);
  }
})();
