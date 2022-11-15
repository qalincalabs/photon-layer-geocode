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