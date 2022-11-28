import scrapeIt from "scrape-it";
import mongoose from "mongoose";
import { getMongoDbConnection } from "./mongoUtil";

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productStore: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
});

const productSchema = mongoose.model("ProductSchema", ProductSchema);

async function getPnpProductList(
  pageUrl,
  foodCategory,
  productPriceClassTag,
  storeName
) {
  scrapeIt(pageUrl, {
    // Fetch the articles
    products: {
      listItem: ".product-grid",
      data: {
        productName: {
          listItem: ".item-name",
        },

        productPrice: {
          listItem: `.product-price`,
        },
      },
    },
  }).then(async ({ data, response }) => {
    let totalProductCount = 0;
    try {
      if (data.products[0].productName.length) {
        for (let i = 0; i < data.products[0].productName.length; ) {
          try {
            let productPriceFormated = formatPricing(
              data.products[0].productPrice[i]
            );

            let singleProductInformation = {
              productName: data.products[0].productName[i],
              productPrice: productPriceFormated,
              productStore: storeName,
              productCategory: foodCategory,
            };
            const singleProduct = new productSchema(singleProductInformation);

            //get the list of all the saved sentences from mongodb
            let db = getMongoDbConnection();

            db.collection("productschemas")
              .find({ productName: singleProductInformation.productName })
              .toArray(function (err, result) {
                if (err) throw err;
                //Check if product exists, and then update or insert accordingly
                if (result.length >= 1) {
                  db.collection("productschemas").findOneAndUpdate(
                    { productName: singleProductInformation.productName },
                    { $set: { productPrice: productPriceFormated } },
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
              `Something went wrong with the following product ${data.products[0].productName[i]} from the following website ${pageUrl} using the htmlClass: ${productPriceClassTag} with the following error ${error}`
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

function formatPricing(productsPrice) {
  //Gettting rid of the white space
  let trimmedPrice = productsPrice.split(" ")[0].trim();
  //If there are two prices, grab the first one
  if (trimmedPrice.split("R").length - 1 > 1) {
    trimmedPrice = trimmedPrice.slice(0, trimmedPrice.lastIndexOf("R")).trim();
  }
  let stringLength = trimmedPrice.length;
  let formatedPrice =
    trimmedPrice.substring(0, stringLength - 2) +
    "," +
    trimmedPrice.substring(stringLength - 2);
  return formatedPrice;
}

export { getPnpProductList };
