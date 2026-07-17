//Implement Graphs class to enable backend functionality

class Graph {

  #adjacencyList;
  constructor(adjList = {}) {
    this.#adjacencyList = adjList;
  }

  // Returns a list of vertices in DFS traversal order starting from startVertex
  dfs(startVertex, discoverTimes, finishTimes, parentTable) {
    let dfsList = [];
    dfsList.push(startVertex);
    
    let nodesToFinish = this.#adjacencyList[startVertex].filter(node => node !== startVertex);
    for (const neighbor of nodesToFinish) {
      parentTable[neighbor] = startVertex;
    }
    nodesToFinish.push(startVertex);

    //finish traversal by popping first node off "nodesToComplete",
    //pushing that to dfsList, and then adding that node's neighbors to
    //the start of nodesToComplete ... repeats until nodesToComplete
    //is empty

    console.log("Inital nodes to complete (DFS): " + nodesToFinish);
    let visited = [startVertex];

    let time = 1; //keeps track of discover and finish times
    discoverTimes[startVertex] = time;
    time += 1;

    let finished = [];
    if (nodesToFinish.length === 0) {
      finishTimes[startVertex] = time;
      finished.push(startVertex);
      time += 1;
    }

    //NEW Approach: Only pop from list when node is finished, not 
    //just discovered

    parentTable[startVertex] = null;

    while (nodesToFinish.length > 0) {
      const curr = nodesToFinish[0];
      console.log("Next: " + curr);
      if (!visited.includes(curr)) {
        discoverTimes[curr] = time;
        time += 1;
        visited.push(curr);
        dfsList.push(curr);
      }

      //If "next"s adj is empty OR all neighbors are in visited...
      //then finishTimes[next] = time AND time += 1
      if (this.#adjacencyList[curr].length === 0 || 
          this.#adjacencyList[curr].every(neighbor => visited.includes(neighbor))
      ) {
        finishTimes[curr] = time;
        nodesToFinish.shift();
        finished.push(curr);
        time += 1;
      }

      const unvisitedNeighbors = this.#adjacencyList[curr].filter(node => !visited.includes(node));
      for (const neighbor of unvisitedNeighbors) {
        //this loop will overwrite a node's parent such that its parent
        //is the latest one that "reached it"
        parentTable[neighbor] = curr;
        console.log(neighbor + " new parent: " + curr);
      }

      nodesToFinish.unshift(...unvisitedNeighbors);
      console.log("Next nodes to complete (DFS): " + nodesToFinish);
      console.log("Visited: " + visited);
      console.log("Finished: " + finished);

    }

    console.log("Final DFS traversal: " + dfsList);

    return dfsList;

  }

  // Returns a list of vertices in BFS traversal order starting from startVertex
  bfs(startVertex, distancesTable, parentsMap) {
    let bfsList = [];
    let notDone = [startVertex]; // queue for BFS
    let visited = new Set([startVertex]); // track visited to prevent cycles

    distancesTable[startVertex] = 0;
    parentsMap[startVertex] = null;

    while (notDone.length > 0) {
      const curr = notDone.shift();
      bfsList.push(curr);

      const neighbors = this.#adjacencyList[curr] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          parentsMap[neighbor] = curr;
          distancesTable[neighbor] = distancesTable[curr] + 1;
          visited.add(neighbor);
          notDone.push(neighbor); // push individual nodes, not arrays
        }
      }
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
    return Object.keys(this.#adjacencyList);
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