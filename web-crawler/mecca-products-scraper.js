import cheerio from "cheerio";
import puppeteer from "puppeteer";
import fetch from "node-fetch";
import request from "request";
import fs from "fs";
import mongoose from "mongoose";

const postProduct = (product) => {
  request.post(
    "http://localhost:8080/api/products",
    { json: product },
    function (error, response, body) {
      if (!error && response.statusCode == 200) console.log(body);
    }
  );
};

const scrapePuppeteerPage = async (url, urlNo) => {
  try {
    let browser = await puppeteer.launch();

    let page = await browser.newPage();
    let html = await page.goto(url).then(function () {
      return page.content();
    });

    let $ = cheerio.load(html);
    const productLinks = [];
    $(".grid-product-info", ".shop-grid").each(function () {
      productLinks.push($(this).find("a").attr("href"));
    });

    await page.close();
    await browser.close();

    for (let url of productLinks) {
      let browser = await puppeteer.launch();
      let page = await browser.newPage();
      let html = await page.goto(url).then(function () {
        return page.content();
      });

      let $ = cheerio.load(html);
      let product = {
        name: $(".css-1moqnpm-paragraph-sansSerif-productName").text(),
        brand: $(".css-90xbdv-size5-sansSerif-brandNameLink").text(),
        price: parseInt(
          $(".css-13xg4bi-paragraph-sansSerif-currentPriceLabel")
            .text()
            .slice(1)
        ),
        volume: $(".css-13wac61-xSmall-sansSerif-small-sansSerif-sizeLabel")
          .text()
          .split(": ")[1],
        skinType:
          $(".bv-content-data-value", ".bv-content-data-product-questions")
            .first()
            .text()
            .toLowerCase() || "normal",
        averageReview: parseInt(
          $("span.bv-secondary-rating-summary-rating.bv-table-cell")
            .text()
            .trim()
        ),
      };

      let step = $(
        ".css-1ahamxc-breadcrumbsList-isVisibleDesktop",
        ".css-vm1788-pdpContent"
      )
        .find("li:nth-child(4)")
        .text();

      let newStep = "";
      if (urlNo === 0) {
        newStep = "oilCleanser";
      } else if (urlNo === 1) {
        newStep = "eyeTreatment";
      } else {
        switch (step) {
          case "Cleanser":
            newStep = "cleanser";
            break;

          case "Peels":
          case "Scrubs & Exfoliators":
            newStep = "exfoliant";
            break;

          case "Toner":
            newStep = "toner";
            break;

          case "Oils & Serums":
            newStep = "serumEssence";
            break;

          case "Tinted Moisturiser":
          case "Moisturiser":
            newStep = "moisturiser";
            break;

          case "Sunscreen for Face":
            newStep = "sunscreen";
            break;

          case "Masks":
            newStep = "mask";
            break;
        }
      }
      product["step"] = newStep;

      let numberOfReviews = 0;
      $(".bv-inline-histogram-ratings-score").each(function () {
        numberOfReviews += parseInt($(this).find("span:first").text());
      });
      product["numberOfReviews"] = numberOfReviews;

      let description = $(
        ".css-bcastm-paragraph-sansSerif-accordionInnerContent.accordion-inner-content",
        ".css-1wkju8h-productInfoContainer"
      )
        .eq(1)
        .text()
        .trim()
        .slice(15);
      product["description"] = description;

      let directions = $(
        ".css-bcastm-paragraph-sansSerif-accordionInnerContent.accordion-inner-content",
        ".css-1wkju8h-productInfoContainer"
      )
        .eq(2)
        .text()
        .trim();
      product["directions"] = directions;

      let ingredients = $(
        ".css-bcastm-paragraph-sansSerif-accordionInnerContent.accordion-inner-content",
        ".css-1wkju8h-productInfoContainer"
      )
        .eq(3)
        .text()
        .trim();
      product["ingredients"] = ingredients.split(", ");

      const imgUrl = $(".css-1bb0vqw-mainImagePreviewWrapper")
        .find("img")
        .attr("src");

      const imgPath = mongoose.Types.ObjectId() + ".jpg";

      request
        .get(imgUrl)
        .on("error", function (err) {
          console.log(err);
        })
        .on("response", function (response) {
          if (response.statusCode === 200) {
            console.log("Successfully retrieved image.");
          }
        })
        .pipe(
          fs.createWriteStream(
            "../client/src/resources/productImages/" + imgPath
          )
        );

      product["imagePath"] = imgPath;

      postProduct(product);

      await page.close();
      await browser.close();
    }
  } catch (error) {
    console.log(error);
  }
};

try {
  // get all links for each product on the page
  const res = await fetch(
    "https://www.mecca.com.au/skin-care/?start=0&sz=1973"
  );

  let $ = cheerio.load(await res.text());

  const pageLinks = [
    "https://www.mecca.com.au/skin-care/cleansers/oil-balm-cleansers/?start=0&sz=43", // oilCleanser
    "https://www.mecca.com.au/skin-care/eye-care/?start=0&sz=159", // eyeTreatment
    "https://www.mecca.com.au/skin-care/cleansers/?start=0&sz=254", // cleanser
    "https://www.mecca.com.au/skin-care/facial-toners/?start=0&sz=118", // toner
    "https://www.mecca.com.au/skin-care/exfoliators-peels/?start=0&sz=92", // exfoliant
    "https://www.mecca.com.au/skin-care/serums-essences/?start=0&sz=183", // serums and essences
    "https://www.mecca.com.au/skin-care/moisturisers-oils/moisturiser/?start=0&sz=333", // moisturiser
    "https://www.mecca.com.au/skin-care/facial-masks/?start=0&sz=241", // masks
    "https://www.mecca.com.au/skin-care/facial-sunscreen/", // sunscreen
  ];

  // scrape each product
  // TODO: use puppeteer cluster to run using multiple puppeteer instances
  for (let i = 0; i < pageLinks.length; i++) {
    let url = pageLinks[i];
    await scrapePuppeteerPage(url, i);
  }
} catch (err) {
  console.log(err);
  process.exit(1);
}
