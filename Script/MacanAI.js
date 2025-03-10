// Definisi Kelas classNode
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
let jmlNode = Array(5)
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
let pionDiPapan = 0;

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
  let a = null;
  setNodeRelationships(jmlNode, 5, 9);
  gambarUlang(a);

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

function findValidMovesAndCount(macanX, macanY) {
  const macanNode = jmlNode[macanX][macanY];
  const validMoves = [];

  const directionMap = [
    "topNode",
    "bottomNode",
    "leftNode",
    "rightNode",
    "topRightNode",
    "topLeftNode",
    "bottomLeftNode",
    "bottomRightNode",
  ];

  macanNode.arrNode.forEach((neighbor, index) => {
    if (!neighbor) return;

    if (neighbor.type === "") {
      validMoves.push({ node: neighbor, orangCount: 0 });
    } else if (neighbor.type === "Orang") {
      const direction = directionMap[index];
      let currentNode = neighbor[direction];
      let orangCount = 1;

      while (currentNode) {
        if (currentNode.type === "") {
          if (orangCount % 2 !== 0) {
            validMoves.push({ node: currentNode, orangCount });
          }
          break;
        } else if (currentNode.type === "Orang") {
          orangCount++;
          currentNode = currentNode[direction];
        } else {
          break;
        }
      }
    }
  });

  return validMoves;
}

function updateTurnInfo() {
  const turnInfo = $("#turnInfo");
  if (turn % 2 === 1) {
    turnInfo.text("Giliran: Pemain 1 (Orang)");
  } else {
    turnInfo.text("Giliran: Pemain 2 (Macan)");
  }
}

function gambarUlang(validMoves) {
  const canvas = document.getElementById("canvasLayer");
  const ctx = canvas.getContext("2d");
  canvas.width = 630; // Lebar grid
  canvas.height = 350; // Tinggi grid

  // Bersihkan canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar garis antara node yang terhubung
  ctx.strokeStyle = "#000"; // Warna garis
  ctx.lineWidth = 2; // Ketebalan garis

  jmlNode.flat().forEach(({ x, y, arrNode }) => {
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

  // Clear and redraw nodes
  const rumahNya = $("#rumahNya");
  rumahNya.find(".node, #highlight").remove();
  rumahNya.append('<div id="highlight"></div>');

  jmlNode.flat().forEach(({ x, y, type, id }) => {
    if (
      !(
        (y === 0 && x === 1) ||
        (y === 4 && x === 1) ||
        (y === 1 && x === 0) ||
        (y === 3 && x === 0) ||
        (y === 1 && x === 8) ||
        (y === 3 && x === 8) ||
        (y === 4 && x === 7) ||
        (y === 0 && x === 7)
      )
    ) {
      let backgroundColor = "background-color: yellow;";
      if (validMoves?.some((node) => id === node.node.id)) {
        backgroundColor = "background-color: red;";
      }

      const backgroundImage =
        type === "Orang"
          ? 'background-image: url("man.png");'
          : type === "Macan"
          ? 'background-image: url("tiger.png");'
          : "";

      rumahNya.append(
        `<div onclick='cekGame(${y}, ${x})'
                          style='top:${y * cellSize}px; left:${x * cellSize}px;
                                 ${backgroundImage} ${backgroundColor} background-size:cover;'
                          class='node' data-x='${x}' data-y='${y}'></div>`
      );
    }
  });
}

function updatePion(pion) {
  const pions = $("#pion");
  pions.text("Jumlah Pion: " + pion);
}

function updatePionDiPapan(pionDiPapan) {
  const pions = $("#pion2");
  pions.text("Pion Di Papan : " + pionDiPapan);
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

class GameAI {
  constructor() {
    this.maxDepth = 4;
  }

  evaluateBoard(state) {
    let score = 0;

    // Heavily reward eating pawns
    score += state.eatenPion * 150;

    // Center control is important
    const centerX = 4;
    const centerY = 2;
    const distanceFromCenter =
      Math.abs(state.macanY - centerX) + Math.abs(state.macanX - centerY);

    // Stronger penalty for being away from center
    score -= distanceFromCenter * 15;

    // Reward positions that control multiple directions
    const validMoves = findValidMovesAndCount(state.macanX, state.macanY);
    score += validMoves.length * 20;

    // Reward positions that threaten multiple pawns
    const threatCount = validMoves.reduce(
      (acc, move) => acc + (move.orangCount > 0 ? 1 : 0),
      0
    );
    score += threatCount * 30;

    // Penalize if too many pawns are on board
    score -= state.pionDiPapan * 20;

    // Extra reward for getting close to winning condition
    if (state.pionDiPapan + (21 - state.eatenPion) < 15) {
      score += 200;
    }

    return score;
  }

  minimax(depth, alpha, beta, isMaximizing, state) {
    if (depth === 0) {
      return this.evaluateBoard(state);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      const validMoves = findValidMovesAndCount(state.macanX, state.macanY);

      // Sort moves to improve alpha-beta pruning
      validMoves.sort((a, b) => b.orangCount - a.orangCount);

      if (validMoves.length === 0) return -10000;

      for (const move of validMoves) {
        const newState = {
          macanX: move.node.y,
          macanY: move.node.x,
          pionDiPapan: state.pionDiPapan - move.orangCount,
          eatenPion: state.eatenPion + move.orangCount,
        };

        const evalScore = this.minimax(depth - 1, alpha, beta, false, newState);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);

        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      // Consider more sophisticated human moves
      const possibleMoves = this.getAdvancedHumanMoves(state);

      if (possibleMoves.length === 0) return 10000;

      for (const move of possibleMoves) {
        const newState = {
          ...state,
          pionDiPapan: Math.min(state.pionDiPapan + 1, 21),
        };

        const evalScore = this.minimax(depth - 1, alpha, beta, true, newState);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);

        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  getAdvancedHumanMoves(state) {
    const moves = [];
    // Consider all possible positions where human can place pawns
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 9; j++) {
        if (jmlNode[i][j].type === "") {
          moves.push({ x: i, y: j });
        }
      }
    }
    return moves;
  }

  getBestPositionForTiger(state) {
    let bestScore = -Infinity;
    let bestPosition = null;

    jmlNode.flat().forEach((node) => {
      if (node.type === "") {
        // Create a temporary state reflecting the tiger being placed at the current node
        const newState = {
          macanX: node.y,
          macanY: node.x,
          pionDiPapan: state.pionDiPapan,
          eatenPion: state.eatenPion,
        };

        // Evaluate the position using minimax
        const score = this.minimax(
          this.maxDepth,
          -Infinity,
          Infinity,
          false,
          newState
        );

        if (score > bestScore) {
          bestScore = score;
          bestPosition = node;
        }
      }
    });

    return bestPosition;
  }

  getBestMove(state) {
    let bestMove = null;
    let bestValue = -Infinity;
    const validMoves = findValidMovesAndCount(state.macanX, state.macanY);

    // Sort moves to improve alpha-beta pruning
    validMoves.sort((a, b) => b.orangCount - a.orangCount);

    for (const move of validMoves) {
      const newState = {
        macanX: move.node.y,
        macanY: move.node.x,
        pionDiPapan: state.pionDiPapan - move.orangCount,
        eatenPion: state.eatenPion + move.orangCount,
      };

      const moveValue = this.minimax(
        this.maxDepth,
        -Infinity,
        Infinity,
        false,
        newState
      );

      // Prioritize moves that eat pawns when scores are equal
      if (
        moveValue > bestValue ||
        (moveValue === bestValue && move.orangCount > 0)
      ) {
        bestValue = moveValue;
        bestMove = move;
      }
    }

    return bestMove;
  }
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
          pionDiPapan++;
        }
      }
    }
    turn++;

    const ai = new GameAI();

    const currentState = {
      pionDiPapan: pionDiPapan,
      eatenPion: eatenPion,
    };
    const bestPosition = ai.getBestPositionForTiger(currentState);

    if (bestPosition) {
      bestPosition.type = "Macan";
      macanX = bestPosition.y;
      macanY = bestPosition.x;
      turn++;
    }

    return;
  }

  if (turn % 2 === 1) {
    if (jumlahPion !== 0) {
      if (node.type === "") {
        node.type = "Orang";
        jumlahPion--;
        pionDiPapan++;
        gerakMacan(node);
      } else {
        alert("Posisi sudah terisi!");
        turn--;
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
        gerakMacan(node);
      }
    }
  } else {
    if (
      macanX === 0 &&
      macanY === 0 &&
      jmlNode[macanX][macanY].type !== "Macan"
    ) {
      if (node.type === "") {
        node.type = "Macan";
        macanX = i;
        macanY = j;
      } else {
        alert("Posisi sudah terisi!");
        turn--;
        return;
      }
    }
  }
  turn++;
}

function gerakMacan(node) {
  const ai = new GameAI();
  const currentState = {
    macanX: macanX,
    macanY: macanY,
    pionDiPapan: pionDiPapan,
    eatenPion: eatenPion,
  };

  const bestMove = ai.getBestMove(currentState);

  if (bestMove) {
    const tempNode = jmlNode[macanX][macanY];
    const gerak = cekGerak(macanX, macanY, bestMove.node.y, bestMove.node.x);
    const makan = MakanManusia(
      gerak,
      tempNode,
      bestMove.node.y,
      bestMove.node.x
    );

    if (makan !== "invalid") {
      jmlNode[macanX][macanY].type = "";
      jmlNode[bestMove.node.y][bestMove.node.x].type = "Macan";
      macanX = bestMove.node.y;
      macanY = bestMove.node.x;
      eatenPion += makan;
      pionDiPapan -= makan;

      if (pionDiPapan + jumlahPion < 14) {
        cekMenang("Macan");
      }
    } else {
      turn--;
      return;
    }
  } else {
    turn--;
    return;
  }
  turn++;
}

function cekGame(i, j) {
  if (i < 0 || i >= 5 || j < 0 || j >= 9) {
    alert("Koordinat di luar grid.");
    return;
  }

  game(i, j);

  let validMoves = null;
  gambarUlang(validMoves);

  if (turn % 2 == 1 && turn != 2) {
    validMoves = findValidMovesAndCount(macanX, macanY);
    if (validMoves.length == 0) {
      cekMenang("Orang");
    }
  }
  updateTurnInfo();
  updatePion(jumlahPion);
  updateEatenPion(eatenPion);
  updatePionDiPapan(pionDiPapan);
}

function cekMenang(type) {
  gambarUlang(null);
  if (type == "Orang") {
    alert("Orang Menang");
    Reset();
  }

  if (type == "Macan") {
    alert("Macan Menang");
    Reset();
  }
}

function Reset() {
  location.reload();
}
