const section = document.getElementById('section');
const info = document.getElementById('info');
const dog = document.getElementById('dog')
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const grid = 30;
const tetrominoes = [
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]] // J
];
let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let tetromino = tetrominoes[0];
let pos = { x: 3, y: 0 };
let dropStart = Date.now();
let gameOver = false;
let score = 0;

// ---------------------- game ---------------------------
function drawSquare(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * grid, y * grid, grid - 1, grid - 1);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col]) {
        drawSquare(col, row, 'white');
      }
    }
  }
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col]) {
        drawSquare(pos.x + col, pos.y + row, '#00ff30');
      }
    }
  }
}

function collide() {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col]) {
        let newX = pos.x + col;
        let newY = pos.y + row;
        if (newX < 0 || newX >= 10 || newY >= 20 || board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function merge() {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col]) {
        board[pos.y + row][pos.x + col] = 1;
      }
    }
  }
}

function resetTetromino() {
  tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  pos = { x: 3, y: 0 };
  if (collide()) {
    gameOver = true;
    endGame();
  }
}

function drop() {
  pos.y++;
  if (collide()) {
    pos.y--;
    merge();
    resetTetromino();
    clearLines();
  }
  dropStart = Date.now();
}

function clearLines() {
  let linesCleared = 0;
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row].every(cell => cell)) {
      board.splice(row, 1);
      board.unshift(Array(10).fill(0));
      linesCleared++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 10; // Hər sətir üçün 10 xal
    scoreElement.innerText = `Score: ${score}`;
  }
}

document.addEventListener('keydown', event => {
  if (gameOver) return;
  if (event.key === 'ArrowLeft') {
    pos.x--;
    if (collide()) {
      pos.x++;
    }
  } else if (event.key === 'ArrowRight') {
    pos.x++;
    if (collide()) {
      pos.x--;
    }
  } else if (event.key === 'ArrowDown') {
    drop();
  } else if (event.key === 'ArrowUp') {
    rotate();
  }
  draw();
});

function rotate() {
  const tempTetromino = [];
  for (let row = 0; row < tetromino[0].length; row++) {
    tempTetromino[row] = [];
    for (let col = 0; col < tetromino.length; col++) {
      tempTetromino[row][col] = tetromino[tetromino.length - 1 - col][row];
    }
  }
  const prevPos = pos.x;
  pos.x -= Math.floor(tempTetromino[0].length / 2);
  if (collide()) {
    pos.x = prevPos;
    return;
  }
  tetromino = tempTetromino;
}

function update() {
  if (gameOver) return;
  if (Date.now() - dropStart > 1000) {
    drop();
  }
  draw();
  requestAnimationFrame(update);
}

function endGame() {
  section.style.backgroundColor = 'red';
  canvas.style.backgroundColor = 'red';
  setTimeout(()=> {
    location.reload();
  },1000)
}

//--------------------------------- start -------------------------------------------
startButton.addEventListener('click', () => {
  // startButton.style.display = 'none';
  update();
  dog.style.display="none"
  animate(startButton);
  bg(section)
});


//--------------------------------- transition.js-------------------------------------------
function animate(element) {
    transition.begin(element, [
        ["transform", "translateX(-95px) translateY(-50%) scale(1)", "translateX(-95px) translateY(-50%) scale(6)", ".9s", "ease-in-out"],
        "opacity 1 0 .9s"
    ],
    {
      onBeforeChangeStyle: function(element) {
          setTimeout(()=> {
            element.style.display = "none";
            scoreElement.style.display = 'block';
            canvas.style.display = 'block';
            section.style.backgroundColor = 'black';
            info.style.display="block"
          },855)  
      }
    }
  )
}
function bg(element) {
  transition.begin(element, ["background-color #fff #000 .9s ease-in-out"]);
}