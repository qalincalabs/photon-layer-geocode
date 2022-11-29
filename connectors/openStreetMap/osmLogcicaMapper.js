export const osmElementsAbreviations = {
  n: "nodes",
  w: "ways",
  r: "relationships",
};

export function getAddressText(address) {
  return (address.text =
    address.streetLine +
    ", " +
    address.postcode +
    " " +
    address.locality +
    ", " +
    address.country);
}

export const countryConfig = {
  be: {
    mappings: [
      {
        filters: {
          nominatim: {
            admin_level: 4,
          },
        },
        typeOne: "region",
        typeOther: "regions",
      },
      {
        filters: {
          nominatim: {
            admin_level: 6,
          },
          photon: {
            key: "state",
          },
        },
        typeOne: "province",
        typeOther: "provinces",
        photonTypeOther: "states",
      },

      {
        filters: {
          nominatim: {
            admin_level: 7,
          },
          photon: {
            key: "county",
          },
        },
        typeOne: "arrondissement",
        typeOther: "arrondissements",
        photonTypeOther: "counties",
      },
      {
        filters: {
          nominatim: {
            admin_level: 8,
          },
          photon: {
            key: "city",
          },
        },
        typeOne: "municipality",
        typeOther: "municipalities",
        photonTypeOther: "cities",
      },
    ],
  },
};

const OsmLogcicaMapper = () => {};
export default OsmLogcicaMapper;
