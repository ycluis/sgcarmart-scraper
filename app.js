const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const getCarLink = require("./getCarLink");
const getCarContent = require("./getCarContent");

const getCarDetails = async (link) => {
  try {
    const res = await axios.get(link);
    const $ = cheerio.load(res.data);

    const carContent = getCarContent($);

    const name = carContent.getName($);
    const price = carContent.getPrice($);
    const depreciation = carContent.getDepre($);
    const coe = carContent.getCoe($);
    const mileage = carContent.getMileage($);
    const regDate = carContent.getRegDate($);
    const noOwners = carContent.getOwners($);

    return {
      name,
      price,
      link,
      depreciation,
      coe,
      mileage,
      regDate,
      noOwners:
        noOwners === ""
          ? $(
              "#carInfo > tbody > tr:nth-child(3) > td:nth-child(2) > div:nth-child(6) > div.row_info",
            )
              .text()
              .trim()
          : noOwners,
    };
  } catch (err) {
    console.log(err);
  }
};

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
  const links = await getCarLink();

  const data = [];

  for (const link of links) {
    const row = await getCarDetails(link);
    data.push(row);
  }

  writeToCsv(data);
})();
