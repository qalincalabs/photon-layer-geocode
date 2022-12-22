import * as osmMapper from "../openStreetMap/osmLogcicaMapper.js";
import * as core from "../../core/main.js";
import addressFormatter from "@fragaria/address-formatter";
const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export function mapDetailsToPlaceContext(input) {
  const place = {
    ids: [
      "osm/" +
        osmMapper.osmElementsAbreviations[input.osm_type?.toLowerCase()] +
        "/" +
        input.osm_id,
      "osm/places/" + input.place_id,
    ],
    geo: input.geometry, // use geometry instead ??
  };

  // admin level 9 or 8

  const address = {
    streetLine: input.addresstags.street,
    postcode: input.calculated_postcode,
    locality: input.address.find((a) => [8, 9].includes(a.admin_level))
      .localname,
    country: "Belgium",
  };

  if (input.addresstags.housenumber != null)
    address.streetLine += " " + input.addresstags.housenumber;

  address.text = osmMapper.getAddressText(address);

  place.address = address;

  const areas = mapAddresses(input);
  core.populateAreaWithins(areas)

  place.areas = areas.map((a) => ({ ids: a.ids }));

  return {
    places: [place],
    areas: areas,
  };
}

export function mapDetailsToAreaContext(input) {
  const output = basicMapping(input);
  const currentArea = detailMapping(input, output);

  const areas = mapAddresses(input, currentArea.ids);
  core.populateAreaWithins(areas)

  areas.unshift(currentArea);

  return {
    areas: areas,
  };
}

function mapAddresses(input, skipIds = []) {
  const areas = [];

  const addresses = input.address.filter(
    (oa) =>
      (oa.osm_type == "R" || oa.osm_type == "N") &&
      oa.osm_id != null &&
      oa.isaddress == true &&
      (oa.type == "administrative" ||
        oa.type == "neighbourhood" ||
        oa.type == "postal_code") &&
      oa.rank_address < 26 // to take street or under
  ).sort((a, b) => a.admin_level - b.admin_level);

  // const address of
  for (const address of addresses) {
    const area = basicMapping(address);
    if (skipIds.includes(area.ids[0])) continue;
    areas.push(area);
  }

  const countryAddress = input.address.find((a) => a.type == "country");
  const countryCodeAddress = input.address.find(
    (a) => a.type == "country_code"
  );

  areas.unshift({
    ids: ["iso/countries/" + countryCodeAddress.localname],
    name: countryAddress.localname,
    types: ["country"]
  });
  return areas;
}

// TODO map country and country code

// only for those who have an osm_id
export function basicMapping(osmArea) {
  const areaTypes = ["village", "town", "neighbourhood"];

  const area = {
    ids: [
      "osm/" +
        osmMapper.osmElementsAbreviations[osmArea.osm_type?.toLowerCase()] +
        "/" +
        osmArea.osm_id,
      "osm/places/" + osmArea.place_id,
    ],
    name: osmArea.localname,
  };

  const types = [];

  // only for Belgium

  const countryCode = "be"

  const config = osmMapper.countryConfig

  const mapping = config[countryCode]?.mappings
  .find(m => m.filters.nominatim != null && m.filters.nominatim.admin_level == osmArea.admin_level)

  if(mapping != null){
    types.push(countryCode + "/" + mapping.typeOne)
    area.ids.push(countryCode + "/" + mapping.typeOther + "/" + core.sluggify(osmArea.localname))
  }

  if(osmArea.type == "postal_code"){
    types.push("postal_code")
    area.ids.push(countryCode + "/postal_codes/" + core.sluggify(osmArea.localname))
  }

  if (areaTypes.includes(osmArea.type) && types.length == 0)
    types.push("osm/"+osmArea.type)

  if (types.length > 0) area.types = types;

  return area;
}

export function detailMapping(osmArea, area) {
  const languages = ["en", "fr", "nl", "de", "vls", "wa"];
  const areaTypes = ["region", "province", "village", "town", "neighbourhood"];

  if (osmArea.admin_level == 8 && osmArea.addresstags?.postcode != null) {
    area.ids.push("be/postal_code/" + osmArea.addresstags.postcode);
  }

  if (areaTypes.includes(osmArea.extratags?.linked_place) && area.types != null)
    area.types = ["osm/" + osmArea.extratags.linked_place]; // TODO what's this

  if (osmArea.names != null) {
    for (const lang of languages) {
      if ("name:" + lang in osmArea.names) {
        if (area.translations == null) area.translations = {};
        area.translations[lang] = {
          name: osmArea.names["name:" + lang],
        };
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

const osmTypes = [
  {
    name: "relation",
    symbol: "R",
  },
  {
    name: "node",
    symbol: "N",
  },
  {
    name: "way",
    symbol: "W",
  },
];

function osmSymbolFromTypeName(name) {
  return osmTypes.find((t) => t.name == name)?.symbol;
}

// add within
// add limosa address ?
export function mapLookupResult(result) {
  const languages = ["fr", "nl", "en"];

  const osmUuid = osmSymbolFromTypeName(result.osm_type) + result.osm_id;
  const relId = "osm/" + osmUuid.toLowerCase();

  const place = {
    relId: relId,
    ids: [relId],
    bbox: [
      result.boundingbox[2],
      result.boundingbox[0],
      result.boundingbox[3],
      result.boundingbox[1],
    ],
    center: {
      type: "Point",
      coordinates: [result.lon, result.lat],
    },
    osm: {
      element: {
        uuid: osmUuid,
        id: result.osm_id,
        type: {
          name: result.osm_type,
          symbol: osmSymbolFromTypeName(result.osm_type),
        },
      },
      category: result.category,
      type: result.type,
      rank: result.place_rank,
      importance: result.importance,
    },
  };

  if (result.namedetails?.name != null) place.name = result.namedetails["name"];

  if (result.place_rank >= 28) {
    const addressBeforeFormatting = Object.assign({}, result.address);

    delete addressBeforeFormatting.country;
    delete addressBeforeFormatting.country_code;
    delete addressBeforeFormatting["ISO3166-2-lvl4"];
    delete addressBeforeFormatting["ISO3166-2-lvl6"];

    place.formattedAddress = addressFormatter.format(addressBeforeFormatting, {
      output: "array",
      // appendCountry: false, not working
    });
  }

  if (isEmpty(result.extratags) == false)
    place.osm.extratags = result.extratags;

  if (isEmpty(result.extratags) == false) {
    if ("ref:INS" in result.extratags)
      place.ids.push("be/ins/" + result.extratags["ref:INS"]);
    if ("ref:nuts:1" in result.extratags)
      place.ids.push("nuts/1/" + result.extratags["ref:nuts:1"]);
    if ("ref:nuts:2" in result.extratags)
      place.ids.push("nuts/2/" + result.extratags["ref:nuts:2"]);
    if ("ref:nuts:3" in result.extratags)
      place.ids.push("nuts/3/" + result.extratags["ref:nuts:3"]);

    if ("ISO3166-1:alpha2" in result.extratags)
      place.ids.push("places/" + result.extratags["ISO3166-1:alpha2"]);
    if ("ISO3166-1:alpha3" in result.extratags)
      place.ids.push(
        "places/" + result.extratags["ISO3166-1:alpha3"]
      );
    if ("ISO3166-1:numeric" in result.extratags)
      place.ids.push(
        "places/" + result.extratags["ISO3166-1:numeric"]
      );
  }

  place.ids = place.ids.map(i => i.toLowerCase())

  if (isEmpty(result.namedetails) == false) {
    for (const lang of languages) {
      if ("name:" + lang in result.namedetails) {
        if (place.translations == null) place.translations = {};
        place.translations[lang] = {
          name: result.namedetails["name:" + lang],
        };
      }
    }
  }

  return place;
}

export function mapPhotonResult(result) {

  const properties = result.properties

  const osmUuid = properties.osm_type + properties.osm_id;
  const relId = "osm/" + osmUuid.toLowerCase();
  
  const place = {
    relId: relId,
    ids: [relId],
    bbox: [
      properties.extent[0],
      properties.extent[3],
      properties.extent[2],
      properties.extent[1],
    ],
    center: result.geometry,
    osm: {
      element: {
        uuid: osmUuid,
        id: properties.osm_id,
        type: {
          symbol: properties.osm_type
        },
      },
      type: properties.type
    },
    
  };

  if(properties.name != null)
    place.name = properties.name

  const address = {
    city: properties.city,
    postcode: properties.postcode,
    county: properties.county,
    housenumber: properties.housenumber,
    street: properties.street,
    district: properties.district,
    state: properties.state
  }

  place.formattedAddress = addressFormatter.format(address, {
    output: "array",
  });

  if(properties.osm_type == "country"){
    place.ids.push("places/"+properties.countrycode.toLowerCase())
  }

  return place;
}

const photonLayers = ["house","street","district","city","county","state","postcode","country"]

const bePhotonTemplates = {
  house: {
    arrayFn: p => [p.countrycode,p.city,p.district,p.street,p.housenumber,p.name]
  },
  street: {
    arrayFn: p => [p.countrycode,p.city,p.district,p.street]
  },
  district: {
    arrayFn: p => [p.countrycode,p.city,p.district]
  },
  city: {
    arrayFn: p => [p.countrycode,p.city]
  },
  county: {
    arrayFn: p => [p.countrycode,p.county]
  },
  state: {
    arrayFn: p => [p.countrycode,p.state]
  },
  postcode: {
    arrayFn: p => [p.countrycode,p.postcode],
    skipOsmPrefix: true
  },
  country: {
    arrayFn: p => [p.countrycode],
    skipOsmPrefix: true
  }
}

export function extractPhotonPlaces(result){
  const properties = result.properties
  
  const places = []
  
  for(const layer of photonLayers){
    const key = layer == "house" ? "housenumber" : layer

    const value = properties[key]
    if(value == null)
      continue

    const template = bePhotonTemplates[layer]
    const idPrefix = bePhotonTemplates.skipOsmPrefix ? "places/" : "places/osm/"
    const array = template.arrayFn(properties).filter(v => v != null).map(v => v.replace(" ","_").toLowerCase())
    console.log(array)

    const place = {
      ids: [idPrefix + array.map(v => v).join("/")],
      name: properties[key],
      photon: {
        type: layer
      }
    }

    places.push(place)
  }

  return places
}


const NominatimLogcicaMapper = () => {};
export default NominatimLogcicaMapper;
