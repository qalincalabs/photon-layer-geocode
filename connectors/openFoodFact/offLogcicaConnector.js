import fetch from "node-fetch";
import * as mapper from "./offLogcicaMapper.js";

const defaultLocalisedTagProperties = [
  /*
  "additives",
  "allergens",
  "categories",
  "labels",
  "traces",
  "origins",
  "ingredients",
  */
  "additives",
  "allergens",
  "categories",
  "labels",
  "traces",
  "origins",
  "countries",
  "vitamins",
  "brands",
  "manufacturing_places",
  "purchase_places",
  "stores",
  "states",
  "ingredients",

];

// open food fact connector
export class OffLogcicaConnector {
  constructor(config) {
    this.languages = config.languages
    this.apiProductUrl = "https://world.openfoodfacts.org/api/v2/product/"
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
    console.log(requestUrl)
  
    const request = await fetch(requestUrl);
    const response = await request.json();
    
    const fields = populateUrlFieldsForLocalisedTags(this.languages)
  
    const secondRequestUrl = requestUrl+"?fields="+fields.join(",")
    console.log(secondRequestUrl)
    const request1 = await fetch(secondRequestUrl);
    const response1 = await request1.json();
  
    let product = {...response.product, ...response1.product};

    const mappedProduct = mapper.mapProduct(product, {languages: this.languages})

    // TODO use v3 to get all packaging localised properties (one request per language)

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
