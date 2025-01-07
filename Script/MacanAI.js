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

const cellSize = 70;
const jmlNode = Array(5)
  .fill(null)
  .map((_, y) =>
    Array(9)
      .fill(null)
      .map((_, x) => new classNode(x, y, `${x}-${y}`))
  );

let turn = 1;
let macanX = 0;
let macanY = 0;
let jumlahPion = 21;
let eatenPion = 0;
let firstClick = true;
let pionX = 0;
let pionY = 0;

const setNodeRelationships = (grid, rows, cols) => {
  const setNode = (node, direction, y, x) => {
    node[direction] =
      y >= 0 && y < rows && x >= 0 && x < cols ? grid[y][x] : null;
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const node = grid[y][x];

      // Logic from setNodeRelationships2
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
      }

      // Logic from setNodeRelationships1
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

      // Update node relationships
      node.updateArrNode();
    }
  }
};

$(document).ready(() => {
  setNodeRelationships(jmlNode, 5, 9);
  gambarUlang();

  const $highlight = $("#highlight");
  $("#rumahNya").on("mousemove", (e) => {
    if (turn === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const x = Math.floor(mouseX / cellSize);
      const y = Math.floor(mouseY / cellSize);

      if (x >= 3 && x <= 5 && y >= 1 && y <= 3 && x + 3 <= 9 && y + 3 <= 6) {
        $highlight.css({
          top: y * cellSize - cellSize + "px",
          left: x * cellSize - cellSize + "px",
          display: "block",
        });
      } else {
        $highlight.hide();
      }
    }
  });

  $("#rumahNya").on("mouseleave", () => {
    $highlight.hide();
  });
});

function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
  if (depth === 0 || checkGameOver(board)) {
    return { score: evaluateBoard(board), position: null };
  }

  let bestMove = null;

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of getAllPossibleMoves(board, "Macan")) {
      const evaluation = minimax(
        move.newBoard,
        depth - 1,
        false,
        alpha,
        beta
      ).score;
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = { ...move, score: maxEval };
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return bestMove || { score: maxEval, position: bestMove?.position || null };
  } else {
    let minEval = Infinity;
    for (const move of getAllPossibleMoves(board, "Orang")) {
      const evaluation = minimax(
        move.newBoard,
        depth - 1,
        true,
        alpha,
        beta
      ).score;
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return { score: minEval, position: bestMove?.position || null };
  }
}

function cloneBoard(board) {
  return board.map((row) =>
    row.map((node) => {
      const newNode = new classNode(node.x, node.y, node.id);
      newNode.type = node.type;
      return newNode;
    })
  );
}

function evaluateBoard(board) {
  let score = 0;
  board.flat().forEach((node) => {
    if (node.type === "Macan") {
      score += 15; // Nilai lebih besar untuk Macan
      score +=
        node.arrNode.filter((neighbor) => neighbor?.type === "Orang").length *
        5; // Bonus untuk pion dekat
    } else if (node.type === "Orang") {
      score -= 3; // Penalti untuk setiap pion
    }
  });
  return score;
}

function bestMove() {
  let bestScore = -Infinity;
  let move = null;
  const macanNode = jmlNode[macanY][macanX];

  macanNode.arrNode.forEach((neighbor) => {
    if (neighbor && neighbor.type === "") {
      // Simulasi gerakan macan
      const originalType = neighbor.type;
      neighbor.type = "Macan";
      const score = minimax(neighbor, 3, -Infinity, Infinity, false); // 3 is the depth limit
      neighbor.type = originalType; // Undo move
      if (score > bestScore) {
        bestScore = score;
        move = neighbor;
      }
    }
  });

  return move;
}

function updateTurnInfo() {
  const turnInfo = $("#turnInfo");
  if (turn % 2 === 1) {
    turnInfo.text("Giliran: Pemain 1 (Orang)");
  } else {
    turnInfo.text("Giliran: Pemain 2 (Macan)");
  }
}

function gambarUlang() {
  const canvas = document.getElementById("canvasLayer");
  const ctx = canvas.getContext("2d");
  canvas.width = 630; // Lebar grid
  canvas.height = 350; // Tinggi grid

  // Bersihkan canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar garis antara node yang terhubung
  ctx.strokeStyle = "#000"; // Warna garis
  ctx.lineWidth = 2; // Ketebalan garis
  jmlNode.flat().forEach((node) => {
    const { x, y, arrNode } = node;
    const startX = x * cellSize + cellSize / 2;
    const startY = y * cellSize + cellSize / 2;

    arrNode.forEach((neighbor) => {
      if (neighbor) {
        const endX = neighbor.x * cellSize + cellSize / 2;
        const endY = neighbor.y * cellSize + cellSize / 2;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    });
  });

  // Gambar ulang node
  $("#rumahNya").find(".node, #highlight").remove();
  $("#rumahNya").append('<div id="highlight"></div>');
  jmlNode.flat().forEach((node) => {
    const { x, y, type } = node;
    if (
      !(
        (y == 0 && x == 1) ||
        (y == 4 && x == 1) ||
        (y == 1 && x == 0) ||
        (y == 3 && x == 0) ||
        (y == 1 && x == 8) ||
        (y == 3 && x == 8) ||
        (y == 4 && x == 7) ||
        (y == 0 && x == 7)
      )
    ) {
      let backgroundImage = "";
      if (type == "Orang")
        backgroundImage = 'background-image: url("man.png");';
      else if (type == "Macan")
        backgroundImage = 'background-image: url("tiger.png");';

      $("#rumahNya").append(
        `<div onclick='cekGame(${y}, ${x})' style='top:${
          y * cellSize
        }px; left:${
          x * cellSize
        }px; ${backgroundImage} background-size:cover;' class='node'></div>`
      );
    }
  });
}

function updatePion(pion) {
  const pions = $("#pion");
  pions.text("Jumlah Pion: " + pion);
}

function updateEatenPion(eaten) {
  const eatenPion = $("#eatenPion");
  eatenPion.text("Pion yang dimakan: " + eaten);
}

function cekGerak(posisiAwalX, posisiAwalY, posisiAkhirX, posisiAkhirY) {
  const deltaX = posisiAkhirX - posisiAwalX;
  const deltaY = posisiAkhirY - posisiAwalY;

  if (deltaX === 0 && deltaY === 0) return "Tidak ada gerakan";
  if (deltaX === 0) return deltaY > 0 ? "Kanan" : "Kiri";
  if (deltaY === 0) return deltaX > 0 ? "Bawah" : "Atas";

  return deltaX > 0
    ? deltaY > 0
      ? "Serong Kanan Bawah"
      : "Serong Kiri Bawah"
    : deltaY > 0
    ? "Serong Kanan Atas"
    : "Serong Kiri Atas";
}

function getAllPossibleMoves(board, type) {
  const moves = [];
  board.flat().forEach((node) => {
    if (node.type === type) {
      node.arrNode.forEach((neighbor) => {
        if (neighbor && neighbor.type === "") {
          const newBoard = cloneBoard(board);
          newBoard[node.y][node.x].type = "";
          newBoard[neighbor.y][neighbor.x].type = type;
          moves.push({
            newBoard,
            x: neighbor.x,
            y: neighbor.y, // Tambahkan posisi (x, y)
          });
        }
      });
    }
  });
  return moves;
}

function MakanManusia(gerak, node, i, j) {
  if (!node || !gerak) return 0;

  const directionMap = {
    Kanan: "rightNode",
    Kiri: "leftNode",
    Atas: "topNode",
    Bawah: "bottomNode",
    "Serong Kanan Atas": "topRightNode",
    "Serong Kiri Atas": "topLeftNode",
    "Serong Kanan Bawah": "bottomRightNode",
    "Serong Kiri Bawah": "bottomLeftNode",
  };

  const direction = directionMap[gerak];
  if (!direction) return 0;

  let count = 0;
  let jarak = 0;
  let currentNode = node[direction];

  if (!currentNode) return "invalid";

  let id = j + "-" + i;
  let valid = false;

  if (currentNode.type === "") {
    while (currentNode && currentNode.id != id) {
      if (currentNode.type === "") jarak++;
      currentNode = currentNode[direction];
    }
    jarak++;
    return jarak === 1 ? 0 : "invalid";
  } else {
    while (currentNode) {
      if (currentNode.type === "Orang") count++;
      if (currentNode.id == id) {
        valid = true;
      }
      currentNode = currentNode[direction];
    }
  }

  if (count % 2 === 1 && valid) {
    currentNode = node[direction];
    while (currentNode) {
      if (currentNode.type === "Orang") currentNode.type = "";
      currentNode = currentNode[direction];
    }
    return count;
  }

  return "invalid";
}

function game(i, j) {
  const highlightX = parseInt($("#highlight").css("left")) / cellSize;
  const highlightY = parseInt($("#highlight").css("top")) / cellSize;
  const node = jmlNode[i][j];

  if (turn === 1) {
    for (let y = highlightY; y < highlightY + 3; y++) {
      for (let x = highlightX; x < highlightX + 3; x++) {
        if (y >= 0 && y < 5 && x >= 0 && x < 9) {
          jmlNode[y][x].type = "Orang";
          jumlahPion--;
        }
      }
    }
    turn++;
    return;
  }

  if (turn % 2 === 1) {
    if (jumlahPion !== 0) {
      if (node.type === "") {
        node.type = "Orang";
        jumlahPion--;
      } else {
        alert("Posisi sudah terisi!");
      }
    } else {
      if (firstClick) {
        pionX = i;
        pionY = j;
        firstClick = false;
        turn--;
      } else {
        jmlNode[pionX][pionY].type = "";
        node.type = "Orang";
        firstClick = true;
      }
    }
  } else {
    gerakMacan();
  }
  turn++;
}

function firstMoveTiger(board, depth = 3, alpha = -Infinity, beta = Infinity) {
  const result = minimax(board, depth, true, alpha, beta);
  return result;
}

function gerakMacan() {
  if (turn === 2) {
    const bestMove = firstMoveTiger(jmlNode, 3); // Tingkat kedalaman = 3
    if (bestMove && bestMove.position) {
      const { x, y } = bestMove.position;
      const currentNode = jmlNode[macanY][macanX];
      const nextNode = jmlNode[y][x];

      currentNode.type = ""; // Hapus macan dari node saat ini
      nextNode.type = "Macan"; // Pindahkan macan ke node baru
      macanX = x;
      macanY = y;

      eatenPion += 0; // Tidak ada pion yang dimakan di langkah pertama
    }
  } else {
    const bestMove = minimax(jmlNode, 3, true, -Infinity, Infinity);
    if (bestMove && bestMove.position) {
      const { x, y } = bestMove.position;
      const tempNode = jmlNode[macanX][macanY];
      const gerak = cekGerak(macanX, macanY, x, y);
      const makan = MakanManusia(gerak, tempNode, x, y);

      if (makan !== "invalid") {
        jmlNode[macanX][macanY].type = "";
        jmlNode[x][y].type = "Macan";
        macanX = x;
        macanY = y;
        eatenPion += makan;
      }
    }
  }
}

function cekGame(i, j) {
  if (i < 0 || i >= 5 || j < 0 || j >= 9) {
    alert("Koordinat di luar grid.");
    return;
  }

  game(i, j);

  alert("Posisi : (" + i + "," + j + ")");
  updateTurnInfo();
  updatePion(jumlahPion);
  updateEatenPion(eatenPion);
  gambarUlang();
}

function checkGameOver(board) {
  // Logic to check if the game is over
  return jumlahPion === 0 || eatenPion >= jumlahPion;
}

function Reset() {}
