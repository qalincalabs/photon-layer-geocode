import { PhotonLayerGeocoder } from "./geocoder.js";

export function createGeoCoder() {
  const geocoder = new PhotonLayerGeocoder(
    {
      photon: { url: "https://photon.komoot.io/api" },
      nominatim: { url: "https://nominatim.openstreetmap.org" },
    },
    {
      strategies: [
        {
          key: "ofn-be",
          transform: (initial) => {
            if (initial.country_name == "Belgium")
              initial.country_name = "België / Belgique / Belgien";
            return initial;
          },
          tactics: ["ofn-be-house", "ofn-be-locality", "ofn-be-street"],
          approve: {
            house: (initial, consolidatedFeature) => {
              return (
                consolidatedFeature.housenumber != null &&
                initial.address1.includes(consolidatedFeature.housenumber)
              );
            },
          },
        },
      ],
      tactics: [
        {
          key: "ofn-be-house",
          layers: ["house"],
          limit: 1,
          getSearchComponents: (initial) => {
            return [
              initial.address1,
              initial.zipcode,
              initial.city,
              initial.country_name,
            ];
          },
        },
        {
          key: "ofn-be-street",
          layers: ["street"],
          getSearchComponents: (initial) => {
            return [
              initial.address1,
              initial.zipcode,
              initial.city,
              initial.country_name,
            ];
          },
        },
        /*
        {
          key: "ofn-be-street-without-locality",
          layers: ["street"],
          getSearchComponents: (initial) => {
            return [initial.address1, initial.zipcode, initial.country_name];
          },
        },
        */
        {
          key: "ofn-be-locality",
          layers: ["district", "city"],
          getSearchComponents: (initial) => {
            return [initial.city, initial.country_name];
          },
        },
      ],
    }
  );

  return geocoder;
}