import * as osmMapper from "../openStreetMap/osmLogcicaMapper.js";

export function mapDetailsToPlaceContext(input) {}

export function mapDetailsToAreaContext(input1) {
  const input = nominatimProvinceOfLuxembourg;

  const output = basicMapping(input);
  const currentArea = detailMapping(input, output)

  const areas = [];

  for (const address of input.address.filter(a => ["country","country_code"].includes(a.type) == false)) {
    const area = basicMapping(address);
    if(currentArea.ids.includes(area.ids[0]))
      continue
    areas.push(area);
  }

  areas.unshift(currentArea);

  return {
    areas: areas,
  };
  //return mapOsmArea(input)
}

// TODO map country and country code

// only for those who have an osm_id
export function basicMapping(osmArea) {

  const areaTypes = ["region", "province", "village", "town", "neighbourhood"];


  const area = {
    ids: [
      "osm/" +
        osmMapper.osmElementsAbreviations[osmArea.osm_type?.toLowerCase()] +
        "/" +
        osmArea.osm_id,
      "osm/place/" + osmArea.place_id,
    ],
    name: osmArea.localname,
  };

  const types = [];

  if (osmArea.admin_level == 8) {
    types.push("be/municipality");
    if (osmArea.addresstags?.postcode != null)
      area.ids.push("be/postal_code/" + osmArea.addresstags.postcode);
  }
  if (osmArea.admin_level == 7) types.push("be/arrondissement");
  if (osmArea.admin_level == 6) types.push("be/province");
  if (osmArea.admin_level == 4) types.push("be/region");

  if (areaTypes.includes(osmArea.type) && types.length == 0)
    types.push(osmArea.type);

  if (types.length > 0) area.types = types;

  return area
}

export function detailMapping(osmArea,area) {
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
            name: osmArea.names["name:" + lang]
        }
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

const nominatimProvinceOfLuxembourg = {
    place_id: 297930369,
    parent_place_id: 297099684,
    osm_type: "R",
    osm_id: 1412581,
    category: "boundary",
    type: "administrative",
    admin_level: 6,
    localname: "Luxembourg",
    names: {
      "alt_name:nl": "Belgian Luxembourg",
      "ISO3166-2": "BE-WLX",
      name: "Luxembourg",
      "name:de": "Luxemburg",
      "name:en": "Luxembourg",
      "name:fr": "Luxembourg",
      "name:nl": "Luxemburg",
      "name:vls": "Luxemburg",
      "name:wa": "Lussimbork",
      "official_name": "Province de Luxembourg",
      "official_name:de": "Provinz Luxemburg",
      "official_name:en": "Luxembourg Province",
      "official_name:fr": "Province de Luxembourg",
      "official_name:lb": "Provënz Lëtzebuerg",
      "official_name:li": "Provincie Luxemburg",
      "official_name:nl": "Provincie Luxemburg",
      "official_name:vls": "Provinsje Luxemburg",
      "official_name:wa": "Province do Lussimbork"
    },
    addresstags: [],
    housenumber: null,
    calculated_postcode: null,
    country_code: "be",
    indexed_date: "2022-07-15T23:47:28+00:00",
    importance: 0.5513704940264826,
    calculated_importance: 0.5513704940264826,
    extratags: {
      border_type: "departement",
      "ref:INS": "80000",
      "ref:nuts": "BE34",
      "ref:nuts:2": "BE34",
      website: "http://www.province.luxembourg.be/",
      wikidata: "Q1126",
      wikipedia: "fr:Province de Luxembourg"
    },
    calculated_wikipedia: "fr:Province_de_Luxembourg",
    icon: "https://nominatim.openstreetmap.org/ui/mapicons/poi_boundary_administrative.p.20.png",
    rank_address: 8,
    rank_search: 8,
    isarea: true,
    centroid: {
      type: "Point",
      coordinates: [
        5.439803941614714,
        49.96379985
      ]
    },
    geometry: {
      type: "Point",
      coordinates: [
        5.439803942,
        49.96379985
      ]
    },
    address: [
      {
        localname: "Luxembourg",
        place_id: 297930369,
        osm_id: 1412581,
        osm_type: "R",
        place_type: null,
        class: "boundary",
        type: "administrative",
        admin_level: 6,
        rank_address: 8,
        distance: 0,
        isaddress: true
      },
      {
        localname: "Wallonie",
        place_id: 297099684,
        osm_id: 90348,
        osm_type: "R",
        place_type: null,
        class: "boundary",
        type: "administrative",
        admin_level: 4,
        rank_address: 6,
        distance: 0.0000019501102844464857,
        isaddress: true
      },
      {
        localname: "België / Belgique / Belgien",
        place_id: null,
        osm_id: null,
        osm_type: null,
        place_type: null,
        class: "place",
        type: "country",
        admin_level: null,
        rank_address: 4,
        distance: 0,
        isaddress: true
      },
      {
        localname: "be",
        place_id: null,
        osm_id: null,
        osm_type: null,
        place_type: null,
        class: "place",
        type: "country_code",
        admin_level: null,
        rank_address: 4,
        distance: 0,
        isaddress: false
      }
    ]
  }

const nominatimPlaceAsArea = {
  place_id: 299394014,
  parent_place_id: 298118108,
  osm_type: "R",
  osm_id: 12910761,
  category: "boundary",
  type: "administrative",
  admin_level: 9,
  localname: "Carlsbourg",
  names: {
    name: "Carlsbourg",
    "_place_name:ru": "Карльсбур",
  },
  addresstags: [],
  housenumber: null,
  calculated_postcode: null,
  country_code: "be",
  indexed_date: "2022-07-15T23:52:10+00:00",
  importance: 0.2669134868042601,
  calculated_importance: 0.2669134868042601,
  extratags: {
    linked_place: "village",
    "ref:INS": "84050G",
    wikidata: "Q1956182",
  },
  calculated_wikipedia: null,
  icon: "https://nominatim.openstreetmap.org/ui/mapicons/poi_boundary_administrative.p.20.png",
  rank_address: 18,
  rank_search: 16,
  isarea: true,
  centroid: {
    type: "Point",
    coordinates: [5.0830529, 49.8947611],
  },
  geometry: {
    type: "Point",
    coordinates: [5.0830529, 49.8947611],
  },
  address: [
    {
      localname: "Carlsbourg",
      place_id: 299394014,
      osm_id: 12910761,
      osm_type: "R",
      place_type: "village",
      class: "boundary",
      type: "administrative",
      admin_level: 9,
      rank_address: 18,
      distance: 0,
      isaddress: true,
    },
    {
      localname: "Paliseul",
      place_id: 298118108,
      osm_id: 2248105,
      osm_type: "R",
      place_type: "village",
      class: "boundary",
      type: "administrative",
      admin_level: 8,
      rank_address: 16,
      distance: 5.25869393583624e-7,
      isaddress: true,
    },
    {
      localname: "Neufchâteau",
      place_id: 298233536,
      osm_id: 2336443,
      osm_type: "R",
      place_type: null,
      class: "boundary",
      type: "administrative",
      admin_level: 7,
      rank_address: 12,
      distance: 0.0000021663398409176204,
      isaddress: true,
    },
    {
      localname: "Luxembourg",
      place_id: 297930369,
      osm_id: 1412581,
      osm_type: "R",
      place_type: null,
      class: "boundary",
      type: "administrative",
      admin_level: 6,
      rank_address: 8,
      distance: 0.000003633698593647334,
      isaddress: true,
    },
    {
      localname: "Wallonie",
      place_id: 297099684,
      osm_id: 90348,
      osm_type: "R",
      place_type: null,
      class: "boundary",
      type: "administrative",
      admin_level: 4,
      rank_address: 6,
      distance: 0.000004091689205474911,
      isaddress: true,
    },
    {
      localname: "België / Belgique / Belgien",
      place_id: null,
      osm_id: null,
      osm_type: null,
      place_type: null,
      class: "place",
      type: "country",
      admin_level: null,
      rank_address: 4,
      distance: 0,
      isaddress: true,
    },
    {
      localname: "be",
      place_id: null,
      osm_id: null,
      osm_type: null,
      place_type: null,
      class: "place",
      type: "country_code",
      admin_level: null,
      rank_address: 4,
      distance: 0,
      isaddress: false,
    },
  ],
  linked_places: [
    {
      localname: "Carlsbourg",
      place_id: 3069147,
      osm_id: 416323675,
      osm_type: "N",
      place_type: null,
      class: "place",
      type: "village",
      admin_level: 15,
      rank_address: 16,
      distance: 0,
      isaddress: null,
    },
  ],
};
