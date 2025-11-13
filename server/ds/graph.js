export class Graph {
  constructor() {
    this.adj = new Map();
  }

  addEdge(from, to, weight) {
    if (!this.adj.has(from)) this.adj.set(from, []);
    this.adj.get(from).push({ to, weight });
  }
}

// Dijkstra shortest path
export function dijkstra(graph, start) {
  const dist = new Map();
  const visited = new Set();
  dist.set(start, 0);

  let queue = [{ node: start, cost: 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { node, cost } = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);

    for (const { to, weight } of graph.adj.get(node) || []) {
      const newCost = cost + weight;
      if (newCost < (dist.get(to) || Infinity)) {
        dist.set(to, newCost);
        queue.push({ node: to, cost: newCost });
      }
    }
  }

  return dist;
}
