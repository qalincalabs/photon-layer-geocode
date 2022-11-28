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

export function mapPlaceFeatureToContext(input1) {
  const input = nominatimPlaceFeature;
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

  address.text = address.streetLine + ", " + address.postcode + " " + address.locality + ", " + address.country

  place.address = address

  const areas = [
    {
      ids: ["iso/countries/" + featureProperties.countrycode.toLowerCase()],
      types: ["country"],
      name: featureProperties.country,
    },
  ];

  for (const [key, value] of Object.entries(
    photonAreaLayersAfterCountryForBelgium
  )) {
    const name = featureProperties[key];
    const area = {
      ids: ["photon/be/" + value.keyOther + "/" + name.toLowerCase()], // TODO sluggify
      name: name,
      types: ["photon/" + key],
    };

    if (key == "district") {
      area.ids = [
        "photon/be/" +
          featureProperties["city"].toLowerCase() +
          "/" +
          value.keyOther +
          "/" +
          name.toLowerCase(),
      ];
    }

    if (key == "postcode") {
      area.types = ["postcode"];
    }

    if (value.equivalentOne != null) {
      area.ids.unshift(
        "photon/be/" + value.equivalentOther + "/" + name.toLowerCase()
      );
      area.types.unshift("be/" + value.equivalentOne);
    }

    areas.push(area);
  }

  for(let i = 0; i < areas.length; i++){
    const previousAreas = areas.slice(0,i)

    if(previousAreas.length == 0) continue

    const currentArea = areas[i]
    currentArea.geoWithins = previousAreas.map((a) => ({
        ids: a.ids,
      }));

    if(currentArea.types.includes("postcode"))  
      currentArea.geoWithins = [{ids: areas[0].ids}]
  }

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

const nominatimPlaceFeature = {
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
