let extractor;

async function loadModel() {
  if (!extractor) {
    // dynamically import the ESM module
    const { pipeline } = await import('@xenova/transformers');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

async function getSentenceVector(text) {
  const model = await loadModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return output.data;
}

module.exports = { getSentenceVector };
