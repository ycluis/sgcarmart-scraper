const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const getCarLink = require("./getCarLink");

const getCarDetails = async (link) => {
  try {
    const res = await axios.get(link);
    const $ = cheerio.load(res.data);

    const name = $("#toMap > div > a").text().trim();
    const price = $(
      "#carInfo > tbody > tr:nth-child(1) > td.font_red > a > strong",
    )
      .text()
      .trim()
      .replace(",", "");
    const depreciation = $(
      "#carInfo > tbody > tr:nth-child(2) > td:nth-child(2)",
    )
      .text()
      .trim()
      .replace(/\/yr.*/, "/yr")
      .replace(",", "");
    const coe = $(
      "#carInfo > tbody > tr:nth-child(3) > td:nth-child(1) > div:nth-child(4) > div.row_info",
    )
      .text()
      .trim()
      .replace(",", "");
    const regDate = $("#carInfo > tbody > tr:nth-child(2) > td:nth-child(4)")
      .text()
      .trim();
    const mileage = $(
      "#carInfo > tbody > tr:nth-child(3) > td:nth-child(1) > div:nth-child(1) > div.row_info",
    )
      .text()
      .trim()
      .replace(",", "");
    const noOwners = $(
      "#carInfo > tbody > tr:nth-child(3) > td:nth-child(2) > div:nth-child(7) > div.row_info",
    )
      .text()
      .trim();

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
