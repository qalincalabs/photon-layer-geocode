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

export const PhotonProperties = [
  "country",
  "countrycode",
  "state",
  "county",
  "city",
  "district",
  "locality",
  "postcode",
  "street",
  "housenumber",
]

const photonAreas = [
  "country",
  "state",
  "county",
  "city",
  "district",
  "locality",
  "postcode",
];

// city is commune in Belgium
// county is arrondissement
// state is province

export function intersect(objects, keys) {

  const intersection = {}

  for(const k of keys){
    const values = objects.map(o => o[k])
    if(values.every(v => v === values[0]))
      intersection[k] = values[0]
  }

  return intersection

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

// give services (their url), mapping configurations
export class PhotonLayerGeocoder {
  constructor(serviceConfig, profile) {
    this.photonUrl = serviceConfig.photon.url;
    this.profile = profile;
  }

  async makePhotonRequest(requestAddressComponents, config) {

    const searchParams = new URLSearchParams({
      q: requestAddressComponents.join(", "),
    })

    if(config?.layers != null){
      config.layers.forEach(l => searchParams.append("layer", l))
    }

    const requestUrl = this.photonUrl + "/?" + searchParams.toString();
  
    const request = await fetch(requestUrl);
    const response = await request.json();
    return response;
  }

  // for each keep intersection and list, make decision based on that

  async geocode(data) {


    // TODO handle multiple strategies
    // apply strategy
    data = this.profile.strategies[0].transform(data)


    const runs = []

    // TODO get strategy tactics
    for(const tactic of this.profile.tactics){
      console.log(data)
      const response = await this.makePhotonRequest(
        tactic.getSearchComponents(data),
        {
          layers: tactic.layers
        }
      );

      runs.push({
        tactic: tactic,
        features: response.features
      })

      console.log(JSON.stringify(response,null, 2));
    }

    const feature = runs.find(r => r.tactic.key == "ofn-be-house").features[0];
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
}
