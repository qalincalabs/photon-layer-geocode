export function mapContext(inputContext, config) {
  const outputContext = {};

  config.init(inputContext, outputContext);

  for (const mapping of config.mappings) {
    const mapped = inputContext[mapping.target.key].map((e) =>
      mapping.map(e, mapping.target)
    );
    outputContext[mapping.destination.key] = (
      outputContext[mapping.destination.key] ?? []
    ).concat(mapped);
  }

  return outputContext;
}

export function quickMap(targetKey, destinationKey, map) {
  return {
    target: { key: targetKey },
    destination: { key: destinationKey },
    map: map,
  };
}

const ContextMap = () => {};
export default ContextMap;
