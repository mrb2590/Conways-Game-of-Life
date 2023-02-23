const blockTemplate = {
  size: 10,
  alive: true,
  x: 0,
  y: 0,
};
var blocks = [];

var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = canvas.width * 0.5;
var ctx;
var framerate = 10;
var fpsInterval;
var startTime;
var now;
var then;
var elapsed;
var withGrid = true;

window.onload = function () {
  ctx = canvas.getContext("2d");
  createBlocks();
  startGameLoop();
};

function startGameLoop() {
  fpsInterval = 1000 / framerate;
  then = window.performance.now();
  startTime = then;
  gameLoop();
}

function gameLoop(newtime) {
  requestAnimationFrame(gameLoop);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    updateBlocks();
  }
}

function createBlocks() {
  for (let i = 0; i <= canvas.width / blockTemplate.size; i++) {
    blocks[i] = [];

    for (let j = 0; j <= canvas.height / blockTemplate.size; j++) {
      blocks[i][j] = { ...blockTemplate };
      blocks[i][j].alive = Math.random() < 0.2;
      blocks[i][j].x = i * blocks[i][j].size;
      blocks[i][j].y = j * blocks[i][j].size;

      drawBlock(blocks[i][j]);
    }
  }
}

function drawBlock(block) {
  if (withGrid) {
    // Border
    ctx.fillStyle = "#444444";
    ctx.fillRect(block.x, block.y, block.size, block.size);
  }

  // Fill
  ctx.fillStyle = block.alive ? "#ffffff" : "#000000";

  if (withGrid) {
    ctx.fillRect(block.x + 1, block.y + 1, block.size - 2, block.size - 2);
  } else {
    ctx.fillRect(block.x, block.y, block.size, block.size);
  }
}

function updateBlocks() {
  let blocksCopy = JSON.parse(JSON.stringify(blocks));

  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      blocksCopy[i][j].alive = shouldLive(i, j, blocks[i][j]);
      drawBlock(blocks[i][j]);
    }
  }

  blocks = JSON.parse(JSON.stringify(blocksCopy));
}

function shouldLive(blockI, blockJ, block) {
  let living = 0;

  for (let i = blockI - 1; i <= blockI + 1; i++) {
    for (let j = blockJ - 1; j <= blockJ + 1; j++) {
      if (
        typeof blocks[i] !== "undefined" &&
        typeof blocks[i][j] !== "undefined" &&
        (i !== blockI || j !== blockJ) &&
        blocks[i][j].alive
      ) {
        living++;
      }
    }
  }

  return (
    (block.alive && (living === 2 || living === 3)) ||
    (!block.alive && living === 3)
  );
}
