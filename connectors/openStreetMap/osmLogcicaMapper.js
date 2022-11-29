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

const OsmLogcicaMapper = () => {};
export default OsmLogcicaMapper;
