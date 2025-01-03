class classNode {
  constructor(x, y, id) {
    this.id = id;
    this.type = ""; // Default kosong
    this.topNode = null;
    this.bottomNode = null;
    this.leftNode = null;
    this.rightNode = null;
    this.topRightNode = null;
    this.topLeftNode = null;
    this.bottomLeftNode = null;
    this.bottomRightNode = null;
    this.arrNode = [
      this.topNode,
      this.bottomNode,
      this.leftNode,
      this.rightNode,
      this.topRightNode,
      this.topLeftNode,
      this.bottomLeftNode,
      this.bottomRightNode,
    ];
    this.x = x;
    this.y = y;
  }
  updateArrNode() {
    this.arrNode = [
      this.topNode,
      this.bottomNode,
      this.leftNode,
      this.rightNode,
      this.topRightNode,
      this.topLeftNode,
      this.bottomLeftNode,
      this.bottomRightNode,
    ];
  }
}

const jmlNode = Array(5)
  .fill(null)
  .map((_, y) =>
    Array(9)
      .fill(null)
      .map((_, x) => new classNode(x, y, `${x}-${y}`))
  );

const setNodeRelationships = (grid, rows, cols) => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const node = grid[y][x];
      node.topNode = y > 0 ? grid[y - 1][x] : null;
      node.bottomNode = y < rows - 1 ? grid[y + 1][x] : null;
      node.leftNode = x > 0 ? grid[y][x - 1] : null;
      node.rightNode = x < cols - 1 ? grid[y][x + 1] : null;
      node.topLeftNode = y > 0 && x > 0 ? grid[y - 1][x - 1] : null;
      node.topRightNode = y > 0 && x < cols - 1 ? grid[y - 1][x + 1] : null;
      node.bottomLeftNode = y < rows - 1 && x > 0 ? grid[y + 1][x - 1] : null;
      node.bottomRightNode =
        y < rows - 1 && x < cols - 1 ? grid[y + 1][x + 1] : null;
      node.updateArrNode();
    }
  }
};

const setNodeRelationships2 = (grid, rows, cols) => {
  const setNode = (node, direction, y, x) => {
    node[direction] =
      y >= 0 && y < rows && x >= 0 && x < cols ? grid[y][x] : null;
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const node = grid[y][x];

      if (x >= 2 && x <= 6) {
        setNode(node, "rightNode", y, x + 1);
        setNode(node, "topNode", y - 1, x);
        setNode(node, "bottomNode", y + 1, x);
        setNode(node, "leftNode", y, x - 1);
        setNode(node, "bottomRightNode", y + 1, x + 1);
        setNode(node, "topLeftNode", y - 1, x - 1);
        setNode(node, "topRightNode", y - 1, x + 1);
        setNode(node, "bottomLeftNode", y + 1, x - 1);

        if (x === 6 && y !== 2) {
          node.rightNode = null;
          node.bottomRightNode = null;
          node.topRightNode = null;
        }

        if (x === 2 && y !== 2) {
          node.leftNode = null;
          node.topLeftNode = null;
          node.bottomLeftNode = null;
        }

        if ((y + x) % 2 === 1) {
          node.bottomRightNode = null;
          node.topLeftNode = null;
          node.topRightNode = null;
          node.bottomLeftNode = null;
        }

        node.updateArrNode();
      }
    }
  }
};

const setNodeRelationships1 = (grid, rows, cols) => {
  const setNode = (node, direction, y, x) => {
    node[direction] =
      y >= 0 && y < rows && x >= 0 && x < cols ? grid[y][x] : null;
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const node = grid[y][x];

      if (x === 1 || x === 7) {
        if (y >= 1 && y !== 3) setNode(node, "bottomNode", y + 1, x);
        if (y < 4 && y !== 1) setNode(node, "topNode", y - 1, x);

        if (y === 2) {
          setNode(node, "rightNode", y, x + 1);
          setNode(node, "leftNode", y, x - 1);
        }

        if (x === 1 && y === 1) {
          setNode(node, "bottomRightNode", y + 1, x + 1);
          setNode(node, "topLeftNode", y - 1, x - 1);
        }
        if (x === 1 && y === 3) {
          setNode(node, "topRightNode", y - 1, x + 1);
          setNode(node, "bottomLeftNode", y + 1, x - 1);
        }
        if (x === 7 && y === 1) {
          setNode(node, "topRightNode", y - 1, x + 1);
          setNode(node, "bottomLeftNode", y + 1, x - 1);
        }
        if (x === 7 && y === 3) {
          setNode(node, "bottomRightNode", y + 1, x + 1);
          setNode(node, "topLeftNode", y - 1, x - 1);
        }
      }

      if ((x === 0 || x === 8) && y % 2 === 0) {
        setNode(node, "topNode", y - 2, x);
        setNode(node, "bottomNode", y + 2, x);
      }

      if (x === 0 && y === 0) setNode(node, "bottomRightNode", y + 1, x + 1);
      if (x === 0 && y === 4) setNode(node, "topRightNode", y - 1, x + 1);
      if (x === 0 && y === 2) setNode(node, "rightNode", y, x + 1);

      if (x === 8 && y === 2) setNode(node, "leftNode", y, x - 1);
      if (x === 8 && y === 0) setNode(node, "bottomLeftNode", y + 1, x - 1);
      if (x === 8 && y === 4) setNode(node, "topLeftNode", y - 1, x - 1);

      node.updateArrNode();
    }
  }
};
