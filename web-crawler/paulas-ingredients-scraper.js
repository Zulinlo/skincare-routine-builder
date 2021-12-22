import cheerio from "cheerio";
import fetch from "node-fetch";
import request from "request";

const postIngredient = (ingredient) => {
  request.post(
    "http://localhost:8080/api/ingredients",
    { json: ingredient },
    function (error, response, body) {
      if (!error && response.statusCode == 200) console.log(body);
    }
  );
};

try {
  const res = await fetch(
    "https://www.paulaschoice.com.au/ingredient-dictionary"
  );

  const $ = cheerio.load(await res.text());
  const data = $(".ingredient-result", ".base")
    .text()
    .split("\n")
    .filter((v) => v.trim() != "");

  const ratings = ["poor", "average", "good", "best"];
  let entry = {};
  let categories = [];
  let categoryFlag = false;
  for (let i = 0; i < data.length; i++) {
    if (ratings.includes(data[i].toLowerCase())) {
      entry["purpose"] = categories;
      postIngredient(entry);
      console.log(entry);

      categoryFlag = false;
      entry = {};
      categories = [];
      entry = { rating: ratings.indexOf(data[i].toLowerCase()) };
    } else if (data[i] === "Categories:") {
      categoryFlag = true;
    } else if (categoryFlag) {
      categories.push(data[i]);
    } else if (Object.keys(entry).length === 1) {
      entry["name"] = data[i];
    } else if (Object.keys(entry).length === 2) {
      entry["description"] = data[i];
    }
  }
  postIngredient(entry);
} catch (err) {
  console.log(err);
  process.exit(1);
}
