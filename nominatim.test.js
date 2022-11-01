import { addresses } from "./geocoder.test.data.js";
import { mapOsmArea } from "./geocoder.js";
import { createGeoCoder } from "./my-geocoder.js";

test("Nominatim request OFN address", async () => {
  const address = addresses.nearBrussels;

  if (address.country_name == "Belgium")
    address.country_name = "België / Belgique / Belgien";

  const geocoder = createGeoCoder();

  // lowest request with address details
  // then request for each and go up

  const results = []

  const result = await geocoder.makeNominatimDetailsRequest(890827177, "W", {
    addressdetails: 1,
    namedetails: 1,
    tagdetails: 1
  });

  results.push(result)

  const addressComponents = result.address.filter(
    (a) => a.isaddress && ["house_number", "country"].includes(a.type) == false
  )

  for (const c of addressComponents) {
    const areaResult = await geocoder.makeNominatimDetailsRequest(c.osm_id,c.osm_type, {
      namedetails: 1,
      tagdetails: 1
    });

    results.push(areaResult)
  }


  const areas = [];

  for (const r of results ) {
    areas.push(mapOsmArea(r));
  }

  console.log(JSON.stringify(areas));

  //expect(1+2).toBe(3);
});
