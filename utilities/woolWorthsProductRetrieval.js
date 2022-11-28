import scrapeIt from "scrape-it";
import mongoose from "mongoose";
import { getMongoDbConnection, ProductSchema } from "./mongoUtil";

let myProductSchema = ProductSchema;

const productSchema = mongoose.model("ProductSchema", myProductSchema);

async function getWoolWorthsProductList(
  pageUrl,
  foodCategory,
  productPriceClassTag,
  storeName
) {
  scrapeIt(pageUrl, {
    // Fetch the articles
    products: {
      listItem: ".product-list__list",
      data: {
        productName: {
          listItem: ".product-card__name",
        },

        productPrice: {
          listItem: ".price",
        },
      },
    },
  }).then(async ({ data, response }) => {
    let totalProductCount = 0;
    try {
      if (data.products[0].productName.length) {
        for (let i = 0; i < data.products[0].productName.length; ) {
          try {
            let priceOfProduct = data.products[0].productPrice[i];
            let singleProductInformation = {
              productName: data.products[0].productName[i],
              productPrice: priceOfProduct,
              productStore: storeName,
              productCategory: foodCategory,
            };
            const singleProduct = new productSchema(singleProductInformation);

            //get the list of all the saved sentences from mongodb
            let db = getMongoDbConnection();

            db.collection("productschemas")
              .find({
                productName: singleProductInformation.productName,
                productStore: storeName,
              })
              .toArray(function (err, result) {
                if (err) throw err;
                //Check if product exists, and then update or insert accordingly
                if (result.length >= 1) {
                  db.collection("productschemas").findOneAndUpdate(
                    { productName: singleProductInformation.productName },
                    {
                      $set: {
                        productPrice: singleProductInformation.productPrice,
                      },
                    },
                    // If `new` isn't true, `findOneAndUpdate()` will return the
                    // document as it was _before_ it was updated.
                    { new: true }
                  );
                } else {
                  singleProduct.save();
                }
              });
            i++;
            totalProductCount++;
          } catch (error) {
            i++;
            console.log(
              `Something went wrong with the following product ${data.products[0].productName[i]} from the following website ${pageUrl} with the following error ${error}`
            );
            continue;
          }
        }
        console.log(
          `Total products added ${totalProductCount}/${data.products[0].productName.length} for URL: ${pageUrl}`
        );
      }
    } catch (error) {
      console.log(
        `Something went wrong when fetching products for  ${pageUrl} error: ${error}`
      );
    }
  });
}

export { getWoolWorthsProductList };
