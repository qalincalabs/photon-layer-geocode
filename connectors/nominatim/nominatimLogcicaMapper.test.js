import * as mapper from "./nominatimLogcicaMapper.js";
import * as core from "../../core/main.js";

test("Nominatim place mapping", () => {
  const logcicaContext = mapper.mapDetailsToPlaceContext(nominatimHouseInCarlsbourg);
  console.log(JSON.stringify(logcicaContext, null, 2));
});

test("Nominatim area mapping", () => {
    const logcicaContext = mapper.mapDetailsToAreaContext(nominatimProvinceOfLuxembourg);
    console.log(JSON.stringify(logcicaContext, null, 2));
  });

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
      street: "Grand Rue"
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
      coordinates: [
        5.086509430429737,
        49.896207149999995
      ]
    },
    geometry: {
      type: "Point",
      coordinates: [
        5.08650943,
        49.89620715
      ]
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
        isaddress: true
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
        isaddress: true
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
        isaddress: true
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
        isaddress: false
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
        isaddress: true
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
        isaddress: true
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
        distance: 0.000004010546388192828,
        isaddress: true
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
