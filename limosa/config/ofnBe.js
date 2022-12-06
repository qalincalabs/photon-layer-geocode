function ofnBePostTransform(input, exactMatch, closeMatch) {
  let bestHouseNumber;

  if (input.address1.includes(closeMatch?.housenumber))
    bestHouseNumber = closeMatch.housenumber;

  if (input.address1.includes(exactMatch?.housenumber))
    bestHouseNumber = exactMatch.housenumber;

  if (bestHouseNumber != null) {
    exactMatch.housenumber = bestHouseNumber;
    closeMatch.housenumber = bestHouseNumber;
  }
}

export const config = {
  properties: [
    "countrycode",
    "state",
    "county",
    "city",
    "district",
    "postcode",
    "street",
    "housenumber"
  ],
  selectStrategy: (input) => {
    if (input.country_name == "Belgium") return "ofn-be";
    else return "default";
  },
  strategies: [
    // do places not have a street
    {
      key: "ofn-be",
      preTransform: (input) => {
        if (input.country_name == "Belgium")
          input.country_name = "België / Belgique / Belgien";
      },
      tactics: ["ofn-be-locality", "ofn-be-street", "ofn-be-house",],
      postTransform: ofnBePostTransform,
    },
    // not very strict
    {
      key: "default",
      tactics: [
        "ofn-be-country",
        "ofn-be-locality",
        "ofn-be-street-and-house",
      ],
      postTransform: ofnBePostTransform,
    },
  ],
  tactics: [
    {
      key: "ofn-be-house",
      layers: ["house"],
      untilProperty: "housenumber",
      searchQuery: (input) => {
        return [input.address1, input.zipcode, input.city, input.country_name];
      },
    },
    {
      key: "ofn-be-street",
      layers: ["street"],
      untilProperty: "street",
      searchQuery: (input) => {
        return [input.address1, input.zipcode, input.city, input.country_name];
      },
      validateAgainst: (input) => { return input.address1 }
    },
    {
      key: "ofn-be-street-and-house",
      layers: ["house","street"],
      untilProperty: "housenumber",
      searchQuery: (input) => {
        return [input.address1, input.zipcode, input.city, input.country_name];
      }
    },
    {
      key: "ofn-be-locality",
      layers: ["district", "city"],
      untilProperty: "city",
      searchQuery: (input) => {
        return [input.city, input.country_name];
      },
    },
    {
      key: "ofn-be-country",
      layers: ["country"],
      untilProperty: "countrycode",
      searchQuery: (input) => {
        return [input.country_name];
      },
      postTransform: (input, features) => {
        if (features?.length == 1)
          input.country_name = features[0].properties.country;
      },
    },
  ],
};

const LimosaOfnBeConfig = () => {};
export default LimosaOfnBeConfig;
