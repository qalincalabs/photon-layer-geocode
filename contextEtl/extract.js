const defaultConfig = {
  default: {
    transformOneUuid: (element, extraction, context) => {
      element.ids = [
        context.target.key +
          "/" +
          extraction.destination.key +
          "/" +
          element.id,
      ];
    },
    cleanUpOne: (element) => {
      Object.keys(element)
        .filter((k) => k != "ids")
        .forEach((key) => delete element[key]);
    },
  },
};

export function applyExtraction(context, config) {
  config = Object.assign(defaultConfig, config);

  const output = {};

  for (const ext of config.extractions) {
    const extracts = ext.extractAll(context);
    extracts.forEach((e) => {
      config.default.transformOneUuid(e, ext, config);
      if (ext.distributeRelationships != null)
        ext.distributeRelationships(e, output);
    });

    const copies = extracts.map((e) => Object.assign({}, e));

    extracts.forEach((e) => config.default.cleanUpOne(e));

    // TODO remove duplicates from copies ... consolidate ?
    output[ext.destination.key] = (output[ext.destination.key] ?? []).concat(
      copies
    );

    const a = [];

    for (const e of output[ext.destination.key]) {
      const existent = a.find((i) => i.ids.includes(e.ids[0])); // TODO not perfect
      if (existent == null) a.push(e);
      else Object.assign(existent, e);
    }

    output[ext.destination.key] = a;
  }

  return output;
}

const ContextExtract = () => {};
export default ContextExtract;
