import * as osmMapper from "../openStreetMap/osmLogcicaMapper.js";
import * as core from "../../core/main.js";

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
    streetLine: input.addresstags.street + " " + input.addresstags.housenumber,
    postcode: input.calculated_postcode,
    locality: input.address.find((a) => [8, 9].includes(a.admin_level))
      .localname,
    country: "Belgium",
  };

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

  const config = {
    be: {
      mappings: [
        {
          filters: {
            nominatim: {
              admin_level: 8,
            },
          },
          typeOne: "municipality",
          typeOther: "municipalities",
        },
        {
          filters: {
            nominatim: {
              admin_level: 7,
            },
          },
          typeOne: "arrondissement",
          typeOther: "arrondissements",
        },
        {
          filters: {
            nominatim: {
              admin_level: 6,
            },
          },
          typeOne: "province",
          typeOther: "provinces",
        },
        {
          filters: {
            nominatim: {
              admin_level: 4,
            },
          },
          typeOne: "region",
          typeOther: "regions",
        },
      ],
    },
  };

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

const NominatimLogcicaMapper = () => {};
export default NominatimLogcicaMapper;
