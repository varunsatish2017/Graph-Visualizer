//Implement Graphs class to enable backend functionality

class Graph {

  #adjacencyList;
  constructor(adjList = {}) {
    this.#adjacencyList = adjList;
  }

  // Returns { dfsList, events } where events is a chronologically-sorted
  // array of { node, type: 'discover'|'finish', time } entries.
  // discoverTimes and finishTimes are populated as side-effects (same as before).
  dfs(startVertex, discoverTimes, finishTimes, parentTable) {
    let dfsList = [];
    dfsList.push(startVertex);
    
    let nodesToFinish = this.#adjacencyList[startVertex].filter(node => node !== startVertex);
    for (const neighbor of nodesToFinish) {
      parentTable[neighbor] = startVertex;
    }
    nodesToFinish.push(startVertex);

    console.log("Inital nodes to complete (DFS): " + nodesToFinish);
    let visited = [startVertex];

    let time = 1; //keeps track of discover and finish times
    discoverTimes[startVertex] = time;
    // Record discover event for startVertex
    const events = [{ node: startVertex, type: 'discover', time }];
    time += 1;

    let finished = [];
    if (nodesToFinish.length === 0) {
      finishTimes[startVertex] = time;
      events.push({ node: startVertex, type: 'finish', time });
      finished.push(startVertex);
      time += 1;
    }

    parentTable[startVertex] = null;

    while (nodesToFinish.length > 0) {
      const curr = nodesToFinish[0];
      console.log("Next: " + curr);
      if (!visited.includes(curr)) {
        discoverTimes[curr] = time;
        events.push({ node: curr, type: 'discover', time });
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
        events.push({ node: curr, type: 'finish', time });
        nodesToFinish.shift();
        finished.push(curr);
        time += 1;
      }

      const unvisitedNeighbors = this.#adjacencyList[curr].filter(node => !visited.includes(node));
      for (const neighbor of unvisitedNeighbors) {
        if (!visited.includes(neighbor)) {
          parentTable[neighbor] = curr;
          console.log(neighbor + " new parent: " + curr);
        }
      }

      nodesToFinish.unshift(...unvisitedNeighbors);
      console.log("Next nodes to complete (DFS): " + nodesToFinish);
      console.log("Visited: " + visited);
      console.log("Finished: " + finished);
    }

    // Sort events chronologically (they should already be in order, but be safe)
    events.sort((a, b) => a.time - b.time);

    console.log("Final DFS traversal: " + dfsList);
    console.log("DFS events: ", events);

    return { dfsList, events };
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