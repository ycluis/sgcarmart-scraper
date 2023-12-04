const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const info = "https://www.sgcarmart.com/used_cars/";

const url =
  "https://www.sgcarmart.com/used_cars/listing.php?RPG=ALL&ASL=1&MOD=Toyota%20Alphard&DP2=&DP1=&AVL=2&OPC[]=0&PR2=&PR1=&FR=2020&TO=2023&ORD=";

axios
  .get(url)
  .then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      // Select all tr elements under the specified path
      const mainBody = $("#contentblank > table > tbody > tr");

      // Remove the first three items
      const filteredRows = mainBody
        .slice(3)
        // Filter only index 0 and index % 2 === 0
        .filter((index, element) => index === 0 || index % 2 === 0);

      const data = [];

      // Output the text content of each selected row
      filteredRows.each((index, element) => {
        const href = $(element).find("#Frame > a").attr("href");
        const name = $(element)
          .find(
            "td > table > tbody > tr > td:nth-child(6) > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > div > strong > a"
          )
          .text()
          .trim();
        const price = $(element)
          .find(
            "td > table > tbody > tr > td:nth-child(6) > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td.font_red > div"
          )
          .text()
          .trim();
        const status = $(element)
          .find(
            "td > table > tbody > tr > td:nth-child(6) > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(16) > div > strong > font"
          )
          .text()
          .trim();

        const row = {
          name,
          price,
          status,
          link: `${info}${href}`,
        };

        if (href !== undefined) {
          data.push(row);
        }

        console.log(
          `Row ${
            index + 1
          } Name: ${name} Price: ${price} Status: ${status} Link: ${info}${href}`
        );
      });

      // Write data to CSV file
      const csvData = data
        .map((row) => `${row.name},${row.price},${row.status},${row.link}`)
        .join("\n");

      fs.writeFileSync(
        "output.csv",
        "Name,Price,Status,Link\n" + csvData,
        "utf-8"
      );
      console.log("Data has been written to output.csv");
    } else {
      console.log("Failed to fetch the website");
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
