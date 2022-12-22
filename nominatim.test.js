import {
  Geocoder,
  ofnBeProfile,
  nominatimGetDetails,
} from "@qalincalabs/limosa";

test("Limosa", async () => {
  const geocoder = new Geocoder(ofnBeProfile);

  const result = await geocoder.locate({
    address1: "Grand rue 40",
    address2: null, // TODO use later, not sure it is in use
    country_id: 29,
    country_name: "Belgium",
    zipcode: "6850",
    city: "Carlsbourg",
  });

  console.log(result);

  const runs = [];

  const firstRun = {
    query: {
      osmid: result.electedOsmElement.id,
      osmtype: result.electedOsmElement.type,
      addressdetails: 1,
      namedetails: 1,
      tagdetails: 1,
    },
  };

  firstRun.result = await nominatimGetDetails(firstRun.query);
  console.log(firstRun.result);
  runs.push(firstRun);

  const addressComponents = firstRun.result.address.filter(
    (a) => a.isaddress && ["house_number", "country"].includes(a.type) == false
  );

  for (const c of addressComponents) {
    const run = {
      query: {
        osmid: c.osm_id,
        osmtype: c.osm_type,
        namedetails: 1,
        tagdetails: 1,
      },
    };

    run.result = await nominatimGetDetails(run.query);
    console.log(run.result);

    runs.push(run);
  }

  const areas = [];

  
  for (const r of runs) {
    areas.push(mapOsmArea(r.result));
  }
  

  console.log(JSON.stringify(areas));


});

/*
test("Nominatim request OFN address", async () => {
  const address = addresses.nearBrussels;

  if (address.country_name == "Belgium")
    address.country_name = "België / Belgique / Belgien";

  const geocoder = createGeoCoder();

  // lowest request with address details
  // then request for each and go up

  const runs = [];

  const firstRun = {
    query: {
      osmid: 890827177,
      osmtype: "W",
      addressdetails: 1,
      namedetails: 1,
      tagdetails: 1,
    },
  };

  firstRun.result = await geocoder.makeNominatimDetailsRequest(firstRun.query);
  runs.push(firstRun);

  const addressComponents = firstRun.result.address.filter(
    (a) => a.isaddress && ["house_number", "country"].includes(a.type) == false
  );

  for (const c of addressComponents) {
    const run = {
      query: {
        osmid: c.osm_id,
        osmtype: c.osm_type,
        namedetails: 1,
        tagdetails: 1,
      },
    };

    run.result = await geocoder.makeNominatimDetailsRequest(run.query);

    runs.push(run);
  }

  const areas = [];

  for (const r of runs) {
    areas.push(mapOsmArea(r.result));
  }

  console.log(JSON.stringify(areas));

  //expect(1+2).toBe(3);
});
*/

// city is commune in Belgium
// county is arrondissement
// state is province

/*
export function progressiveIntersect(objects) {
  if (objects.length == 1) return objects[0].properties;

  const intersection = {};

  //console.log(JSON.stringify(objects));

  for (const k of PhotonProperties) {
    const values = objects
      .filter((o) => o.properties[k] != null)
      // PhotonProperties.indexOf(o.type) >= PhotonProperties.indexOf(k)
      .map((o) => o.properties[k]);

    if (values.length == 0) continue;

    //console.log(k);
    //console.log(values);

    if (values.every((v) => v == values[0])) {
      intersection[k] = values[0];
      //console.log(values[0])
    } else return intersection;
  }

  return intersection;
}

export function intersect(objects, keys) {
  const intersection = {};

  for (const k of keys) {
    const values = objects.map((o) => o[k]);
    if (values.every((v) => v === values[0])) intersection[k] = values[0];
  }

  return intersection;
}

const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("_");

function photonFeatureId(featureProperties, untilLayer) {
  const countryCode = featureProperties.countrycode.toLowerCase();
  let idComponents = ["photon", countryCode];

  if (untilLayer == "country") return ["iso", "country", countryCode].join("/");

  if (untilLayer == "postcode") {
    idComponents.push(featureProperties["postcode"]);
    return idComponents.join("/");
  }

  const layers = photonLayers.slice(1);

  for (const layer of layers) {
    if (featureProperties[layer] != null)
      idComponents.push(toSnakeCase(featureProperties[layer]));
    else break;

    if (layer == untilLayer) break;
  }

  return idComponents.join("/");
}

*/

/*
    const r = {
      road: consolidatedFeature.street,
    };

    //console.log(initialData);
    if (currentStrategy.approve.house(initialData, consolidatedFeature)) {
      r.houseNumber = consolidatedFeature.housenumber;
      const houseFeature = runs.find((r) => r.tactic.layers.includes("house"))
        .features[0];
      r.ids = ["osm/" + houseFeature.properties.osm_id];
      r.geo = houseFeature.geometry;
    }

    // set geometry if only 1 place found

    r.areas = [];

    for (const pa of photonAreas) {
      const propertyValue = consolidatedFeature[pa];
     // console.log(propertyValue);
      if (propertyValue != null) {
        let type = "photon_" + pa;

        let id = photonFeatureId(consolidatedFeature, pa);

        if (["road", "country"].includes(pa)) type = pa;

        // only for countries where postcode depends on country and not state
        if (pa == "postcode") {
          type = "postal_code";
          id = "be/postal_code/" + propertyValue;
        }

        r.areas.push({
          ids: [id],
          types: [type],
          name: propertyValue,
        });
      }
    }

    return r;

    */
