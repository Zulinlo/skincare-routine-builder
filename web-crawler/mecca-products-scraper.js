import cheerio from "cheerio";
import puppeteer from "puppeteer";
import fetch from "node-fetch";
import request from "request";

const postProduct = (product) => {
  request.post(
    "http://localhost:8080/api/products",
    { json: product },
    function (error, response, body) {
      if (!error && response.statusCode == 200) console.log(body);
    }
  );
};

const scrapePuppeteerPage = async (url) => {
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    const html = await page.goto(url).then(function () {
      return page.content();
    });

    const $ = cheerio.load(html);
    let product = {
      name: $(".css-1moqnpm-paragraph-sansSerif-productName").text(),
      step: $(
        ".css-1ahamxc-breadcrumbsList-isVisibleDesktop",
        ".css-vm1788-pdpContent"
      )
        .find("li:nth-child(4)")
        .text(),
      averageReview: $("span.bv-secondary-rating-summary-rating.bv-table-cell")
        .text()
        .trim(),
      brand: $(".css-90xbdv-size5-sansSerif-brandNameLink").text(),
      price: $(".css-13xg4bi-paragraph-sansSerif-currentPriceLabel").text(),
      directions: $(".css-nx22v4.accordion-content").text(),
      description: $(
        ".css-bcastm-paragraph-sansSerif-accordionInnerContent.accordion-inner-content"
      ).text(),
      volume: $(".css-13wac61-xSmall-sansSerif-small-sansSerif-sizeLabel")
        .text()
        .split("\n"),
      ingredients: $(
        ".css-bcastm-paragraph-sansSerif-accordionInnerContent.accordion-inner-content"
      )
        .text()
        .split("\n")[0]
        .split(" , "),
      skinType: $(
        ".bv-content-data-value",
        ".bv-content-data-product-questions"
      ).text(),
    };

    let numberOfReviews = 0;
    $(".bv-inline-histogram-ratings-score").each(function () {
      numberOfReviews += parseInt($(this).find("span:first").text());
    });

    product["numberOfReviews"] = numberOfReviews;

    postProduct(product);

    await page.close();
    await browser.close();
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

  const productLinks = [];
  $(".grid-product-info", ".shop-grid").each(function () {
    productLinks.push($(this).find("a").attr("href"));
  });

  // scrape each product
  // TODO: use puppeteer cluster to run using multiple puppeteer instances
  for (let url of productLinks) {
    await scrapePuppeteerPage(url);
  }
} catch (err) {
  console.log(err);
  process.exit(1);
}
