//Implement Graphs class to enable backend functionality

class Graph {

  #adjacencyList;
  constructor(adjList = {}) {
    // TODO: Initialize the graph with the provided adjacency list
    this.#adjacencyList = adjList;
  }

  // Returns a list of vertices in DFS traversal order starting from startVertex
  dfs(startVertex) {
    // TODO: Implement DFS traversal
  }

  // Returns a list of vertices in BFS traversal order starting from startVertex
  bfs(startVertex) {
    // TODO: Implement BFS traversal
  }

  // Adds a vertex to the graph
  addVertex(vertex) {
    // TODO: Implement adding a vertex
  }

  // Removes a vertex from the graph (and all its connected edges)
  removeVertex(vertex) {
    // TODO: Implement removing a vertex
  }

  // Adds an edge between two vertices
  addEdge(source, target) {
    // TODO: Implement adding an edge
  }

  // Removes an edge between two vertices
  removeEdge(source, target) {
    // TODO: Implement removing an edge
  }

  // Returns a list of all vertices in the graph
  getVertices() {
    // TODO: Implement getting all vertices
  }

  // Returns a list of neighbors for a given vertex
  getNeighbors(vertex) {
    // TODO: Implement getting neighbors of a vertex
  }

  // Returns the adjacency list representation
  getAdjacencyList() {
    return this.#adjacencyList;
  }
}

export default Graph;