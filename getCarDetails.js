const axios = require("axios");
const cheerio = require("cheerio");
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

module.exports = getCarDetails;
