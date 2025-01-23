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

class HumanAI {
  constructor() {
    this.maxDepth = 4; // Kedalaman untuk algoritma minimax
  }

  // Evaluasi nilai untuk posisi 3x3
  evaluatePlacement(x, y, macanX, macanY) {
    let score = 0;

    // Beri nilai lebih tinggi pada area yang lebih dekat ke pusat
    const centerX = 4;
    const centerY = 2;
    const distanceFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
    score -= distanceFromCenter * 10;

    // Penalti jika area terlalu dekat dengan macan
    if (Math.abs(x - macanX) <= 2 && Math.abs(y - macanY) <= 2) {
      score -= 300; // Penalti lebih besar untuk area berbahaya
    }

    return score;
  }

  // Cari posisi terbaik untuk menempatkan pola 3x3
  findOptimalPlacement(macanX, macanY, jmlNode) {
    let bestScore = -Infinity;
    let bestPosition = null;

    for (let y = 1; y <= 5; y++) {
      for (let x = 3; x <= 7; x++) {
        // Pastikan x berada di rentang 2 hingga 6
        let score = this.evaluatePlacement(x, y, macanX, macanY);

        let isAreaEmpty = true;
        for (let dy = 0; dy < 3; dy++) {
          for (let dx = 0; dx < 3; dx++) {
            const targetY = y + dy - 1;
            const targetX = x + dx - 2;

            // Periksa apakah indeks berada dalam rentang array sebelum akses
            if (
              targetY >= 0 &&
              targetY < jmlNode.length &&
              targetX >= 0 &&
              targetX < jmlNode[0].length
            ) {
              if (jmlNode[targetY][targetX].type !== "") {
                isAreaEmpty = false;
                break;
              }
            } else {
              isAreaEmpty = false; // Jika indeks keluar dari batas, tandai area tidak kosong
              break;
            }
          }
          if (!isAreaEmpty) break;
        }

        if (isAreaEmpty && score > bestScore) {
          bestScore = score;
          bestPosition = { x, y };
        }
      }
    }

    return bestPosition;
  }

  // Tempatkan pion dalam pola 3x3 di posisi optimal
  placeInitial3x3(macanX, macanY, jmlNode, jumlahPion, pionDiPapan) {
    const bestPosition = this.findOptimalPlacement(macanX, macanY, jmlNode);

    if (bestPosition) {
      const { x, y } = bestPosition;

      for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 3; dx++) {
          jmlNode[y + dy - 1][x + dx - 2].type = "Orang"; // Disesuaikan dengan rentang x
        }
      }

      jumlahPion -= 9;
      pionDiPapan += 9;
    }

    return { jmlNode, jumlahPion, pionDiPapan };
  }

  // Evaluasi skor papan saat ini
  evaluateBoard(state, jmlNode) {
    let score = 0;

    // Penalti jika terlalu banyak pion manusia termakan
    score -= state.eatenPion * 500; // Penalti lebih besar untuk pion termakan

    // Hadiah jika pion mengontrol pusat papan
    const centerX = 4;
    const centerY = 2;
    jmlNode.flat().forEach((node) => {
      if (node.type === "Orang") {
        const distanceFromCenter =
          Math.abs(node.x - centerX) + Math.abs(node.y - centerY);
        score += Math.max(0, 20 - distanceFromCenter * 5);
      }
    });

    // Penalti jika pion terlalu sedikit
    score -= (21 - state.pionDiPapan) * 20;

    // Hadiah jika banyak pion manusia menekan macan
    const validMovesForTiger = this.findValidMovesAndCount(
      state.macanX,
      state.macanY,
      jmlNode
    );
    score -= validMovesForTiger.length * 20; // Penalti lebih kecil untuk langkah macan

    // Penalti jika macan dapat memakan pion manusia
    validMovesForTiger.forEach((move) => {
      if (move.orangCount > 0) {
        score -= move.orangCount * 500; // Penalti lebih besar untuk pion yang dapat dimakan
      }
    });

    return score;
  }

  // Algoritma minimax untuk langkah optimal
  minimax(depth, alpha, beta, isMaximizing, state, jmlNode) {
    if (depth === 0) {
      return this.evaluateBoard(state, jmlNode);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;

      const possibleMoves = this.getPossibleMoves(jmlNode);

      for (const move of possibleMoves) {
        const newState = {
          ...state,
          pionDiPapan: state.pionDiPapan + 1,
        };

        const evalScore = this.minimax(
          depth - 1,
          alpha,
          beta,
          false,
          newState,
          jmlNode
        );
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);

        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;

      const validMoves = this.findValidMovesAndCount(
        state.macanX,
        state.macanY,
        jmlNode
      );
      for (const move of validMoves) {
        const newState = {
          macanX: move.node.y,
          macanY: move.node.x,
          pionDiPapan: state.pionDiPapan - move.orangCount,
          eatenPion: state.eatenPion + move.orangCount,
        };

        const evalScore = this.minimax(
          depth - 1,
          alpha,
          beta,
          true,
          newState,
          jmlNode
        );
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);

        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Cari semua langkah valid untuk manusia
  getPossibleMoves(jmlNode) {
    const moves = [];
    jmlNode.flat().forEach((node) => {
      if (node.type === "") {
        moves.push(node);
      }
    });
    return moves;
  }

  // Cari langkah terbaik untuk manusia
  getBestMove(state, jmlNode) {
    let bestMove = null;
    let bestValue = -Infinity;

    const possibleMoves = this.getPossibleMoves(jmlNode);
    for (const move of possibleMoves) {
      const newState = {
        ...state,
        pionDiPapan: state.pionDiPapan + 1,
      };

      const moveValue = this.minimax(
        this.maxDepth,
        -Infinity,
        Infinity,
        false,
        newState,
        jmlNode
      );

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // HumanAI membuat langkah optimal
  makeMove(state, jmlNode) {
    const bestMove = this.getBestMove(state, jmlNode);

    if (bestMove) {
      bestMove.type = "Orang";
      state.jumlahPion--;
      state.pionDiPapan++;
      return bestMove;
    } else {
      alert("Tidak ada langkah yang dapat dimainkan!");
    }
  }

  // Cari langkah valid untuk macan
  findValidMovesAndCount(macanX, macanY, jmlNode) {
    const moves = [];
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    directions.forEach(({ dx, dy }) => {
      const nx = macanX + dx;
      const ny = macanY + dy;
      if (nx >= 0 && nx < jmlNode[0].length && ny >= 0 && ny < jmlNode.length) {
        const target = jmlNode[ny][nx];
        if (target.type === "Orang") {
          moves.push({ node: target, orangCount: 1 });
        } else if (target.type === "") {
          moves.push({ node: target, orangCount: 0 });
        }
      }
    });

    return moves;
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

function game(i, j) {
  const highlightX = parseInt($("#highlight").css("left")) / cellSize;
  const highlightY = parseInt($("#highlight").css("top")) / cellSize;
  const node = jmlNode[i][j];

  // Giliran pertama: HumanAI menempatkan pola 3x3
  if (turn === 1) {
    const humanAI = new HumanAI();
    humanAI.placeInitial3x3(macanX, macanY, jmlNode); // Tempatkan pola 3x3 otomatis
    turn++; // Pindah giliran ke macan
    return;
  }

  // Giliran manusia
  if (turn % 2 === 1) {
    if (jumlahPion > 0) {
      // HumanAI memilih langkah optimal
      const humanAI = new HumanAI();
      const currentState = {
        macanX: macanX,
        macanY: macanY,
        pionDiPapan: pionDiPapan,
        eatenPion: eatenPion,
      };

      const bestMove = humanAI.getBestMove(currentState, jmlNode); // Langkah otomatis HumanAI
      console.log(bestMove);
      if (bestMove) {
        bestMove.type = "Orang";
        jumlahPion--;
        pionDiPapan++;
      }
    } else {
      // Jika semua pion sudah ditempatkan, pindahkan pion manusia
      if (firstClick) {
        pionX = i;
        pionY = j;
        firstClick = false;
        turn--; // Tetap di giliran yang sama untuk klik kedua
      } else {
        jmlNode[pionX][pionY].type = ""; // Hapus pion dari posisi awal
        node.type = "Orang"; // Pindahkan pion ke posisi baru
        firstClick = true;
      }
    }
  }
  // Giliran macan
  else {
    if (turn === 2) {
      // Langkah pertama macan: tempatkan macan di posisi awal
      if (node.type === "") {
        node.type = "Macan";
        macanX = i;
        macanY = j;
      } else {
        alert("Posisi sudah terisi!");
      }
    } else {
      // Langkah berikutnya untuk macan
      if (node.type === "") {
        const tempNode = jmlNode[macanX][macanY];
        const gerak = cekGerak(macanX, macanY, i, j);
        const makan = MakanManusia(gerak, tempNode, i, j);

        if (makan === "invalid") {
          turn--; // Tetap di giliran macan jika langkah tidak valid
        } else {
          jmlNode[macanX][macanY].type = ""; // Hapus macan dari posisi awal
          node.type = "Macan"; // Pindahkan macan ke posisi baru
          macanX = i;
          macanY = j;
          eatenPion += makan; // Tambahkan pion yang dimakan
          pionDiPapan -= makan; // Kurangi pion di papan

          // Periksa apakah macan menang
          let totalPion = pionDiPapan + jumlahPion;
          if (totalPion < 14) {
            cekMenang("Macan");
          }
        }
      } else {
        alert("Posisi sudah terisi!");
      }
    }
  }
  turn++; // Pindah giliran berikutnya
}

function cekGame(i, j) {
  if (i < 0 || i >= 5 || j < 0 || j >= 9) {
    alert("Koordinat di luar grid.");
    return;
  }

  game(i, j);

  let validMoves = null;

  if (turn % 2 == 0 && turn != 2) {
    validMoves = findValidMovesAndCount(macanX, macanY);
    if (validMoves.length == 0) {
      cekMenang("Orang");
    }
  } else {
    validMoves = null;
  }
  updateTurnInfo();
  updatePion(jumlahPion);
  updateEatenPion(eatenPion);
  updatePionDiPapan(pionDiPapan);
  gambarUlang(validMoves);
}

function cekMenang(type) {
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
