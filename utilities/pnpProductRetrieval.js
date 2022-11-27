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

async function getPnpProductList(pageUrl, foodCategory) {
  scrapeIt(pageUrl, {
    // Fetch the articles
    products: {
      listItem: ".product-grid",
      data: {
        productName: {
          listItem: ".item-name",
        },

        productPrice: {
          listItem: ".currentPrice  ",
        },
      },
    },
  }).then(async ({ data, response }) => {
    let totalProductCount = 0;
    try {
      if (data.products[0].productName.length) {
        for (let i = 0; i < data.products[0].productName.length; ) {
          let stringLength = data.products[0].productPrice[i].length;

          let productPriceFormated = formatPricing(
            data.products[0].productPrice[i]
          );

          let singleProductInformation = {
            productName: data.products[0].productName[i],
            productPrice: productPriceFormated,
            productStore: "PNP",
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
        }
        console.log(
          `Total products added ${totalProductCount} for URL: ${pageUrl}`
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
  let stringLength = productsPrice.length;
  let formatedPrice =
    productsPrice.substring(0, stringLength - 2) +
    "," +
    productsPrice.substring(stringLength - 2);
  return formatedPrice;
}

export { getPnpProductList };
