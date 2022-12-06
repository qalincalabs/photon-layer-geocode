import levenshtein from "js-levenshtein";
import * as fuzz from "fuzzball";

test("A json test", async () => {
  const translations = {
    en: {
        iso: {
            countries: {
                be: {
                    name: "Belgique"
                }
            }
        }
    }
  }

  console.log(deepGet(translations,"en.iso.countries.be.name"))
})

test("A json test",  () => {
  
    // separate on (-)
    // 
    // si un seul espace-espace faire un fuzz sur les deux

   console.log(levenshtein("Avenue Franklin Roosevelt","Franklin Rooseveltlaan"))
   console.log(fuzz.ratio("Avenue Franklin Roosevelt 50", "Avenue Franklin Roosevelt"))
   console.log(fuzz.ratio("test", "test"))
   console.log(levenshtein("Avenue des bons légumes","Avenue des Grenadiers"))
   console.log(fuzz.ratio("Avenue des bons légumes", "Avenue des abeilles"))

   // 85% de bon
})

export function deepGet(obj, query, defaultVal) {
    query = Array.isArray(query) ? query : query.replace(/(\[(\d)\])/g, '.$2').replace(/^\./, '').split('.');
    if (!(query[0] in obj)) {
      return defaultVal;
    }
    obj = obj[query[0]];
    if (obj && query.length > 1) {
      return deepGet(obj, query.slice(1), defaultVal);
    }
    return obj;
  }