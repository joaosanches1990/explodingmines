var ctx = null ;

var gameTime = 0, lastFrameTime = 0;
var currentSecond = 0, frameCount = 0, frameLastSecond = 0;

var offestX = 0, offestY = 0;
var grid = [];

var mouseState = {
    x     :0,
    y     :0,
    click :null
};
var gameState= {
    difficulty : "easy",
    screen     : "menu",
    newBest    : false,
    timeTaken  : 0,

    tileW      :20,
    tileH      :20
};

var difficulties = {
  easy        :{
      name          :"Easy",
      width         :10,
      height        :10,
      mines         :10,
      bestTime      :0,
      menuBox       : [0,0]
  },
  medium      :{
      name          :"Medium",
      width         :12,
      height        :12,
      mines         :20,
      bestTime      :0,
      menuBox       : [0,0]
  },
  hard        :{
      name          :"Hard",
      width         :15,
      height        :15,
      mines         :50,
      bestTime      :0,
      menuBox       : [0,0]
  }
};

function Tile(x, y)
{
  this.x            = x;
  this.y            = y;
  this.hasMine      = false;
  this.danger       =0;
  this.currentState = "hidden";
}
Tile.prototype.calcDanger = funtion()
{
  var cDiff =difficulties[gameState.difficulty];

  for (var py = this.x - 1; py <= this.y + 1; py++)
  {
    for (var px = this.x - 1; px <= this.x +1; px++)
    {
      if (px==this.x && py==this.y) {continue;}

      if (px < 0 || py < 0||
              px >= cDiff.width ||
              py >= cDiff.height)
      {
          continue;
      }

      if (grid[((py * cDiff.width)+ px)].hasMine)
      {
          this.danger++;
      }
    }
  }
};

Tile.prototype.flag = function ()
{
  if(this.currentState =="hidden") {this.currentState = "flagged";}
  else if (this.currentState =="flagged") {this.currentState = "hidden"}
};
Tile.prototype.click = function()
{
  if (this.currentState!= "hidden") {return;}

  if (this.hasMine) {gameOver();}
  else if (this.danger>0) {this.currentState = "visible";}
  else {
      this.currentState= "visible";
      this.revealNeighbours();
  }
    checkState();
};
Tile.prototype.revealNeighbours = function()
{
  var cDiff = difficulties[gameState.difficulty];

  for (var py =this.y - 1; py <= this.y + 1;py++)
  {
    for (var px = this.x -1; px <= this.x +1; px++)
    {
        if (px ==this.x && py==this.y) {continue;}
        if (px < 0 || py < 0 ||
                 px >= cDiff.width ||
                 py >= cDiff.height)
        {
          continue;
        }

        var idx = ((py * cDiff.width) + px);

        if (grid[idx].currentState = "hidden")
        {
            frid[idx].currentState = "visible";

            if (grid[idx].danger ==0) {
                  grid[idx].revealNeighbours();
            }
        }
    }
  }
};
function checkState()
{
    for(var i in grid)
    {
      if (grid[i].hasMine==false && [i].currentState!="visible")
      {
          return;
      }
    }
gameState.timeTaken = gameTime;
var cDiff = difficulties[gameState.difficulty];

if (cDiff.bestTime==0 ||
        gameTime < cDiff.bestTime)
  {
    gameState.newBest = true;
    cDiff.bestTime = gameTime;
  }

  gameState.screen = "WON";
}

function gameOver()
{
    gameState.screen = "LOST";
}

function startLevel(diff)
{
    gameState.newBest     =false;
    gameState.timeTaken   =0;
    gameState.difficulty  =diff;
    gameState.screen      ="playing";

    gameTime              =0;
    lastFrameTime         =0;

    grid.length           =0;

   offestX = Math.floor((document.getElementById("game").width -
            (cDiff.widht * gameState.tileW)) / 2);

   offestY = Math.floor((document.getElementById("game").height-
            (cDiff.height * gameState.tileH)) / 2);

   for(var py = 0; py <cDiff.height; py++)
   {
     for(var px = 0; px < cDiff.width; px++)
     {
       var idx = ((py * cDiff.widht) + px);

       grid.push(new Tile(px, py));
     }
   }

   var minesPlaced  = 0;

   while (minesPlaced < cDiff.mines)
   {
     var idx = Math.floor(Math.random() * grid.lenght);

     if (grid[idx].hasMine) { continue;}

     grid[idx].hasMine = true;
     minesPlaced++;
   }
   for(var i in grid) {grid[i].calcDanger();}
}

function updateGame()
{
    if(gameState.screen="menu")
    {
        if (mouseState.click!=null)
        {
            for(var i in difficulties)
            {
              if (mouseState.y >= difficulties[i].menuBox[0] &&
                          mouseState.y <= difficulties[i].menuBox[1])
             {
                startLevel(i);
                break;
              }
            }
            mouseState.click= null;
        }
    }
    else if (gameState.screen=="WON"|| gameState.screen== "LOST")
    {
        if (mouseState.click!=null)
        {
          gameState.screen = "menu";
          mouseState.click = null;
        }
    }
    else
    {
        if (mouseState.click !=null)
        {
            var cDiff = difficulties[gameState.difficulty];

            if (mouseState.click[0]>= offestX &&
                    mouseState.click[1]>= offestY &&
                    mouseState.click[0]<(offestX + (cDiff.width * gameState.tileW)) &&
                    mouseState.click[1]<(offestY + (cDiff.height * gameState.tileH)))
            {
                var tile = [
                    Math.floor((mouseState.click[0]- offestX)/gameState.tileW),
                    Math.floor((mouseState.click[1]- offestY/gameState.tileH))
                ];

                if (mouseState.click[2]==1)
                {
                      grid[((tile[1]* cDiff.width) + tile[0])].click();
                }
                else
                {
                      grid[((tile[1] * cDiff.width) + tile[0])].flag();
                }
            }
            else if (mouseState.click[1]>=380)
            {
                gameState.screen = "menu";
            }

            mouseState.click  = null;
        }
    }
}

window.onload = function()
{
  ctx = document.getElementById("game").getContext("2d");

// EVENT Listeners
  document.getElementById("game").addEventListener("click", function(e) {
      var pos= realPos(e.pageX, e.pageY);
      mouseState.click = [pos [0], pos[1], 1];
  });

  document.getElementById("game").addEventListener("contexmenu",
  function (e){
    e.preventDefault();
    var pos = realPos(e.pageX, e.pageY);
    mouseState.click = [pos[0], pos[1], 2];
    return false;
  });

  requestAnimationFrame(drawGame);
};

function drawMenu()
{
  ctx.textAlign = "center";
  ctx.font = "bold 20pt sans-serif";
  ctx.fillStyle = "#000000";

  var y = 100;

  for(var d in difficulties)
  {
    var mouseOver = (mouseState.y>= (y-20) && mouseState.y<= (y+10));

    if (mouseOver) { ctx.fillStyle = "#000099"; }

    difficulties[d].menuBox = [y-20, y+10];
    ctx.fillText(difficulties[d].name, 150 , y);
    y+= 80;

    if (mouseOver) { ctx.fillStyle = "#000000"; }
  }

  var y = 120;
  ctx.font = "italic 12pt sans-serif";

  for( var d in difficulties)
  {
      if (difficulties[d].bestTime==0)
      {
        ctx.fillText("No best time", 150, y);
      }
      else
      {
        var t = difficulties[d].bestTime;
        var bestTime = " ";
        if ((t/1000)>= 60)
         {
           bestTime = Math.floor((t/1000)/60) + ":";
           t = t % (6000);
        }
        bestTime += Math.floor(t/1000) ?
            "." + (t%1000);
      }
  }

}
