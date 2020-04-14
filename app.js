(function() { //START Closure/IIFE

  /*--------------------- DECLARATIONS & VARIABLES -------------------------*/
  //CONSTANTS
  var SFX_CLICK = new Audio('https://raw.githubusercontent.com/ptrchoi/FCC-TicTacToe/master/soundfx/ambient_-agent_vi-8701_hifi.mp3');
  var SFX_WON = new Audio('https://raw.githubusercontent.com/ptrchoi/FCC-TicTacToe/master/soundfx/Reminder-public_d-291_hifi.mp3');
  var WINNING_CONDITIONS = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
  ];
  var STR_PLAYER_SELECT = "please choose 'X' or 'O'";
  var STR_GOOD_LUCK = ["good luck!", "may the best player win!", "let's do this!", "hope you've been practicing", "may the force be with you", "you look like a worthy opponent", "wait, am I 'X' or 'O'?", "I've been waiting for this all day", "ready, set, TOE!", "here we go!", "this is going to be good", "all systems go!", "ready to ruuuuummmmble!!!"];
  var STR_X_FIRST = "'X' goes first this time";
  var STR_O_FIRST = "'O' goes first this time";
  var STR_PLAYER_WON = ["YOU WON!", "nice one!", "I didn't see that coming", "nice moves!", "congratulations!", "you have been practicing!", "smooth move!", "how did I lose that one", "good game!", "you're scary good!", "winner, winner, chicken dinner!", "hazaah!", "I can't calculate your moves", "I'm better with 1's and 0's", "GOOOOAAAAALL!!!"];
  var STR_COMP_WON = ["better luck next time", "another match?", "that was a tough one", "that was close", "good game!", "sooo close", "I'm also pretty good at checkers", "I got lucky"];
  var STR_TIE_GAME = ["we're well matched!", "you're a worthy opponent", "you're tough", "thought I had that one", "the force is strong with you", "let's play again", "one more time", "was that the Sicilian defense?", "a tie is the next best thing to a win", "let's go again", "tie? my CPU must be tired", "impressive...", "okay, now I'm warmed up", "I've giv'n er all she's got", "this is way more fun than spreadsheets!", "I'm learning more with your every move", "it's a tie!"];

  //VARIABLES
  var newSession = true;
  var difficulty = 'hard';
  var xScore = 0;
  var oScore = 0;
  var player_xo = null;
  var ai_xo = null;
  var playersTurn = false;
  var firstPlayer = 'x';
  var winning_positions = [];
  var player_win_scenarios = WINNING_CONDITIONS;
  var ai_win_scenarios = WINNING_CONDITIONS;
  var x_taken = [];
  var o_taken = [];
  var available_positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var boardPositions = [0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ];

  /*--------------------- INITIALIZATION -------------------------*/
  $(document).ready(function() {
    newSession = true;
    resetGame();
  })

  function resetGame() {
    winning_positions = [];
    player_win_scenarios = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8]
    ];
    ai_win_scenarios = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [3, 4, 5],
      [6, 7, 8]
    ];
    x_taken = [];
    o_taken = [];
    available_positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    boardPositions = [0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ];

    for (var i = 0; i < 9; i++) {
      $("#board" + i).html('');
      var src = "https://raw.githubusercontent.com/ptrchoi/FCC-TicTacToe/master/images/board" + i + ".png";
      document.getElementById("board" + i).style.backgroundImage = "url('" + src + "')";
    }
    if (newSession) {
      $("#userPrompt").html(STR_PLAYER_SELECT);
      newSession = false;
      difficulty = 'hard';
      document.getElementById("hard").style.backgroundColor = "#44DB5E";
      document.getElementById("easy").style.backgroundColor = "#CDCFD6";
      player_xo = null;
      ai_xo = null;
      document.getElementById("x-piece").style.backgroundColor = "#CDCFD6";
      document.getElementById("o-piece").style.backgroundColor = "#CDCFD6";
      playersTurn = false;
      firstPlayer = Math.random() < 0.5 ? 'x' : 'o';
      xScore = 0;
      oScore = 0;
      $("#x-score").html("--");
      $("#o-score").html("--");
      $("#p1").html("?");
      $("#p2").html("?");

    } else {
      startGame();
    }
  }

  /*--------------------- MAIN GAME LOOP -------------------------*/
  function startGame() {
    if (firstPlayer === 'x') {
      $("#userPrompt").html(STR_X_FIRST);
      if (player_xo === 'x') {
        playersTurn = true;
      } else {
        playersTurn = false;
      }
      firstPlayer = 'o';
    } else {
      $("#userPrompt").html(STR_O_FIRST);
      if (player_xo === 'o') {
        playersTurn = true;
      } else {
        playersTurn = false;
      }
      firstPlayer = 'x';
    }
    if (!playersTurn) {
      setTimeout(doCompsTurn, 1800);
    }
    setTimeout(showRandLuckMsg, 2800);
  }

  function doPlayersTurn(position, boardID) {
    updateGameState(position, player_xo, 'player');
    playersTurn = false;

    var status = checkWinningConditions();
    if (status !== -1) {
      endGame(status);
    } else {
      setTimeout(doCompsTurn, 600);
    }
  }

  function doCompsTurn() {
    if (boardPositions.indexOf(0) === -1) return;

    var ai_move = getAIMove();
    updateGameState(ai_move, ai_xo, 'ai');

    var status = checkWinningConditions();
    if (status !== -1) {
      endGame(status);
    } else {
      playersTurn = true;
    }
  }

  function endGame(state) {
    if (state === 'tie') {
      showRandMsgFromArr(STR_TIE_GAME);
    } else {
      if (state === 'x') {
        xScore++;
        if (player_xo === 'x') {
          showRandMsgFromArr(STR_PLAYER_WON);
        } else {
          showRandMsgFromArr(STR_COMP_WON);
        }
      }
      if (state === 'o') {
        oScore++;
        if (player_xo === 'o') {
          showRandMsgFromArr(STR_PLAYER_WON);
        } else {
          showRandMsgFromArr(STR_COMP_WON);
        }
      }
      for (var i = 0; i < winning_positions.length; i++) {
        var imgSrc = "https://raw.githubusercontent.com/ptrchoi/FCC-TicTacToe/master/images/board" + winning_positions[i] + "-won.png";
        document.getElementById("board" + winning_positions[i]).style.backgroundImage = "url('" + imgSrc + "')";
      }
    }
    $("#x-score").html(xScore);
    $("#o-score").html(oScore);
    SFX_WON.play();
    setTimeout(resetGame, 2000);
  }

  /*--------------------- CORE GAME FUNCTIONS -------------------------*/
  function updateGameState(positionTaken, xo, whichPlayer) {
    var boardID = "board" + positionTaken;
    var idx = available_positions.indexOf(positionTaken);

    available_positions.splice(idx, 1);
    boardPositions[positionTaken] = xo;
    updateWinScenarios(positionTaken, whichPlayer);

    if (xo === 'x') {
      document.getElementById(boardID).innerHTML = "X";
      document.getElementById(boardID).style.color = "#FE3824";
      x_taken.push(positionTaken);
    } else {
      document.getElementById(boardID).innerHTML = "O";
      document.getElementById(boardID).style.color = "#0076FF";
      o_taken.push(positionTaken);
    }
  }

  function updateWinScenarios(positionTaken, opponent) {
    var temp_win_scenarios = [];
    var noWinList = [];

    if (opponent === 'ai') {
      temp_win_scenarios = player_win_scenarios;
    } else {
      temp_win_scenarios = ai_win_scenarios;
    }
    for (var i = 0; i < temp_win_scenarios.length; i++) {
      if (temp_win_scenarios[i].indexOf(positionTaken) !== -1) {
        noWinList.push(i);
      }
    }
    for (var j = noWinList.length; j > 0; j--) {
      temp_win_scenarios.splice(noWinList[j - 1], 1);
    }
    if (opponent === 'ai') {
      player_win_scenarios = temp_win_scenarios;
    } else {
      ai_win_scenarios = temp_win_scenarios;
    }
  }

  function checkWinningConditions() {
    if (x_taken.length < 3 && o_taken.length < 3) return -1;

    var tempArr = [];

    for (var i = 0; i < WINNING_CONDITIONS.length; i++) {
      for (var j = 0; j < 3; j++) {
        if (x_taken.indexOf(WINNING_CONDITIONS[i][j]) !== -1) {
          tempArr.push(WINNING_CONDITIONS[i][j]);
        } else {
          tempArr = [];
          break;
        }
        if (tempArr.length === 3) {
          winning_positions = tempArr;
          return 'x';
        }
      }
    }
    for (var m = 0; m < WINNING_CONDITIONS.length; m++) {
      for (var n = 0; n < 3; n++) {
        if (o_taken.indexOf(WINNING_CONDITIONS[m][n]) !== -1) {
          tempArr.push(WINNING_CONDITIONS[m][n]);
        } else {
          tempArr = [];
          break;
        }
        if (tempArr.length === 3) {
          winning_positions = tempArr;
          return 'o';
        }
      }
    }

    if ((x_taken.length + o_taken.length) > 8) {
      return 'tie';
    }
    return -1;
  }

  /*--------------------- AI -------------------------*/
  function showRandMsgFromArr(msgArr) {
    var randStr = Math.floor(Math.random() * (msgArr.length));
    $("#userPrompt").html(msgArr[randStr]);
  }

  function showRandLuckMsg() {
    var randStr = Math.floor(Math.random() * (STR_GOOD_LUCK.length));
    $("#userPrompt").html(STR_GOOD_LUCK[randStr]);
  }

  function getRandomPosition() {
    var randomPosition = Math.floor(Math.random() * 9);
    while (boardPositions[randomPosition] !== 0) { //Check spot is available
      randomPosition = Math.floor(Math.random() * 9);
    }
    return randomPosition;
  }

  function getWinningMoves(forWho) {
    var potentialWinningMoves = [];
    var temp_win_scenarios = ai_win_scenarios;
    if (forWho === 'player') temp_win_scenarios = player_win_scenarios;

    //Available spot in the list of win scenarios?
    for (var i = 0; i < available_positions.length; i++) {
      for (var j = 0; j < temp_win_scenarios.length; j++) {
        if ((temp_win_scenarios[j].indexOf(available_positions[i]) !== -1) &&
          (potentialWinningMoves.indexOf(available_positions[i]) === -1)) {
          potentialWinningMoves.push(available_positions[i]);
        }
      }
    }
    return potentialWinningMoves;
  }

  function checkFor_X_InARow(forWho, positionList, numInARow, checkMultiples) {
    if (positionList.length >= numInARow) {
      var current_win_scenarios = [];
      var positionsFoundInAWinRow = [];
      var winScenariosFound = 0;
      var potentialPositions = [];
      var keeperPositions = [];
      var tempPos = -1;

      if (forWho === 'ai') {
        current_win_scenarios = ai_win_scenarios;
      } else {
        current_win_scenarios = player_win_scenarios;
      }

      for (var i = 0; i < current_win_scenarios.length; i++) {
        positionsFoundInAWinRow = [];
        potentialPositions = [];

        //Check if 'numInARow'/3 spots in a win scenario
        for (var j = 0; j < 3; j++) {
          if (positionList.indexOf(current_win_scenarios[i][j]) !== -1) {
            positionsFoundInAWinRow.push(current_win_scenarios[i][j]);
          } else {
            potentialPositions.push(current_win_scenarios[i][j]);
          }
        }
        //After each win_scenario checked, check for 'numInARow' matches
        if (positionsFoundInAWinRow.length >= numInARow) {
          keeperPositions = keeperPositions.concat(potentialPositions);
          winScenariosFound++;
        }
      }

      if (checkMultiples && winScenariosFound > 1) {
        tempPos = checkTripleCorners(keeperPositions);
        if (tempPos !== -1) return tempPos;
      }

      //Otherwise take a corner from the keepersList
      var cornerList = [0, 2, 6, 8];
      tempPos = getMatchfromListAtoB(cornerList, keeperPositions);
      if (tempPos !== -1) return tempPos;

      //Select randomly from the keepersList if no corners
      if (winScenariosFound >= 1) {
        idx = Math.floor(Math.random() * (keeperPositions.length));
        return keeperPositions[idx];
      }
    }
    return -1;
  }

  function checkTripleCorners(doubleWinPosList) {
    var cornerList = [0, 2, 6, 8];
    var nonCornerList = [1, 3, 5, 7];
    var tempPos = getMatchfromListAtoB(getPosList('ai'), cornerList); //Check if AI has a corner

    if (numAvailableCorners() === 2 && tempPos === -1) { //Opponent has opposing corners
      tempPos = getMatchfromListAtoB(nonCornerList, doubleWinPosList);
      if (tempPos !== -1) return tempPos;
    }

    return -1;
  }

  function numAvailableCorners() {
    var cornerList = [0, 2, 6, 8];
    var cornerCount = 0;

    for (var i = 0; i < cornerList.length; i++) {
      var idx = available_positions.indexOf(cornerList[i]);
      if (idx !== -1) cornerCount++;
    }
    return cornerCount;
  }

  function getMatchfromListAtoB(listA, listB) {
    for (var k = 0; k < listA.length; k++) {
      idx = listB.indexOf(listA[k]);
      if (idx !== -1) return listB[idx];
    }
    return -1;
  }

  function getPosList(whichPlayer) {
    if (whichPlayer === 'ai') {
      if (ai_xo === 'x') {
        return x_taken;
      } else {
        return o_taken;
      }
    } else {
      if (player_xo === 'x') {
        return x_taken;
      } else {
        return o_taken;
      }
    }
  }

  function getOppositeCorner(corner) {
    var oppCorner = -1;
    if (corner === 0) oppCorner = 8;
    if (corner === 2) oppCorner = 6;
    if (corner === 6) oppCorner = 2;
    if (corner === 8) oppCorner = 0;
    return oppCorner;
  }

  function getAIMove() {
    var AI_arr = getPosList('ai');
    var player_arr = getPosList('player');
    var AI_winningMoves = getWinningMoves('ai');
    var player_winningMoves = getWinningMoves('player');
    var positionDetermined = -1;

    //PRIORITY 1) Can AI win? Always win if I can
    if (AI_winningMoves.length > 0 && AI_arr.length >= 2) {
      positionDetermined = checkFor_X_InARow('ai', AI_arr, 2, false);
      if (positionDetermined >= 0) return positionDetermined;
    }

    //If EASY difficulty, sometimes be random
    if (difficulty === 'easy') {
      var coinflip = Math.random() < 0.5 ? 'heads' : 'tails';
      if (coinflip === 'heads') return getRandomPosition();
    }

    //PRIORITY 2) Can User win?
    if (player_winningMoves.length > 0 && player_arr.length >= 2) {
      positionDetermined = checkFor_X_InARow('player', player_arr, 2, false);
      if (positionDetermined >= 0) return positionDetermined;
    }

    //PRIORITY 3) AI middle & player corner? position for 2 ways to win
    if ((AI_arr.length === 1 && AI_arr[0] === 4) &&
      (player_arr.length === 1 && numAvailableCorners() === 3) &&
      (difficulty === 'hard')) {
      return getOppositeCorner(player_arr[0]);
    }

    //PRIORITY 4) Middle open? Else Corner
    if ((AI_arr.length === 0 || player_arr.length === 1) && (difficulty === 'hard')) {
      var middleOpen = available_positions.indexOf(4);
      if (middleOpen !== -1) {
        positionDetermined = 4;
      } else {
        var cornerList = [0, 2, 6, 8];
        var randNum = Math.floor(Math.random() * 4);
        positionDetermined = cornerList[randNum];
      }
      return positionDetermined;
    }

    //PRIORITY 5) Potential for 2 ways to win?
    if (AI_arr.length >= 2 && difficulty === 'hard') {
      positionDetermined = checkFor_X_InARow('ai', AI_arr, 1, true);
      if (positionDetermined >= 0) return positionDetermined;
    }

    //PRIORITY 6) Potential for PLAYER to have 2 ways to win?
    if (player_arr.length >= 2 && difficulty === 'hard') {
      positionDetermined = checkFor_X_InARow('player', player_arr, 1, true);
      if (positionDetermined >= 0) return positionDetermined;
    }

    //PRIORITY 7) Potential 2-in-a-row?
    if (AI_arr.length >= 1) {
      positionDetermined = checkFor_X_InARow('ai', AI_arr, 1, false);
      if (positionDetermined >= 0) {
        return positionDetermined;
      }
    }

    //PRIORITY 8) Potential for PLAYER 2-in-a-row?
    if (player_arr.length > 1 && difficulty === 'hard') {
      positionDetermined = checkFor_X_InARow('player', player_arr, 1, false);
      if (positionDetermined >= 0) {
        return positionDetermined;
      }
    }

    //PRIORITY 9) Potential for 1 in EMPTY row?
    positionDetermined = checkFor_X_InARow('ai', AI_arr, 0, false);
    if (positionDetermined >= 0) {
      return positionDetermined;
    }

    //FALLBACK) Random
    positionDetermined = getRandomPosition();

    return positionDetermined;
  }

  /*--------------------- INPUT EVENTS -------------------------*/
  $("#reset").mousedown(function() {
    SFX_CLICK.play();
    document.getElementById("reset").style.backgroundColor = "#44DB5E";
  })
  $("#reset").mouseup(function() {
    document.getElementById("reset").style.backgroundColor = "#CDCFD6";
    newSession = true;
    resetGame();
  })
  $("#x-piece").click(function() {
    if (!player_xo) {
      SFX_CLICK.play();
      document.getElementById("x-piece").style.backgroundColor = "#44DB5E";
      player_xo = 'x';
      ai_xo = 'o';
      $("#p1").html("player");
      $("#p2").html("computer");
      startGame();
    }
  })
  $("#o-piece").click(function() {
    if (!player_xo) {
      SFX_CLICK.play();
      document.getElementById("o-piece").style.backgroundColor = "#44DB5E";
      player_xo = 'o';
      ai_xo = 'x';
      $("#p1").html("computer");
      $("#p2").html("player");
      startGame();
    }
  })
  $("#easy").click(function() {
    if (difficulty !== 'easy') {
      SFX_CLICK.play();
      document.getElementById("easy").style.backgroundColor = "#44DB5E";
      document.getElementById("hard").style.backgroundColor = "#CDCFD6";
      difficulty = 'easy';
    }
  })
  $("#hard").click(function() {
    if (difficulty !== 'hard') {
      SFX_CLICK.play();
      document.getElementById("hard").style.backgroundColor = "#44DB5E";
      document.getElementById("easy").style.backgroundColor = "#CDCFD6";
      difficulty = 'hard';
    }
  })

  $("#board0").click(function() {
    if (playersTurn && boardPositions[0] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(0, "board0");
    }
  })
  $("#board1").click(function() {
    if (playersTurn && boardPositions[1] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(1, "board1");
    }
  })
  $("#board2").click(function() {
    if (playersTurn && boardPositions[2] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(2, "board2");
    }
  })
  $("#board3").click(function() {
    if (playersTurn && boardPositions[3] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(3, "board3");
    }
  })
  $("#board4").click(function() {
    if (playersTurn && boardPositions[4] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(4, "board4");
    }
  })
  $("#board5").click(function() {
    if (playersTurn && boardPositions[5] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(5, "board5");
    }
  })
  $("#board6").click(function() {
    if (playersTurn && boardPositions[6] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(6, "board6");
    }
  })
  $("#board7").click(function() {
    if (playersTurn && boardPositions[7] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(7, "board7");
    }
  })
  $("#board8").click(function() {
    if (playersTurn && boardPositions[8] === 0) {
      SFX_CLICK.play();
      doPlayersTurn(8, "board8");
    }
  })

}()); //END Closure/IIFE