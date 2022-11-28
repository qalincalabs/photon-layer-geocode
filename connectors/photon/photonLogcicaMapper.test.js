import * as mapper from "./photonLogcicaMapper.js";

test("Photon place feature mapping", () => {
  const logcicaPlace = mapper.mapPlaceFeatureToContext(photonPlaceFeature);
  console.log(JSON.stringify(logcicaPlace, null, 2));
});

const photonPlaceFeature = {
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
