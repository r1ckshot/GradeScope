import * as ort from 'onnxruntime-web'

// ort 1.14+ needs explicit WASM path — Vite doesn't resolve .wasm files automatically
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/'
ort.env.wasm.numThreads = 1

const BASE = import.meta.env.BASE_URL
const sessions = {}

function getSession(modelName) {
  if (!sessions[modelName]) {
    // Store the Promise — not the resolved session — so parallel calls share one load
    sessions[modelName] = ort.InferenceSession.create(
      `${BASE}models/${modelName}.onnx`,
      { executionProviders: ['wasm'] }
    )
  }
  return sessions[modelName]
}

// Call once at startup to load all sessions in parallel before first inference
export function preloadModels() {
  ;['random_forest', 'svm', 'knn', 'neural_network', 'anomaly'].forEach(name => getSession(name))
}

export async function runModel(modelName, features) {
  const session = await getSession(modelName)
  const tensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length])
  const feeds = { [session.inputNames[0]]: tensor }
  const results = await session.run(feeds)

  // output 0: label tensor [1]
  const prediction = Number(results[session.outputNames[0]].data[0])

  // output 1: probabilities tensor [1, 2] — zipmap=False ensures this is a plain tensor
  const probs = results[session.outputNames[1]].data
  const confidence = Number(probs[prediction])

  return { prediction, confidence }
}

export async function runAnomalyModel(features) {
  const session = await getSession('anomaly')
  const tensor = new ort.Tensor('float32', Float32Array.from(features), [1, features.length])
  const feeds = { [session.inputNames[0]]: tensor }
  const results = await session.run(feeds)
  // IsolationForest: -1 = anomaly, 1 = normal
  // int64 output may arrive as BigInt in ORT Web — Number() normalises both cases
  const raw = results[session.outputNames[0]].data[0]
  return Number(raw) < 0
}

let inferenceRunning = false

export async function runAllModels(features) {
  if (inferenceRunning) return null
  inferenceRunning = true
  try {
    // Sequential — ORT WASM allows only one session.run() at a time globally
    const rf      = await runModel('random_forest', features)
    const svm     = await runModel('svm', features)
    const knn     = await runModel('knn', features)
    const nn      = await runModel('neural_network', features)
    const anomaly = await runAnomalyModel(features)
    return { random_forest: rf, svm, knn, neural_network: nn, anomaly }
  } finally {
    inferenceRunning = false
  }
}
