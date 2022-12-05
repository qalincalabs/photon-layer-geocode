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

// city is commune in Belgium
// county is arrondissement
// state is province

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


export async function get(url, urlSearchParams){
  const requestUrl = url + "?" + urlSearchParams.toString();
  const request = await fetch(requestUrl);
  const response = await request.json();
  return response;
}

// give services (their url), mapping configurations
export class PhotonLayerGeocoder {
  constructor(serviceConfig, profile) {
    this.photonUrl = serviceConfig.photon.url;
    this.nominatimUrl = serviceConfig.nominatim.url;
    this.profile = profile;
  }

  async makePhotonRequest(requestAddressComponents, config) {
    const searchParams = new URLSearchParams({
      q: requestAddressComponents.join(", "),
    });

    if (config?.layers != null) {
      config.layers.forEach((l) => searchParams.append("layer", l));
    }

    if (config?.limit != null) searchParams.append("limit", config.limit);

    return await get(this.photonUrl, searchParams)
  }

  async makeNominatimDetailsRequest(q) {
    q.format = "json"
    return await get(this.nominatimUrl + "/details", new URLSearchParams(q))
  }

  // for each keep intersection and list, make decision based on that

  async geocode(initialData) {
    // TODO handle multiple strategies
    // apply strategy

    const currentStrategy = this.profile.strategies[0];

    initialData = currentStrategy.transform(initialData);

    const runs = [];

    // TODO get strategy tactics
    for (const tactic of this.profile.tactics) {

      const searchComponents = tactic.getSearchComponents(initialData)
      console.log(searchComponents)
      
      const response = await this.makePhotonRequest(
        searchComponents,
        {
          layers: tactic.layers,
          limit: tactic.limit,
        }
      );

      const features = response.features.map((f) => {
        if (f.properties.type == "house") return f;

        f.properties[f.properties.type] = f.properties.name;

        return f;
      });

      runs.push({
        tactic: tactic,
        features: features,
      });

      //console.log(JSON.stringify(response, null, 2));
    }


    const properties = ["countrycode","state","county","city","district","postcode","street","housenumber"]

    const matrix = []

    for(const r of runs){
      for(const f of r.features){
        for(const p of properties){
          console.log(f)
          if(f.properties[p] != null)
            matrix.push({
              key: r.tactic.key,
              property: p,
              value: f.properties[p],
              uuid: f.properties.osm_type.toLowerCase() + "-" + f.properties.osm_id
            })
        }
      }
    }

    const result = {}

    for(const p of properties){
       
      result[p] = mode(matrix.filter(m => m.property == p).map(m => m.value))
      // unique
      // most popular
      // 
    }

    let groupedMatrix = []

    for(const m of matrix){
      const e = groupedMatrix.find(g => g.value == m.value && g.property == m.property)
      if(e == null){
        groupedMatrix.push({
          value: m.value,
          property: m.property,
          keys: [m.key],
          uuids: [m.uuid]
        })
      }else{
        e.keys.push(m.key),
        e.uuids.push(m.uuid)
      }
    }

    groupedMatrix = groupedMatrix.sort((a,b) => a.keys.length > b.keys.length)

    const result1 = {}
    const exactMatch = {}
    const closestMatch = {}
    const previousMatch = []

    for(const p of properties){

      const myTactics = this.profile.tactics
        .filter(t => t.properties.includes(p))
        .map(t => t.key)
      console.log(myTactics)
      console.log(p)

      const bestMatches = groupedMatrix
        .filter(g => g.property == p && myTactics.every(t => g.keys.includes(t)))

      let bestMatch = null

      console.log(bestMatches)
      for(const best of bestMatches){
        if(previousMatch.every(p => 
          groupedMatrix.find(g => g.property == p.property & g.value == p.value && g.uuids.some(u => best.uuids.includes(u)))!= null)){
            bestMatch = best
            break;
          }
      }

      if(bestMatch == null && bestMatches.length > 0){
        const closest = bestMatches[0]
        closestMatch[p] = closest.value
      }
      
      if(bestMatch != null){
        exactMatch[p] = bestMatch.value
        closestMatch[p] = bestMatch.value
        previousMatch.push(bestMatch)
      }
    }

    console.log(exactMatch)
    console.log(closestMatch)
   // console.log(previousMatch)

    /*
    const wantedFeatures = runs
      .filter((r) => r.features.length == 1)
      .map((r) => r.features[0]);
    */

    //console.log(JSON.stringify(runs, null, 2))

    const wantedFeatures = runs.map(r => r.features).flat()

    //console.log("Wanted");
    //console.log(wantedFeatures);
    const consolidatedFeature = progressiveIntersect(wantedFeatures);
    //console.log(consolidatedFeature);

    // On passe à travers toutes les localités et on écrême jusqu'à trouver ce qui 
    // nous laisse un résultat dans les autres

    // Idem pour street

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
  }
}

function mode(arr){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}
