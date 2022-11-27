import { getPnpProductList } from "./pnpProductRetrieval";
import { getMongoDbConnection } from "../utilities/mongoUtil";

//get the list of all the saved sentences from mongodb
async function getListOfAllProducts() {
  try {
    let pnpUrlList = [];
    let db = getMongoDbConnection();

    //Fetch the list of PNP URL's and update/insert products to MongoDB
    await db
      .collection("productUrlList")
      .find({ store: "PNP" })
      .toArray(function (err, result) {
        if (err) throw err;
        pnpUrlList = result;
        console.log(`Trying to get a list of all products`);
        pnpUrlList.forEach(function (url) {
          getPnpProductList(url.urlLink, url.category);
        });
      });
  } catch (error) {
    console.log(error);
  }
}

export { getListOfAllProducts };
