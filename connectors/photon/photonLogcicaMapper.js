import * as osmMapper from "../openStreetMap/osmLogcicaMapper.js";
import * as core from "../../core/main.js";

const photonAreaLayersAfterCountryForBelgium = {
  state: {
    keyOther: "states",
    equivalentOther: "provinces",
    equivalentOne: "province",
  },
  county: {
    keyOther: "counties",
    equivalentOther: "subdivisions",
    equivalentOne: "subdivision",
  },
  city: {
    keyOther: "cities",
    equivalentOther: "municipalities",
    equivalentOne: "municipality",
  },
  postcode: {
    keyOther: "postcodes",
  },
  district: {
    keyOther: "districts",
  },
};

const osmElementsAbreviations = {
  n: "nodes",
  w: "ways",
  r: "relationships",
};

export function mapPlaceFeatureToContext(input) {
  const featureProperties = input.properties;

  const place = {
    ids: [
      "osm/" +
        osmElementsAbreviations[featureProperties.osm_type.toLowerCase()] +
        "/" +
        featureProperties.osm_id,
    ],
    name: featureProperties.name,
    geo: input.geometry,
  };

  const address = {
    streetLine: featureProperties.street,
    postcode: featureProperties.postcode,
    locality: featureProperties.district,
    country: "Belgium",
  };

  if (featureProperties.housenumber != null)
    address.streetLine += " " + featureProperties.housenumber;

  address.text = osmMapper.getAddressText(address);

  place.address = address;

  const areas = [
    {
      ids: ["iso/countries/" + featureProperties.countrycode.toLowerCase()],
      types: ["country"],
      name: featureProperties.country,
    },
  ];

  const appKey = "photon";
  const countryCode = "be";

  const mappings = osmMapper.countryConfig[countryCode]?.mappings
    .filter((m) => m.filters.photon != null)

  for (const mapping of mappings) {

    const key = mapping.filters.photon.key
    const name = featureProperties[key];
    const nameKey = core.sluggify(name)
    
    const area = {
      ids: [
        `${countryCode}/${mapping.typeOther}/${nameKey}`,
        `${appKey}/${countryCode}/${mapping.photonTypeOther}/${nameKey}`
      ], // TODO sluggify
      name: name,
      types: [
        `${countryCode}/${mapping.typeOne}`,
        `${appKey}/${key}`
      ],
    };

    areas.push(area);
  }

  const districtKey = core.sluggify(featureProperties["district"]);
  const cityKey = core.sluggify(featureProperties["city"]);
  areas.push({
    ids: [
      `${appKey}/${countryCode}/${cityKey}/districts/${districtKey}`,
    ],
    name: districtKey,
    type: [appKey + "/district"]
  });

  const postalCode = featureProperties["postcode"]
  const postalCodeKey = core.sluggify(postalCode)
  areas.push({
    ids: [`${countryCode}/postal_codes/${postalCodeKey}`],
    name: postalCode,
    type: ["postal_code"]
  })

  core.populateAreaWithins(areas);

  place.areas = areas.map((a) => ({
    ids: a.ids,
  }));

  // osm type mappings
  const context = {
    places: [place],
    areas: [areas],
  };

  return context;
}

const PhotonLogcicaMapper = () => {};
export default PhotonLogcicaMapper;
