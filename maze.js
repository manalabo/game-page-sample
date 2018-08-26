//迷路ゲーム
var cvMain;
var ctx;
var width = 33, height = 33; //迷路の広さ
var maze =[];
var px, py; //プレイヤー座標
var keyDir = { //押されたキーの向き
  38:[0,-1], 40:[0,1], //up down
  37:[-1,0], 39:[1,0], //left right
  75:[0,-1], 74:[0,1], //j k
  72:[-1,0], 76:[1,0] //h l
};

var blockColor = ["white","black","yellow"];

window.onload = function(){
  cvMain = document.getElementById("cvMain");
  ctx = cvMain.getContext("2d");
  document.onkeydown = keyHandler;
  cvMain.onmousedown = mouseHandler;
  initGame();
};

function rand(x){
  return Math.floor(Math.random() * x);
}

function initGame(){
  maze = makeMaze();
  px = 1; py = 1;
  drawMap();
  //drawMaze(maze); //こっちにすると全体像
}

function keyHandler(e){
  var c = e.keyCode;
  var k = keyDir[c];
  if(!k) return;
  var x2 = px + keyDir[c][0];
  var y2 = py + keyDir[c][1];
  var b = checkMap(x2, y2);
  if(b) e.preventDefault(); //ブラウザのイベントキャンセル
}

function mouseHandler(e){
  e.preventDefault();
  var lx = e.layerX;//クリック位置
  var ly = e.layerY;
  var ax = lx - (cvMain.width / 2);
  var ay = ly - (cvMain.height / 2);
  if(Math.abs(ax) > Math.abs(ay)){
    var bx = (ax < 0) ? -1 : 1;
    checkMap(px + bx, py);
  }else {
    var by = (ay < 0) ? -1 : 1;
    checkMap(px, py + by);
  }
}

function checkMap(x2, y2){
  if(!isInMaze(x2, y2)) return  false;
  var c = maze[y2][x2];
  if(c == 1) return false;
  if(c == 2){
    alert("ゴーーール！！");
    initGame(); return false;
  }
  px = x2; py = y2;
  drawMap();
}

function makeMaze(){
  var maze = [];
  for(var y = 0; y < height; y++){
    maze[y] = [];
    for(var x = 0; x < width; x++){
      maze[y][x] = 1;
    }
  }
  var makeDir4 = function(){
    var r = [[0,-1],[0,1],[-1,0],[1,0]];
    for(var i = 0; i < 4; i++){
      var j = rand(4);
      var t = r[i];
      r[i] = r[j];
      r[j] = t;
    }
    return r;
  };
  var recMake = function(x, y){
    var dir4 = makeDir4();
    for(var i = 0; i < 4; i++){
      var dir = dir4[i];
      var x2 = dir[0] * 2 +x;
      var y2 = dir[1] * 2 +y;

      if(x2 < 0 || y2 < 0 ||
         x2 >=  width-1 ||
         y2 >= height-1)continue;
      //if(!isInMaze(x2, y2)) continue;

      if(maze[y2][x2] === 0) continue;
      maze[y+dir[1]][x+dir[0]] = 0;
      maze[y2][x2] = 0;
      recMake(x2, y2);
    }
  };
  //穴掘り開始点
  var cx = rand((width - 2)/2) * 2 + 1;
  var cy = rand((height - 2)/2) * 2 + 1;
  maze[cy][cx] = 0;

  recMake(cx, cy);
  maze[height - 2][width - 2] = 2;
  return maze;
}

function isInMaze(x, y){
  return (0 <= x && x < width) &&
         (0 <= y && y < height);
}

function drawMap(){
  var cw = cvMain.width;
  var w = Math.floor(cw / 9);
  ctx.clearRect(0, 0, w, w);
  for(var y =0; y < 9; y++){
    for(var x = 0; x < 9; x++){
      var dx = px + x - 4;
      var dy = py + y - 4;
      var b = 1;
      if(isInMaze(dx, dy)){
        b = maze[dy][dx];
      }
      ctx.fillStyle = blockColor[b];
      ctx.fillRect(w*x, w*y, w, w);
    }
  }
  //キャラクター描画
  ctx.fillStyle = "green";
  ctx.fillRect(w*4+10, w*4+10, w-20, w-20);
}

//追加部分　迷路全体像表示・・・

function drawMaze(maze){
  //var cvMain = document.getElementById("cvMain");
  //var ctx = cvMain.getContext("2d");
  ctx.fillStyle = "black";
  var bw = cvMain.width / 33;
  for(var y = 0; y < maze.length; y++){
    for(var x = 0; x < maze[y].length; x++){
      if(maze[y][x]){
        ctx.fillRect(x*bw, y*bw, bw, bw);
      }
    }
  }
}