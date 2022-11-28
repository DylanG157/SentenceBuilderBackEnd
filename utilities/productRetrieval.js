import { getPnpProductList } from "./pnpProductRetrieval";
import { getWoolWorthsProductList } from "./woolWorthsProductRetrieval";
import { getMongoDbConnection } from "../utilities/mongoUtil";

//get the list of all the saved sentences from mongodb
async function getListOfAllProducts() {
  try {
    let pnpUrlList = [];
    let db = getMongoDbConnection();

    //Fetch the list of PNP URL's and update/insert products to MongoDB
    // await db
    //   .collection("productUrlList")
    //   .find({ store: "PNP", disabledFlag: "N" })
    //   .toArray(function (err, result) {
    //     if (err) throw err;
    //     pnpUrlList = result;
    //     console.log(`Trying to get a list of all PNP products`);
    //     pnpUrlList.forEach(function (productConfig) {
    //       getPnpProductList(
    //         productConfig.urlLink,
    //         productConfig.category,
    //         productConfig.productPriceClassTag,
    //         productConfig.store
    //       );
    //     });
    //   });

    //Fetch the list of PNP URL's and update/insert products to MongoDB
    await db
      .collection("productUrlList")
      .find({ store: "WW", disabledFlag: "N" })
      .toArray(function (err, result) {
        if (err) throw err;
        pnpUrlList = result;
        console.log(`Trying to get a list of all Woolworths products`);
        pnpUrlList.forEach(function (productConfig) {
          getWoolWorthsProductList(
            productConfig.urlLink,
            productConfig.category,
            productConfig.productPriceClassTag,
            productConfig.store
          );
        });
      });
  } catch (error) {
    console.log(error);
  }
}

export { getListOfAllProducts };
