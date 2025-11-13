import { Graph } from "../ds/graph.js";

// Graph of prerequisite → advanced skill with effort hours (weight)
export const skillGraph = new Graph();

// Example path for Data Science
skillGraph.addEdge("Python Basics", "Python", 5);
skillGraph.addEdge("Python", "Data Analysis", 8);
skillGraph.addEdge("Data Analysis", "Machine Learning", 12);
skillGraph.addEdge("Machine Learning", "Deep Learning", 20);

// Example path for Web Dev
skillGraph.addEdge("HTML", "CSS", 4);
skillGraph.addEdge("CSS", "JavaScript", 8);
skillGraph.addEdge("JavaScript", "React", 12);
skillGraph.addEdge("React", "Next.js", 15);
