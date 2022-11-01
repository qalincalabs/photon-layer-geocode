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

  const runs = [];

  const firstRun = {
    query: {
        osmid: 890827177,
        osmtype: "W",
        addressdetails: 1,
        namedetails: 1,
        tagdetails: 1,
      }
  }

  firstRun.result = await geocoder.makeNominatimDetailsRequest(firstRun.query);
  runs.push(firstRun)

  const addressComponents = firstRun.result.address.filter(
    (a) => a.isaddress && ["house_number", "country"].includes(a.type) == false
  );

  for (const c of addressComponents) {

    const run = {
        query: {
            osmid: c.osm_id,
            osmtype: c.osm_type,
            namedetails: 1,
            tagdetails: 1,
          }
    }

    run.result = await geocoder.makeNominatimDetailsRequest(run.query);

    runs.push(run);
  }

  const areas = [];

  for (const r of runs) {
    areas.push(mapOsmArea(r.result));
  }

  console.log(JSON.stringify(areas));

  //expect(1+2).toBe(3);
});
