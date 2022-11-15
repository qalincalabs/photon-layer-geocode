import fetch from "node-fetch";
import * as mapper from "./offLogcicaMapper.js";

const defaultLocalisedTagProperties = [
  "additives",
  "allergens",
  "categories",
  "labels",
  "traces",
  "origins",
  "ingredients",
];

// open food fact connector
export class OffLogcicaConnector {
  constructor(config) {
    this.languages = config.languages
    this.apiProductUrl = "https://world.openfoodfacts.org/api/v0/product/"
  }

  async enrich(data) {

    const products = []

    for(const inputProduct of data.products){
      products.push(await this.enrichProduct(inputProduct.barcode))
    }

    data.products = products

    return data;
  }

  async enrichProduct(barcode){

    const requestUrl = this.apiProductUrl + barcode
  
    const request = await fetch(requestUrl);
    const response = await request.json();
    
    const fields = populateUrlFieldsForLocalisedTags(this.languages)
  
    const request1 = await fetch(requestUrl+"?fields="+fields.join(","));
    const response1 = await request1.json();
  
    let product = {...response.product, ...response1.product};

    console.log(product.ingredients)

    console.log(this.languages)
    const mappedProduct = mapper.mapProduct(product, {languages: this.languages})

    return mappedProduct
  }
}

function populateUrlFieldsForLocalisedTags(
  languages,
  tagProperties = defaultLocalisedTagProperties
) {
  const fields = [];

  for (const t of tagProperties) {
    for (const l of languages) {
      fields.push(t + "_tags_" + l);
    }
  }

  return fields;
}
