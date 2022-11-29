export function sluggify(str) {
  return str
    .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, " ") //replace all special characters | symbols with a space
    .toLowerCase()
    .replace(/^\s+|\s+$/gm, "") // trim spaces at start and end of string
    .replace(/\s+/g, "-"); // replace space with dash/hyphen
}

export function populateAreaWithins(areas) {
  for (let i = 0; i < areas.length; i++) {
    const previousAreas = areas.slice(0, i);

    if (previousAreas.length == 0) continue;

    const currentArea = areas[i];
    currentArea.geoWithins = previousAreas.map((a) => ({
      ids: a.ids,
    }));

    console.log(currentArea)
    if (currentArea.types?.includes("postal_code"))
      currentArea.geoWithins = [{ ids: areas[0].ids }];
  }
}

const LogcicaCore = () => {};
export default LogcicaCore;
