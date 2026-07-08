//Implement Graphs class to enable backend functionality

class Graph {

  #adjacencyList;
  constructor(adjList = {}) {
    this.#adjacencyList = adjList;
  }

  // Returns a list of vertices in DFS traversal order starting from startVertex
  dfs(startVertex) {
    // Pre-order DFS Traversal
    dfsList = [];
    dfsList.push(startVertex);
    nodesToComplete = this.#adjacencyList[startVertex].filter(node => node !== startVertex);

    //finish traversal by popping first node off "nodesToComplete",
    //pushing that to dfsList, and then adding that node's neighbors to
    //the start of nodesToComplete ... repeats until nodesToComplete
    //is empty

  }

  // Returns a list of vertices in BFS traversal order starting from startVertex
  bfs(startVertex) {
    bfsList = [];
    notDone = [];
    numVertices = this.getVertices().length;
    bfsList.push(startVertex);
    notDone.push(this.#adjacencyList[startVertex]);
    while (notDone.length > 0 && bfsList.length < numVertices) {
      const curr = notDone.shift();
      bfsList.push(curr);
      notDone.push(this.#adjacencyList[curr]);
    }
    return bfsList;
  }

  // Adds a vertex to the graph
  addVertex(vertex) {
    this.#adjacencyList[vertex] = [];
  }

  // Removes a vertex from the graph (and all its connected edges)
  removeVertex(vertex) {
    delete this.#adjacencyList[vertex];
    //iterate through remaining keys and remove vertex from their respective adjacency lists
    Object.keys(this.#adjacencyList).forEach(key => {
      this.#adjacencyList[key] = this.#adjacencyList[key].filter(v => v !== vertex);
    });
  }

  // Adds an edge between two vertices
  addEdge(source, target) {
    this.#adjacencyList[source].push(target);
    this.#adjacencyList[target].push(source);
  }

  // Removes an edge between two vertices
  removeEdge(source, target) {
    this.#adjacencyList[source] = this.#adjacencyList[source].filter(targ => targ !== target);
    this.#adjacencyList[target] = this.#adjacencyList[target].filter(src => src !== source);
  }

  // Returns a list of all vertices in the graph
  getVertices() {
    return this.#adjacencyList.keys();
  }

  // Returns a list of neighbors for a given vertex
  getNeighbors(vertex) {
    return this.#adjacencyList[vertex];
  }

  // Returns the adjacency list representation
  getAdjacencyList() {
    return this.#adjacencyList;
  }
}

export default Graph;