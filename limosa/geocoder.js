import fetch from "node-fetch";
import levenshtein from "js-levenshtein";
import * as fuzz from "fuzzball";

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

export async function get(url, urlSearchParams) {
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

    return await get(this.photonUrl, searchParams);
  }

  async makeNominatimDetailsRequest(q) {
    q.format = "json";
    return await get(this.nominatimUrl + "/details", new URLSearchParams(q));
  }

  // for each keep intersection and list, make decision based on that

  async geocode(input) {
    // TODO handle multiple strategies
    // apply strategy

    const properties = this.profile.properties;
    const selectedStrategy = this.profile.selectStrategy(input);

    const currentStrategy = this.profile.strategies.find(
      (s) => s.key == selectedStrategy
    );

    if (currentStrategy.preTransform) currentStrategy.preTransform(input);

    const currentTactics = currentStrategy.tactics.map(t1 => this.profile.tactics.find(t2 => t2.key == t1))

    for (const t of currentTactics) {
      t.properties = properties.slice(
        0,
        properties.indexOf(t.untilProperty) + 1
      );
    }

    const runs = await this.makeAndExecuteRuns(input,currentTactics);
    const matrix = this.getPropertyValues(runs, input);
    let groupedMatrix = this.getGroupedPropertyValues(matrix, currentTactics.map(t => t.key));
    console.log(groupedMatrix)


    const exactMatch = {};
    const previousMatch = [];

    for (const p of properties) {
      const myTactics = currentTactics
        .filter((t) => t.properties.includes(p))
        // skip tactics where run didn't give any result ...
        .filter((t) => runs.find(r => r.features?.length == 0 && r.tactic.key == t) == false)
        .map((t) => t.key);

      const bestMatches = groupedMatrix.filter(
        (g) => g.property == p && myTactics.every((t) => g.keys.includes(t))
      );

      //console.log(p)
      //console.log(previousMatch)
      //console.log(groupedMatrix)

      let bestMatch = null;

      console.log(bestMatches)

      for (const best of bestMatches) {

        if (
          previousMatch.every((p) => best.uuids.some(u => p.uuids.includes(u)))
        ) {

          bestMatch = best;
          //console.log(best.value)
          break;
        }
      }

      /*
      if (bestMatch == null && bestMatches.length > 0) {
        const closest = bestMatches[0];
        closestMatch[p] = closest.value;
      }
      */

      console.log(p)
      console.log(bestMatch)

      if (bestMatch != null) {
        exactMatch[p] = bestMatch.value;
        //closestMatch[p] = bestMatch.value;
        previousMatch.push(bestMatch);
      }
      
    }

    /*
    if (currentStrategy.postTransform)
      currentStrategy.postTransform(input, exactMatch, closestMatch);
    */

    console.log(exactMatch);
    //console.log(closestMatch);
    //console.log(previousMatch)

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
  }

  async makeAndExecuteRuns(initialData, currentTactics) {
    const runs = [];

    // TODO get strategy tactics
    for (const tactic of currentTactics) {
      const searchComponents = tactic.searchQuery(initialData);

      const response = await this.makePhotonRequest(searchComponents, {
        layers: tactic.layers,
        limit: tactic.limit,
      });

      const features = response.features.map((f) => {
        if (f.properties.type == "house") return f;
        f.properties[f.properties.type] = f.properties.name;
        return f;
      });

      if (tactic.postTransform) tactic.postTransform(initialData, features);

      runs.push({
        tactic: tactic,
        features: features,
      });

      //console.log(JSON.stringify(response, null, 2));
    }
    return runs;
  }

  getGroupedPropertyValues(matrix, tactics) {
    let groupedMatrix = [];
    const sortedMatrix = matrix.sort((a,b) => tactics.indexOf(b.key) - tactics.indexOf(a.key))

    for (const m of sortedMatrix) {
      const e = groupedMatrix.find(
        (g) => g.value == m.value && g.property == m.property
      );
      if (e == null) {
        groupedMatrix.push({
          value: m.value,
          property: m.property,
          keys: [m.key],
          uuids: [m.uuid],
        });
      } else {
        e.keys.push(m.key)
        e.uuids.push(m.uuid)
      }
    }

    groupedMatrix.forEach(g => g.uniqueKeys = [...new Set(g.keys)])

    const group = groupedMatrix.sort((a, b) => {
        if(a.uniqueKeys.length == b.uniqueKeys.length){
            // prefer values obtained more precise layers
            // TODO be recursive
            if(a.keys == b.keys && a.uniqueKeys > 1 && b.uniqueKeys > 1)
              return tactics.indexOf(b.uniqueKeys[1]) - tactics.indexOf(a.uniqueKeys[1])
            return tactics.indexOf(b.uniqueKeys[0]) - tactics.indexOf(a.uniqueKeys[0])
        }
        return b.uniqueKeys.length - a.uniqueKeys.length
    });

    console.log(group)

    return group
  }

  getPropertyValues(runs, input) {
    const matrix = [];
    const threshold = 80; // should remove house number

    for (const r of runs) {
      let atLeastOne = false
      console.log(r.features.length)
      for (const f of r.features) {
        
        if(r.tactic.validateAgainst != null){
          const against = r.tactic.validateAgainst(input)

          const scores = f.properties.name.split(" - ").map(v => fuzz.ratio(v,against))
          const score = Math.max.apply(null, scores)
          console.log(against)
          console.log(score)
          if(score < threshold) continue
        }

        atLeastOne = true

        for (const p of r.tactic.properties) {
          if (f.properties[p] != null)
            matrix.push({
              key: r.tactic.key,
              property: p,
              value: f.properties[p],
              uuid:
                f.properties.osm_type.toLowerCase() + "-" + f.properties.osm_id,
            });
        }
      }

      if(atLeastOne == false)
        break

    }
    return matrix;
  }
}
