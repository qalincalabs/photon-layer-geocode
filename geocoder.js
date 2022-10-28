import fetch from "node-fetch";

const photonLayers = [
  "country",
  "state",
  "county",
  "city",
  "district",
  "locality",
  "street",
  "house",
];

const photonAreas = [
  "country",
  "state",
  "county",
  "city",
  "district",
  "locality",
  "postcode",
];

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

// give services (their url), mapping configurations
export class PhotonLayerGeocoder {
  constructor(serviceConfig, mappingConfig) {
    this.photonUrl = serviceConfig.photon.url;
    this.getAddressComponents = mappingConfig.getAddressComponents;
  }

  async geocode(data) {
    const requestAddressComponents = this.getAddressComponents(data);

    console.log(requestAddressComponents);

    const response = await this.makePhotonRequest(requestAddressComponents);

    const feature = response.features[0]
    const placeFeatureProperties = feature.properties;

    console.log(placeFeatureProperties);

    const r = {
      ids: ["osm/" + placeFeatureProperties.osm_id],
      houseNumber: placeFeatureProperties.housenumber,
      road: placeFeatureProperties.street,
      geo: feature.geometry, // TODO do I rename geometry
      areas: [],
    };

    for (const pa of photonAreas) {
      const propertyValue = placeFeatureProperties[pa];
      if (propertyValue != null) {
        let type = "photon_" + pa;

        const id = photonFeatureId(placeFeatureProperties, pa);

        if (["road", "country"].includes(pa)) type = pa;

        // only for countries where postcode depends on country and not state
        if (pa == "postcode") {
          type = "postal_code";
        }

        r.areas.push({
          ids: [id],
          types: [type],
          name: propertyValue,
        });
      }
    }

    return r;
  }

  async makePhotonRequest(requestAddressComponents) {
    const requestUrl = this.photonUrl +
      "/?" +
      new URLSearchParams({
        q: requestAddressComponents.join(", "),
      });

    const request = await fetch(requestUrl);
    const response = await request.json();
    return response;
  }
}
