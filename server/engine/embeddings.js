// server/engine/embeddings.js
import { pipeline } from "@xenova/transformers";

let embedderPromise = null;

/**
 * Lazy-load a sentence-embedding pipeline.
 * Model: "Xenova/all-MiniLM-L6-v2" (fast, good quality)
 */
async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
}

/**
 * Create a single embedding vector for an array of strings by
 * joining them. Returns Float32Array.
 */
export async function embedText(chunks) {
  const text = Array.isArray(chunks) ? chunks.filter(Boolean).join(" | ") : String(chunks || "");
  const embedder = await getEmbedder();
  // returns [1, dim] tensor -> convert to flat array
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // Float32Array -> plain array
}

/** Cosine similarity between two vectors */
export function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
