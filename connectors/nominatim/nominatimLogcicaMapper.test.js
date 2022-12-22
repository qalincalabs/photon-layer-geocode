import * as mapper from "./nominatimLogcicaMapper.js";
import * as core from "../../core/main.js";
import addressFormatter from "@fragaria/address-formatter";

test("Nominatim place mapping", () => {
  const logcicaContext = mapper.mapDetailsToPlaceContext(
    nominatimHouseInCarlsbourg
  );
  console.log(JSON.stringify(logcicaContext, null, 2));
});

test("Nominatim area mapping", () => {
  const logcicaContext = mapper.mapDetailsToAreaContext(
    nominatimProvinceOfLuxembourg
  );
  console.log(JSON.stringify(logcicaContext, null, 2));
});

test("Nominatim lookup mapping", () => {
  nominatimLookupResults.forEach((r) => console.log(JSON.stringify(mapper.mapLookupResult(r),null,2)));
  console.log(extractWithinPlaces(nominatimLookupResults[0]));
  console.log(mapper.mapPhotonResult(photonFeature))
});

function extractWithinPlaces(result) {
  const places = [];
  const exlude = ["ISO3166-2-lvl6", "ISO3166-2-lvl4", "name", "country_code"];

  for (const [key, value] of Object.entries(result.address)) {
    if (exlude.includes(key)) continue;

    const place = {
      name: value,
      type: key,
    };

    if (key == "region" && result.address["ISO3166-2-lvl4"] != null) {
      place.code = result.address["ISO3166-2-lvl4"].toLowerCase();
      place.ids = ["places/" + place.code];
    }

    if (key == "state" && result.address["ISO3166-2-lvl6"] != null) {
      place.code = result.address["ISO3166-2-lvl6"].toLowerCase();
      place.ids = ["places/" + place.code];
    }

    if (key == "country") {
      place.code = result.address.country_code.toLowerCase();
      place.ids = ["places/" + place.code];
    }

    if (key == "postcode")
      place.ids = [
        "places/" + result.address.country_code + "/" + result.address.postcode,
      ];

    places.push(place);
  }

  return places;
}

const photonFeature = {
  geometry: {
    coordinates: [5.086509430429737, 49.896207149999995],
    type: "Point",
  },
  type: "Feature",
  properties: {
    osm_id: 890827177,
    extent: [5.0863637, 49.8962813, 5.0866271, 49.8961331],
    country: "België / Belgique / Belgien",
    city: "Paliseul",
    countrycode: "BE",
    postcode: "6850",
    county: "Neufchâteau",
    type: "house",
    osm_type: "W",
    osm_key: "building",
    housenumber: "40",
    street: "Grand Rue",
    district: "Carlsbourg",
    osm_value: "yes",
    state: "Luxembourg",
  },
};

const expected = {
  ids: ["osm/r6960890"],
  osm: {},
  bbox: [4.3686478, 50.7985193, 4.3752355, 50.8008569], // not sure about the format (mongo box or geojson bbox)
  center: {
    type: "Point",
    coordinates: [-6.665005442449422, 53.54026225],
  },
  geometry: {},
  pluscode: "",
  within: ["osm/w832"],
  // how to handle multi language
  // only for a final place
  photonAddress: {},
  nominatimAddress: {},
  address: {
    unit: [],
    house: [],
    street: [],
    locality: [],
    region: [],
    postcode: "",
    country: "",
  },
  formattedAddress: [],
};

const nominatimLookupResults = [
  {
    place_id: 274264844,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "way",
    osm_id: 890827177,
    boundingbox: ["49.8961331", "49.8962813", "5.0863637", "5.0866271"],
    lat: "49.896207149999995",
    lon: "5.086509430429737",
    display_name:
      "40, Grand Rue, Carlsbourg, Paliseul, Neufchâteau, Luxembourg, Wallonie, 6850, België / Belgique / Belgien",
    place_rank: 30,
    category: "building",
    type: "yes",
    importance: 0,
    address: {
      house_number: "40",
      road: "Grand Rue",
      village: "Carlsbourg",
      county: "Neufchâteau",
      state: "Luxembourg",
      "ISO3166-2-lvl6": "BE-WLX",
      region: "Wallonie",
      "ISO3166-2-lvl4": "BE-WAL",
      postcode: "6850",
      country: "België / Belgique / Belgien",
      country_code: "be",
    },
    extratags: {},
    namedetails: {},
  },
  {
    place_id: 230595622,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "way",
    osm_id: 617274322,
    boundingbox: ["49.9015293", "49.901554", "5.1010516", "5.1021742"],
    lat: "49.901554",
    lon: "5.1017691",
    display_name:
      "Grand Rue, Carlsbourg, Paliseul, Neufchâteau, Luxembourg, Wallonie, 6850, België / Belgique / Belgien",
    place_rank: 26,
    category: "highway",
    type: "secondary",
    importance: 0.09999999999999998,
    address: {
      road: "Grand Rue",
      village: "Carlsbourg",
      county: "Neufchâteau",
      state: "Luxembourg",
      "ISO3166-2-lvl6": "BE-WLX",
      region: "Wallonie",
      "ISO3166-2-lvl4": "BE-WAL",
      postcode: "6850",
      country: "België / Belgique / Belgien",
      country_code: "be",
    },
    extratags: {
      oneway: "yes",
      surface: "asphalt",
      maxspeed: "50",
    },
    namedetails: {
      ref: "N853",
      name: "Grand Rue",
    },
  },
  {
    place_id: 299394014,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "relation",
    osm_id: 12910761,
    boundingbox: ["49.8699503", "49.9218421", "5.0423236", "5.119232"],
    lat: "49.8947611",
    lon: "5.0830529",
    display_name:
      "Carlsbourg, Paliseul, Neufchâteau, Luxembourg, Wallonie, België / Belgique / Belgien",
    place_rank: 16,
    category: "boundary",
    type: "administrative",
    importance: 0.2669134868042601,
    address: {
      village: "Carlsbourg",
      county: "Neufchâteau",
      state: "Luxembourg",
      "ISO3166-2-lvl6": "BE-WLX",
      region: "Wallonie",
      "ISO3166-2-lvl4": "BE-WAL",
      country: "België / Belgique / Belgien",
      country_code: "be",
    },
    extratags: {
      "ref:INS": "84050G",
      wikidata: "Q1956182",
      linked_place: "village",
    },
    namedetails: {
      name: "Carlsbourg",
    },
  },
  {
    place_id: 297784014,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "relation",
    osm_id: 52411,
    boundingbox: ["49.4969821", "51.550781", "2.3889137", "6.408097"],
    lat: "50.6402809",
    lon: "4.6667145",
    display_name: "België / Belgique / Belgien",
    place_rank: 4,
    category: "boundary",
    type: "administrative",
    importance: 0.8190605523573009,
    address: {
      country: "België / Belgique / Belgien",
      country_code: "be",
    },
    extratags: {
      flag: "http://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg",
      sqkm: "30528",
      currency: "EUR",
      timezone: "Europe/Brussels",
      wikidata: "Q31",
      wikipedia: "nl:België",
      population: "11035948",
      "geonames:id": "2802361",
      capital_city: "Brussels",
      linked_place: "country",
      "ISO3166-1:alpha2": "BE",
      "ISO3166-1:alpha3": "BEL",
      "ISO3166-1:numeric": "056",
      country_code_fips: "BE",
      "TMC:cid_58:tabcd_1:Class": "Area",
      "TMC:cid_58:tabcd_1:LCLversion": "8.00",
      "TMC:cid_58:tabcd_1:LocationCode": "3",
    },
    namedetails: {
      name: "België / Belgique / Belgien",
      "name:en": "Belgium",
      "name:fr": "Belgique",
      "name:nl": "België",
      "name:wa": "Beldjike",
    },
  },
];

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
    official_name: "Province de Luxembourg",
    "official_name:de": "Provinz Luxemburg",
    "official_name:en": "Luxembourg Province",
    "official_name:fr": "Province de Luxembourg",
    "official_name:lb": "Provënz Lëtzebuerg",
    "official_name:li": "Provincie Luxemburg",
    "official_name:nl": "Provincie Luxemburg",
    "official_name:vls": "Provinsje Luxemburg",
    "official_name:wa": "Province do Lussimbork",
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
    wikipedia: "fr:Province de Luxembourg",
  },
  calculated_wikipedia: "fr:Province_de_Luxembourg",
  icon: "https://nominatim.openstreetmap.org/ui/mapicons/poi_boundary_administrative.p.20.png",
  rank_address: 8,
  rank_search: 8,
  isarea: true,
  centroid: {
    type: "Point",
    coordinates: [5.439803941614714, 49.96379985],
  },
  geometry: {
    type: "Point",
    coordinates: [5.439803942, 49.96379985],
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
      distance: 0.0000019501102844464857,
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
};

const nominatimVillageOfCarlsbourg = {
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

const nominatimHouseInCarlsbourg = {
  place_id: 274264844,
  parent_place_id: 254766486,
  osm_type: "W",
  osm_id: 890827177,
  category: "building",
  type: "yes",
  admin_level: 15,
  localname: "40",
  names: [],
  addresstags: {
    housenumber: "40",
    street: "Grand Rue",
  },
  housenumber: "40",
  calculated_postcode: "6850",
  country_code: "be",
  indexed_date: "2022-07-16T12:56:37+00:00",
  importance: 0,
  calculated_importance: 0,
  extratags: [],
  calculated_wikipedia: null,
  rank_address: 30,
  rank_search: 30,
  isarea: true,
  centroid: {
    type: "Point",
    coordinates: [5.086509430429737, 49.896207149999995],
  },
  geometry: {
    type: "Point",
    coordinates: [5.08650943, 49.89620715],
  },
  address: [
    {
      localname: "40",
      place_id: null,
      osm_id: null,
      osm_type: null,
      place_type: null,
      class: "place",
      type: "house_number",
      admin_level: null,
      rank_address: 28,
      distance: 0,
      isaddress: true,
    },
    {
      localname: "Grand Rue",
      place_id: 254766486,
      osm_id: 759918132,
      osm_type: "W",
      place_type: null,
      class: "highway",
      type: "secondary",
      admin_level: 15,
      rank_address: 26,
      distance: 0,
      isaddress: true,
    },
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
      distance: 7.60853336721647e-9,
      isaddress: true,
    },
    {
      localname: "Merny",
      place_id: 3045008,
      osm_id: 416323136,
      osm_type: "N",
      place_type: null,
      class: "place",
      type: "village",
      admin_level: 15,
      rank_address: 18,
      distance: 0.009256472465252984,
      isaddress: false,
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
      distance: 4.4282910144660386e-7,
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
      distance: 0.000002084551887308523,
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
      distance: 0.0000035499355138442967,
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
      distance: 0.000004010546388192828,
      isaddress: true,
    },
    {
      localname: "6850",
      place_id: 299354354,
      osm_id: 12911238,
      osm_type: "R",
      place_type: null,
      class: "boundary",
      type: "postal_code",
      admin_level: 15,
      rank_address: 5,
      distance: 2.086535226805597e-7,
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
};

// from https://github.com/OpenCageData/address-formatting/blob/master/conf/components.yaml
// open cage address components

/*
unit: an apartment, unit, office, lot, or other secondary unit designator
level: expressions indicating a floor number e.g. "3rd Floor", "Ground Floor", etc.
staircase: numbered/lettered staircase
entrance: numbered/lettered entrance
po_box: post office box: typically found in non-physical (mail-only) addresses
postcode: postal codes used for mail sorting

suburb: usually an unofficial neighborhood name like "Harlem", "South Bronx", or "Crown Heights"
city_district: these are usually boroughs or districts within a city that serve some official purpose e.g. "Brooklyn" or "Hackney" or "Bratislava IV"
city: any human settlement including cities, towns, villages, hamlets, localities, etc.
island: named islands e.g. "Maui"
state_district: usually a second-level administrative division or county.
state: a first-level administrative division. Scotland, Northern Ireland, Wales, and England in the UK are mapped to "state" as well (convention used in OSM, GeoPlanet, etc.)
country_region: informal subdivision of a country without any political status
country: sovereign nations and their dependent territories, anything with an ISO-3166 code.
world_region
*/

// unit line -> Campus du Solbosch, CP 150

// unit
// level
// staircase
// entrance
// PO BOX is missing ...
const list = [
  {
    name: "house_number",
    aliases: ["street_number", "housenumber"],
  },
  {
    name: "house",
    aliases: [
      "building",
      "public_building",
      "isolated_dwelling",
      "farmland",
      "allotments",
    ],
  },
  {
    name: "road",
    aliases: [
      "footway",
      "street",
      "street_name",
      "residential",
      "path",
      "pedestrian",
      "road_reference",
      "road_reference_intl",
      "square",
      "place",
    ],
  },
  {
    name: "hamlet", // not in libpostal
    aliases: ["locality", "croft"],
  },
  {
    name: "village", // not in libpostal
  },
  {
    name: "neighbourhood", // not in libpostal
    aliases: [
      "suburb", // libpostal
      "city_district", // libpostal
      "commune",
      "district",
      "quarter",
      "borough",
      "city_block",
      "residential",
      "commercial",
      "industrial",
      "houses",
      "subdistrict",
      "subdivision",
      "ward",
    ],
  },
  {
    name: "postal_city", // not in libpostal
  },
  {
    name: "city",
    aliases: ["town", "township"],
  },
  {
    name: "municipality", // not in libpostal
    aliases: ["local_administrative_area", "subcounty"],
  },
  {
    name: "county", // not in libpostal
    aliases: ["county_code", "department"],
  },
  {
    name: "state_district", // in libpostal
  },
  {
    name: "postcode",
    aliases: ["postal_code", "partial_postcode"],
  },
  {
    name: "state",
    aliases: ["province", "state_code"],
  },
  {
    name: "region",
  },
  {
    name: "island",
  },
  {
    name: "archipelago", // not in libpostal
  },
  {
    name: "country",
    aliases: ["country_name"],
  },
  {
    name: "country_code",
  },
  {
    name: "continent", // not in libpostal, only world region
  },
];
