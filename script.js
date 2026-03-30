const cells = document.querySelectorAll(".click");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

let dificuldade = "medio";

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = cell.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    jogar(index, currentPlayer);

    if (verificarFim()) return;

    if (window.location.href.includes("ia.html")) {
      setTimeout(jogadaIA, 300);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  });
});

function jogar(index, player) {
  board[index] = player;

  const img = document.createElement("img");
  img.src = player === "X" ? "imgs/X.png" : "imgs/O.png";
  img.style.width = "80%";

  cells[index].appendChild(img);
}

function verificarFim() {
  for (let p of winPatterns) {
    const [a, b, c] = p;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;

      if (board[a] === "X") {
        scoreX++;
        document.getElementById("scoreX").innerText = scoreX;
      } else {
        scoreO++;
        document.getElementById("scoreO").innerText = scoreO;
      }

      setTimeout(resetarJogo, 1000);
      return true;
    }
  }

  if (!board.includes("")) {
    gameActive = false;

    scoreDraw++;
    document.getElementById("scoreDraw").innerText = scoreDraw;

    setTimeout(resetarJogo, 1000);
    return true;
  }

  return false;
}

function resetarJogo() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((c) => (c.innerHTML = ""));
  gameActive = true;
  currentPlayer = "X";
}

function resetarPlacar() {
  scoreX = 0;
  scoreO = 0;
  scoreDraw = 0;

  document.getElementById("scoreX").innerText = 0;
  document.getElementById("scoreO").innerText = 0;
  document.getElementById("scoreDraw").innerText = 0;
}

function jogadaIA() {
  let index;

  if (dificuldade === "facil") {
    index = jogadaAleatoria();
  } else if (dificuldade === "medio") {
    index = Math.random() < 0.5 ? jogadaAleatoria() : melhorJogada();
  } else {
    index = melhorJogada();
  }

  jogar(index, "O");

  if (verificarFim()) return;

  currentPlayer = "X";
}

function jogadaAleatoria() {
  let livres = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);
  return livres[Math.floor(Math.random() * livres.length)];
}

function melhorJogada() {
  let melhorScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, false);
      board[i] = "";

      if (score > melhorScore) {
        melhorScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(tabuleiro, isMax) {
  if (verificaVitoria("O")) return 1;
  if (verificaVitoria("X")) return -1;
  if (!tabuleiro.includes("")) return 0;

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === "") {
        tabuleiro[i] = "O";
        let score = minimax(tabuleiro, false);
        tabuleiro[i] = "";
        best = Math.max(score, best);
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 9; i++) {
      if (tabuleiro[i] === "") {
        tabuleiro[i] = "X";
        let score = minimax(tabuleiro, true);
        tabuleiro[i] = "";
        best = Math.min(score, best);
      }
    }

    return best;
  }
}

function verificaVitoria(player) {
  return winPatterns.some(
    (p) =>
      board[p[0]] === player &&
      board[p[1]] === player &&
      board[p[2]] === player,
  );
}
