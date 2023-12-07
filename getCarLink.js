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

      $("strong").each((_, element) => {
        const link = $(element).find("a");
        if (link.attr("href") && link.attr("href").includes("info")) {
          links.push(`${urls.link}${link.attr("href")}`);
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
