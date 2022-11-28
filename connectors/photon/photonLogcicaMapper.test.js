import * as mapper from "./photonLogcicaMapper.js";

test("Photon place feature mapping", () => {
  const logcicaPlace = mapper.mapPlaceFeatureToContext(nominatimPlaceFeature)
  console.log(JSON.stringify(logcicaPlace,null,2));
});

const nominatimPlaceFeature = {
    geometry: {
      coordinates: [
        -6.6486084,
        53.5501694
      ],
      type: "Point"
    },
    type: "Feature",
    properties: {
      osm_id: 10026781976,
      country: "Éire / Ireland",
      city: "Kilmessan",
      countrycode: "IE",
      postcode: "C15 YK80",
      county: "County Meath",
      type: "house",
      osm_type: "N",
      osm_key: "shop",
      street: "Swainstown",
      district: "Kilmessan ED",
      osm_value: "greengrocer",
      name: "The Piggery"
    }
  }