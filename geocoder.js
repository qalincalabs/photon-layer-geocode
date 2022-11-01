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

  console.log(JSON.stringify(objects));

  for (const k of PhotonProperties) {
    const values = objects
      .filter((o) => o.properties[k] != null)
      // PhotonProperties.indexOf(o.type) >= PhotonProperties.indexOf(k)
      .map((o) => o.properties[k]);

    if (values.length == 0) continue;

    console.log(k);
    console.log(values);

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

export function mapOsmArea(osmArea) {
  const languages = ["en", "fr", "nl", "de", "vls", "wa"];
  const areaTypes = ["region", "province", "village", "town", "neighbourhood"];

  const area = {
    ids: ["osm/" + osmArea.osm_type + "/"+ osmArea.osm_id, 
      "osm/place/"+ osmArea.place_id],
    name: osmArea.localname
  };

  const types = [];

  if (osmArea.admin_level == 8) {
    types.push("municipality");
    if (osmArea.addresstags?.postcode != null)
      area.ids.push("be/postal_code/" + osmArea.addresstags.postcode);
  }
  if (osmArea.admin_level == 7) types.push("district");
  if (osmArea.admin_level == 4) types.push("region");
  if (osmArea.admin_level == 2) types.push("country");

  if (areaTypes.includes(osmArea.extratags?.linked_place) && types.length == 0)
    types.push(osmArea.extratags.linked_place);

  if (areaTypes.includes(osmArea.type) && types.length == 0)
    types.push(osmArea.type);

  if(types.length > 0)
    area.types = types;

  if (osmArea.names != null) {
    for (const lang of languages) {
      if ("name:" + lang in osmArea.names){
        if(area.translations == null)
          area.translations = {}
        area.translations[lang] = osmArea.names["name:" + lang];
      }
    }

    if ("ISO3166-2" in osmArea.names)
      area.ids.push("iso/subdivisions/" + osmArea.names["ISO3166-2"]);
  }

  if (osmArea.extratags != null) {
    if ("ref:INS" in osmArea.extratags)
      area.ids.push("be/ins/" + osmArea.extratags["ref:INS"]);
    if ("ref:nuts:1" in osmArea.extratags)
      area.ids.push("nuts/1/" + osmArea.extratags["ref:nuts:1"]);
    if ("ref:nuts:2" in osmArea.extratags)
      area.ids.push("nuts/2/" + osmArea.extratags["ref:nuts:2"]);
    if ("ref:nuts:3" in osmArea.extratags)
      area.ids.push("nuts/3/" + osmArea.extratags["ref:nuts:3"]);

    if ("ISO3166-1:alpha2" in osmArea.extratags)
      area.ids.push("iso/countries/" + osmArea.extratags["ISO3166-1:alpha2"]);
    if ("ISO3166-1:alpha3" in osmArea.extratags)
      area.ids.push(
        "iso/countries/alpha3/" + osmArea.extratags["ISO3166-1:alpha3"]
      );
    if ("ISO3166-1:numeric" in osmArea.extratags)
      area.ids.push(
        "iso/countries/numeric/" + osmArea.extratags["ISO3166-1:numeric"]
      );
    if ("country_code_fips" in osmArea.extratags)
      area.ids.push("fips/countries/" + osmArea.extratags["country_code_fips"]);
  }

  area.ids = area.ids.map((i) => i.toLowerCase());
  return area;
}

function nominatimAreasFromPlaceDetails(nominatimPlaceDetails) {
  return nominatimPlaceDetails.address
    .filter(
      (oa) =>
        (oa.osm_type == "R" || oa.osm_type == "N") &&
        oa.osm_id != null &&
        oa.isaddress == true &&
        (oa.type == "administrative" || oa.type == "neighbourhood")
    )
    .sort((a, b) => a.admin_level - b.admin_level);
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

    const requestUrl = this.photonUrl + "?" + searchParams.toString();

    console.log(requestUrl);

    const request = await fetch(requestUrl);
    const response = await request.json();
    return response;
  }

  async makeNominatimDetailsRequest(osmId, osmType, config = {}) {

    const query = {
      osmid: osmId,
      osmtype: osmType,
      format: "json"
    }

    const searchParams = new URLSearchParams({...config, ...query})

    const requestUrl = this.nominatimUrl + "/details?" + searchParams.toString();

    console.log(requestUrl);

    const request = await fetch(requestUrl);
    const response = await request.json();
    return response;
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
      console.log(initialData);
      const response = await this.makePhotonRequest(
        tactic.getSearchComponents(initialData),
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

      console.log(JSON.stringify(response, null, 2));
    }

    const wantedFeatures = runs
      .filter((r) => r.features.length == 1)
      .map((r) => r.features[0]);
    console.log("Wanted");
    console.log(wantedFeatures);
    const consolidatedFeature = progressiveIntersect(wantedFeatures);
    console.log(consolidatedFeature);

    const r = {
      road: consolidatedFeature.street,
    };

    console.log(initialData);
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
      console.log(propertyValue);
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
