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
  
   console.log(fuzz.ratio("Grand rue", "Grand rue 60A"))
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