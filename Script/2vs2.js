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
    return;
  }

  if (turn % 2 === 1) {
    if (jumlahPion !== 0) {
      if (node.type === "") {
        node.type = "Orang";
        jumlahPion--;
        pionDiPapan++;
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
    if (turn == 2) {
      if (node.type === "") {
        node.type = "Macan";
        macanX = i;
        macanY = j;
      } else {
        alert("Posisi sudah terisi!");
      }
    } else {
      if (node.type === "") {
        const tempNode = jmlNode[macanX][macanY];
        const gerak = cekGerak(macanX, macanY, i, j);
        const makan = MakanManusia(gerak, tempNode, i, j);
        if (makan === "invalid") {
          turn--;
        } else {
          jmlNode[macanX][macanY].type = "";
          node.type = "Macan";
          macanX = i;
          macanY = j;
          eatenPion += makan;
          pionDiPapan -= makan;

          let totalPion = pionDiPapan + jumlahPion;
          console.log(totalPion);
          if (totalPion < 14) {
            cekMenang("Macan");
          }
        }
      } else {
        alert("Posisi sudah terisi!");
      }
    }
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
    console.log("test");
    alert("Macan Menang");
    Reset();
  }
}

function Reset() {
  location.reload();
}
