import { addresses } from "./geocoder.test.data.js";
import { createGeoCoder } from "./my-geocoder.js";

test("Geocode OFN address", async () => {
  const address = addresses.streetDoesNotExist;

  if (address.country_name == "Belgium")
    address.country_name = "België / Belgique / Belgien";

  const geocoder = createGeoCoder();
  const result = await geocoder.geocode(address);

  console.log(JSON.stringify(result));

  //expect(1+2).toBe(3);
});
