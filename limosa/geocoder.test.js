import { PhotonLayerGeocoder } from "./geocoder.js";
import { config } from "./config/ofnBe.js";
import { addresses } from "./geocoder.test.data.js";


test("Geocode OFN address", async () => {
  const geocoder = createGeoCoder()  
  const result = await geocoder.geocode(addresses.swainstownFarm);
  console.log(JSON.stringify(result));
  //expect(1+2).toBe(3);
});

function createGeoCoder() {
  return new PhotonLayerGeocoder(
    {
      photon: { url: "https://photon.komoot.io/api" },
      nominatim: { url: "https://nominatim.openstreetmap.org" },
    },
    config
  );
}
