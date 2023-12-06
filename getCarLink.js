const axios = require("axios");
const cheerio = require("cheerio");
const urls = require("./urls");

const getCarLink = async () => {
  try {
    const res = await axios.get(urls.base);
    if (res.status === 200) {
      const links = [];
      const html = res.data;
      const $ = cheerio.load(html);

      const body = $("#contentblank > table > tbody > tr");

      const filteredRows = body
        .slice(3)
        .filter((index, _) => index === 0 || index % 2 === 0);

      filteredRows.each((_, element) => {
        const href = $(element).find("#Frame > a").attr("href");

        if (href !== undefined) {
          links.push(`${urls.link}${href}`);
        }
      });

      return links;
    } else {
      console.log("Failed to fetch the website");
    }
  } catch (err) {
    console.log("Error in web service: ", err);
    process.exit(1);
  }
};

module.exports = getCarLink;
