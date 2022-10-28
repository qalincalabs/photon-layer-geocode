import { addresses } from "./geocoder.test.data.js";
import { PhotonLayerGeocoder } from "./geocoder.js";

test("Geocode OFN address", async () => {
  const address = addresses.nearUccle;

  const geocoder = new PhotonLayerGeocoder(
    {
      photon: { url: "https://photon.komoot.io/api" },
    },
    {
      getAddressComponents: (o) => {
        return [o.address1, o.zipcode, o.city, o.country_name].filter(
          (c) => c != null
        );
      },
    }
  );

  const result = await geocoder.geocode(address);

  console.log(JSON.stringify(result));

  //expect(1+2).toBe(3);
});
