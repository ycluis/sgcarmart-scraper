const getCarContent = ($) => {
  return {
    getName: () => $("div#toMap").text().trim(),

    getPrice: () =>
      $(
        "tr.row_bg:nth-child(1) > td:nth-child(2) > a:nth-child(1) > strong:nth-child(1)",
      )
        .text()
        .trim()
        .replace(",", ""),

    getDepre: () =>
      $("#carInfo > tbody > tr:nth-child(2) > td:nth-child(2)")
        .text()
        .trim()
        .replace(",", "")
        .replace(/\/yr.*/, "/yr"),

    getCoe: () =>
      $(
        "#carInfo > tbody > tr:nth-child(3) > td:nth-child(1) > div:nth-child(4) > div.row_info",
      )
        .text()
        .trim()
        .replace(",", ""),

    getRegDate: () =>
      $("#carInfo > tbody > tr:nth-child(2) > td:nth-child(4)").text().trim(),

    getMileage: () =>
      $(
        "#carInfo > tbody > tr:nth-child(3) > td:nth-child(1) > div:nth-child(1) > div.row_info",
      )
        .text()
        .trim()
        .replace(",", ""),

    getOwners: () =>
      $(
        "#carInfo > tbody > tr:nth-child(3) > td:nth-child(2) > div:nth-child(7) > div.row_info",
      )
        .text()
        .trim(),
  };
};

module.exports = getCarContent;
