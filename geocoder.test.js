import { addresses } from "./geocoder.test.data.js";
import { PhotonLayerGeocoder, PhotonProperties, intersect } from "./geocoder.js";

// hints

// intial transform
// belgium
// hints per layer + alternatives
// strategy > tactic > goals

test("Geocode OFN address", async () => {
  const address = addresses.nearUccle;

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
            return initial
          },
          tactics: ["ofn-be-house", "ofn-be-locality", "ofn-be-street"]
        },
      ],
      tactics: [
        {
          key: "ofn-be-house",
          layers: ["house"],
          getSearchComponents: (initial) => {
            return [initial.address1, initial.zipcode, initial.city, initial.country_name]
          }
        },
        {
          key: "ofn-be-street",
          layers: ["street"],
          getSearchComponents: (initial) => {
            return [initial.address1, initial.zipcode, initial.city, initial.country_name]
          }
        },
        {
          key: "ofn-be-locality",
          layers: ["district", "city"],
          getSearchComponents: (initial) => {
            return [initial.city, initial.country_name]
          }
        }
      ],
    }
  );

  const result = await geocoder.geocode(address);

  console.log(JSON.stringify(result));

  //expect(1+2).toBe(3);
});
