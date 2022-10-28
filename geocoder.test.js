import { addresses } from "./geocoder.test.data.js";
import { PhotonLayerGeocoder } from "./geocoder.js";

test("Geocode OFN address", async () => {
  const address = addresses.houseNumberNotInOSM;

  if (address.country_name == "Belgium")
    address.country_name = "België / Belgique / Belgien";

  const geocoder = new PhotonLayerGeocoder(
    {
      photon: { url: "https://photon.komoot.io/api" },
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
        {
          key: "ofn-be-street-without-locality",
          layers: ["street"],
          getSearchComponents: (initial) => {
            return [initial.address1, initial.zipcode, initial.country_name];
          },
        },
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

  const result = await geocoder.geocode(address);

  console.log(JSON.stringify(result));

  //expect(1+2).toBe(3);
});
