<template>
  <div>
    <div class="bot" id="bot">
      <div class="board" id="board">
        <div class="scale">
          <div class="cube" id="cube">
            <div class="side pawn">
              <div class="target pawn"></div>
              <div class="chess-piece pawn"></div>
            </div>
            <div class="side knight">
              <div class="target knight"></div>
              <div class="chess-piece knight"></div>
            </div>
            <div class="side rook">
              <div class="target rook"></div>
              <div class="chess-piece rook"></div>
            </div>
            <div class="side bishop">
              <div class="target bishop"></div>
              <div class="chess-piece bishop"></div>
            </div>
            <div class="side queen">
              <div class="target queen"></div>
              <div class="chess-piece queen"></div>
            </div>
            <div class="side king">
              <div class="target king"></div>
              <div class="chess-piece king"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top" id="top">
      <div class="grid" id="grid">
        <h1>Pieces</h1>
        <div class="piece pawn" id="p-pawn" data-piece="pawn"></div>
        <div class="piece knight" id="p-knight" data-piece="knight"></div>
        <div class="piece rook" id="p-rook" data-piece="rook"></div>
        <div class="piece bishop" id="p-bishop" data-piece="bishop"></div>
        <div class="piece queen" id="p-queen" data-piece="queen"></div>
        <div class="piece king" id="p-king" data-piece="king"></div>
      </div>
    </div>
  </div>
</template>

<script>

const pieces = gsap.utils.toArray(".piece");
const topEl = document.getElementById("top");
const gridItems = Array.from(document.getElementById("grid").children);

const slide = (event) => {
  // first
  const states = gridItems.map((el) => Flip.getState(el));
  const topState = Flip.getState(topEl);
  // last
  topEl.classList.add("side");
  gsap.set(pieces, { "transition-duration": "0.3s" });
  // Play
  Flip.from(topState, {
    duration: 1,
    delay: 0.4 + 0.1 * 5,
    ease: "back.out(1.7)"
  });
  states.forEach((state, i) => {
    Flip.from(state, {
      duration: 0.4,
      scale: i > 0,
      delay: 0.1 * i,
      ease: "power2.easeIn"
    });
  });
};

let selected, aniID;

const board = document.getElementById("cube");

const rotateBoard = (id) => {
  id = id.replace("p-", "");

  let coords = {
    pawn: [0, 0],
    queen: [0, 1],
    king: [1, 0],
    bishop: [0, 2],
    knight: [-1, 0],
    rook: [0, -1]
  }[id];

  gsap.to(".scale", {
    ease: "sine.inOut",
    delay: selected ? 0 : 0.6,
    keyframes: [
      { scale: 0.8, duration: 0.2 },
      { duration: 0.8 },
      { scale: 1, duration: 0.2 }
    ]
  });

  gsap.to(board, {
    ease: "sine.inOut",
    delay: selected ? 0 : 0.6,
    onComplete: function () {
      if (aniID) {
        aniID = id;
      } else {
        aniID = id;
        runAnimation();
      }
    },
    keyframes: [
      { duration: 0.2 },
      {
        duration: 0.8,
        rotateX: 90 * coords[0],
        rotateY: 90 * coords[1]
      }
    ]
  });
};

pieces.forEach((el) => {
  el.addEventListener("click", (e) => {
    if (selected) {
      selected.classList.remove("selected");
    }
    !selected && slide(e);
    if (selected !== el) {
      rotateBoard(el.id);
      el.classList.add("selected");
      selected = el;
    }
  });
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getPossibleMoves(piece) {
  // grid size
  let g = 7;
  // piece position
  let x = piece.pos[0],
      y = piece.pos[1];

  // options:
  let opts = [
    // 0: top left
    Math.min(y, x) - 1,
    // 1: top
    y - 1,
    // 2: top right
    Math.min(y, g + 1 - x) - 1,
    // 3: right
    g - x,
    // 4: bottom right
    g - Math.max(y, x),
    // 5: bottom
    g - y,
    // 6: bottom left
    g - Math.max(y, g + 1 - x),
    // 7: left
    x - 1
  ];

  // moves
  let moves = [];
  for (let i = 0; i < piece.dirs.length; i++) {
    if (opts[piece.dirs[i]] > (piece.min || 0)) {
      moves.push({
        dir: piece.dirs[i],
        dis: opts[piece.dirs[i]]
      });
    }
  }
  return moves;
}

function updatePiecePosition(piece, move, dis = 1) {
  if (piece.range >= move.dis) {
    dis = getRandomInt(1, move.dis + 1);
  }
  switch (move.dir) {
    case 0: // top left
      piece.pos[0] -= dis;
      piece.pos[1] -= dis;
      break;
    case 1: // top
      piece.pos[1] -= dis;
      break;
    case 2: // top right
      piece.pos[0] += dis;
      piece.pos[1] -= dis;
      break;
    case 3: // right
      piece.pos[0] += dis;
      break;
    case 4: // bottom right
      piece.pos[0] += dis;
      piece.pos[1] += dis;
      break;
    case 5: // bottom
      piece.pos[1] += dis;
      break;
    case 6: // bottom left
      piece.pos[0] -= dis;
      piece.pos[1] += dis;
      break;
    case 7: // left
      piece.pos[0] -= dis;
      break;
  }
}

const chessPieces = {
  pawn: {
    pos: [2, 2],
    d: 1,
    move() {
      if (this.pos[1] === 2) {
        this.d = 1;
        this.pos[1] += 2;
      } else {
        this.pos[1] += this.d;
      }
      if (this.pos[1] === 7) {
        this.d = -1;
      }
    }
  },
  knight: {
    pos: [4, 4],
    dirs: [0, 2, 4, 6],
    min: 2,
    move() {
      let moves = getPossibleMoves(this);
      let move = moves[getRandomInt(0, moves.length)];
      let x = getRandomInt(1, 3);
      let y = 3 - x;
      let xm = move.dir === 0 || move.dir === 6 ? -1 : 1;
      let ym = move.dir < 4 ? -1 : 1;
      this.pos[0] += x * xm;
      this.pos[1] += y * ym;
    }
  },
  rook: {
    pos: [4, 4],
    range: 7,
    dirs: [1, 3, 5, 7],
    move() {
      let moves = getPossibleMoves(this);
      let move = moves[getRandomInt(0, moves.length)];
      updatePiecePosition(this, move);
    }
  },
  bishop: {
    pos: [4, 4],
    range: 7,
    dirs: [0, 2, 4, 6],
    move() {
      let moves = getPossibleMoves(this);
      let move = moves[getRandomInt(0, moves.length)];
      updatePiecePosition(this, move);
    }
  },
  queen: {
    pos: [4, 4],
    range: 7,
    dirs: [0, 1, 2, 3, 4, 5, 6, 7],
    move() {
      let moves = getPossibleMoves(this);
      let move = moves[getRandomInt(0, moves.length)];
      updatePiecePosition(this, move);
    }
  },
  king: {
    pos: [4, 4],
    range: 1,
    dirs: [0, 1, 2, 3, 4, 5, 6, 7],
    move() {
      let moves = getPossibleMoves(this);
      let move = moves[getRandomInt(0, moves.length)];
      updatePiecePosition(this, move);
    }
  }
};

const getArea = (arr) => `${arr[1]} / ${arr[0]}`;

function runAnimation() {
  // call the update
  chessPieces[aniID].move();
  // get state
  let t = document.querySelector(`.target.${aniID}`),
      p = document.querySelector(`.chess-piece.${aniID}`);
  let tState = Flip.getState(t),
      pState = Flip.getState(p);
  // move the target to the next spot
  // move the piece to the next spot
  t.style.gridArea = getArea(chessPieces[aniID].pos);
  p.style.gridArea = getArea(chessPieces[aniID].pos);
  // flip
  Flip.from(tState, { duration: 0.5, ease: "power2.in" });
  Flip.from(pState, { duration: 0.75, delay: 0.4, ease: "sine.inOut" });
  // repeat
  setTimeout(runAnimation, 2000);
}

export default {
  name: "ChessComponent"
}
</script>

<style  lang="scss">
    :root {
      --purple: #a63bf3;
      --dark: #25075c;
      --teal: #24c4ee;
      --red: #f71584;
      --pink: #fd88fc;
      --blue: #45ccd8;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-size: 16px;
      font-family: "Orbitron", sans-serif;
    }

    .bot,
    .top {
      display: grid;
      place-items: center;
      height: 100vh;
      width: 100%;
      position: absolute;
    }

    .bot {
      background-color: var(--pink);
      padding-left: 100px;
      --s: min(10vw, 10vh);

    .scale {
      position: relative;
      width: calc(7 * var(--s));
      height: calc(7 * var(--s));
      display: grid;
      place-items: center;
    }

    .board {
      position: relative;
      display: grid;
      place-items: center;
      width: calc(7 * var(--s));
      height: calc(7 * var(--s));
      perspective: 1200px;
      perspective-origin: center;
    }

    .cube {
      position: absolute;
      transform-style: preserve-3d;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      transform-origin: calc(var(--s) * 3.5) calc(var(--s) * 3.5)
      calc(var(--s) * -3.5);
    }

    .side {
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      position: absolute;
      background-image: linear-gradient(var(--pink) 1px, transparent 1px),
      linear-gradient(to right, var(--pink) 1px, var(--dark) 1px);
      background-position: 0 0;
      background-size: calc(100% / 7) calc(100% / 7);
      display: grid;
      grid-template: repeat(7, 1fr) / repeat(7, 1fr);

    .chess-piece {
      position: relative;
      width: var(--s);
      height: var(--s);
      background-image: url("https://assets.codepen.io/539557/chess-neon.svg");
      background-size: calc(6 * var(--s)) var(--s);
    }

    &.pawn {
     // front
     transform: translatez(0);
    .chess-piece {
      background-position-x: calc(var(--s) * 0);
      grid-area: 2 / 2;
    }
    .target {
      grid-area: 2 / 2;
    }
    }
    &.knight {
     //top
     transform-origin: bottom center;
       transform: translate(0, -100%) rotatex(90deg);
    .chess-piece {
      background-position-x: calc(var(--s) * -2);
      grid-area: 4 / 4;
    }
    .target {
      grid-area: 4 / 4;
    }
    }
    &.rook {
     // right
     transform-origin: left center;
       transform: translate(100%, 0) rotatey(90deg);
    .chess-piece {
      background-position-x: calc(var(--s) * -1);
      grid-area: 4 / 4;
    }
    .target {
      grid-area: 4 / 4;
    }
    }
    &.bishop {
     // back
     transform: translatez(calc(-7 * var(--s) + 10px)) rotatey(-180deg);
    .chess-piece {
      background-position-x: calc(var(--s) * -3);
      grid-area: 4 / 4;
    }
    .target {
      grid-area: 4 / 4;
    }
    }
    &.queen {
     // left
     transform-origin: right center;
       transform: translate(-100%, 0) rotatey(-90deg);
    .chess-piece {
      background-position-x: calc(var(--s) * -4);
      grid-area: 4 / 4;
    }
    .target {
      grid-area: 4 / 4;
    }
    }
    &.king {
     // bottom
     transform-origin: top center;
       transform: translatey(100%) rotatex(-90deg);
    .chess-piece {
      background-position-x: calc(var(--s) * -5);
      grid-area: 4 / 4;
    }
    .target {
      grid-area: 4 / 4;
    }
    }
    }
    }

    .top {
      background-color: var(--dark);
      max-width: 100%;
      --s: 200px;
    h1 {
      text-align: center;
      color: var(--red);
      font-size: 3rem;
      font-weight: 600;
      grid-area: 1 / span 3;
    }
    .grid {
      display: grid;
      grid-template: 150px repeat(2, var(--s)) / repeat(3, var(--s));
    }
    }

    .piece {
      position: relative;
      cursor: pointer;
      overflow: hidden;
      border: 1px solid var(--purple);
      font-size: 2rem;
      background-image: url("https://assets.codepen.io/539557/chess-neon.svg");
      background-size: calc(6 * var(--s)) var(--s);
      background-repeat: no-repeat;
      transition: background 0.3s ease-in-out;
    &::after {
       content: attr(data-piece);
       text-transform: uppercase;
       position: absolute;
       color: var(--blue);
       text-align: center;
       font-weight: 800;
       width: 100%;
       transform: translate(0, -100%);
       transition: transform 0.3s ease-out;
     }
    &.pawn {
       background-position: 0 0;
     }
    &.knight {
       background-position: calc(var(--s) * -2) 0;
     }
    &.rook {
       background-position: calc(var(--s) * -1) 0;
     }
    &.bishop {
       background-position: calc(var(--s) * -3) 0;
     }
    &.queen {
       background-position: calc(var(--s) * -4) 0;
     }
    &.king {
       background-position: calc(var(--s) * -5) 0;
     }
    &:hover,
    &.selected {
       background-color: var(--purple);
       background-position-y: 20px;
    &::after {
       transform: translate(0, 10px);
     }
    }
    }

    .top.side {
      --s: 80px;
      max-width: calc(var(--s) + 20px);
    .grid {
      grid-template: 50px repeat(6, var(--s)) / var(--s);
      gap: 10px;
    }
    .piece {
      font-size: 1rem;
      transition-duration: 0s;
    }
    h1 {
      grid-area: 1 / 1;
      font-size: 1.25rem;
    }
    }

    .target {
      position: relative;
      width: 100%;
      height: 100%;
      background: var(--purple);
      opacity: 0.35;
    }

</style>