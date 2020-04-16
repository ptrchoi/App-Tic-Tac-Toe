(function() {
	//START Closure/IIFE

	/*--------------------- DECLARATIONS & VARIABLES -------------------------*/
	let sfx1 = require('./soundfx/ambient_-agent_vi-8701_hifi.mp3');
	let sfx2 = require('./soundfx/Reminder-public_d-291_hifi.mp3');
	//CONSTANTS
	const SFX_CLICK = new Audio(sfx1);
	const SFX_WON = new Audio(sfx2);

	const img0 = require('./images/board0.png');
	const img1 = require('./images/board1.png');
	const img2 = require('./images/board2.png');
	const img3 = require('./images/board3.png');
	const img4 = require('./images/board4.png');
	const img5 = require('./images/board5.png');
	const img6 = require('./images/board6.png');
	const img7 = require('./images/board7.png');
	const img8 = require('./images/board8.png');
	const img0_won = require('./images/board0-won.png');
	const img1_won = require('./images/board1-won.png');
	const img2_won = require('./images/board2-won.png');
	const img3_won = require('./images/board3-won.png');
	const img4_won = require('./images/board4-won.png');
	const img5_won = require('./images/board5-won.png');
	const img6_won = require('./images/board6-won.png');
	const img7_won = require('./images/board7-won.png');
	const img8_won = require('./images/board8-won.png');

	let WINNING_CONDITIONS = [
		[ 0, 1, 2 ],
		[ 0, 3, 6 ],
		[ 0, 4, 8 ],
		[ 1, 4, 7 ],
		[ 2, 5, 8 ],
		[ 2, 4, 6 ],
		[ 3, 4, 5 ],
		[ 6, 7, 8 ]
	];
	let STR_PLAYER_SELECT = "please choose 'X' or 'O'";
	let STR_GOOD_LUCK = [
		'good luck!',
		'may the best player win!',
		"let's do this!",
		"hope you've been practicing",
		'may the force be with you',
		'you look like a worthy opponent',
		"wait, am I 'X' or 'O'?",
		"I've been waiting for this all day",
		'ready, set, TOE!',
		'here we go!',
		'this is going to be good',
		'all systems go!',
		'ready to ruuuuummmmble!!!'
	];
	let STR_X_FIRST = "'X' goes first this time";
	let STR_O_FIRST = "'O' goes first this time";
	let STR_PLAYER_WON = [
		'YOU WON!',
		'nice one!',
		"I didn't see that coming",
		'nice moves!',
		'congratulations!',
		'you have been practicing!',
		'smooth move!',
		'how did I lose that one',
		'good game!',
		"you're scary good!",
		'winner, winner, chicken dinner!',
		'hazaah!',
		"I can't calculate your moves",
		"I'm better with 1's and 0's",
		'GOOOOAAAAALL!!!'
	];
	let STR_COMP_WON = [
		'better luck next time',
		'another match?',
		'that was a tough one',
		'that was close',
		'good game!',
		'sooo close',
		"I'm also pretty good at checkers",
		'I got lucky'
	];
	let STR_TIE_GAME = [
		"we're well matched!",
		"you're a worthy opponent",
		"you're tough",
		'thought I had that one',
		'the force is strong with you',
		"let's play again",
		'one more time',
		'was that the Sicilian defense?',
		'a tie is the next best thing to a win',
		"let's go again",
		'tie? my CPU must be tired',
		'impressive...',
		"okay, now I'm warmed up",
		"I've giv'n er all she's got",
		'this is way more fun than spreadsheets!',
		"I'm learning more with your every move",
		"it's a tie!"
	];

	//VARIABLES
	let newSession = true;
	let difficulty = 'hard';
	let xScore = 0;
	let oScore = 0;
	let player_xo = null;
	let ai_xo = null;
	let playersTurn = false;
	let firstPlayer = 'x';
	let winning_positions = [];
	let player_win_scenarios = WINNING_CONDITIONS;
	let ai_win_scenarios = WINNING_CONDITIONS;
	let x_taken = [];
	let o_taken = [];
	let available_positions = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
	let boardPositions = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

	/*--------------------- INITIALIZATION -------------------------*/
	$(document).ready(function() {
		newSession = true;
		resetGame();
	});

	function resetGame() {
		winning_positions = [];
		player_win_scenarios = [
			[ 0, 1, 2 ],
			[ 0, 3, 6 ],
			[ 0, 4, 8 ],
			[ 1, 4, 7 ],
			[ 2, 5, 8 ],
			[ 2, 4, 6 ],
			[ 3, 4, 5 ],
			[ 6, 7, 8 ]
		];
		ai_win_scenarios = [
			[ 0, 1, 2 ],
			[ 0, 3, 6 ],
			[ 0, 4, 8 ],
			[ 1, 4, 7 ],
			[ 2, 5, 8 ],
			[ 2, 4, 6 ],
			[ 3, 4, 5 ],
			[ 6, 7, 8 ]
		];
		x_taken = [];
		o_taken = [];
		available_positions = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
		boardPositions = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

		for (let i = 0; i < 9; i++) {
			$('#board' + i).html(''); // Clear out X's & O's

			switch (i) {
				case 0:
					document.getElementById('board0').style.backgroundImage = `url(${img0})`;
					break;
				case 1:
					document.getElementById('board1').style.backgroundImage = `url(${img1})`;
					break;
				case 2:
					document.getElementById('board2').style.backgroundImage = `url(${img2})`;
					break;
				case 3:
					document.getElementById('board3').style.backgroundImage = `url(${img3})`;
					break;
				case 4:
					document.getElementById('board4').style.backgroundImage = `url(${img4})`;
					break;
				case 5:
					document.getElementById('board5').style.backgroundImage = `url(${img5})`;
					break;
				case 6:
					document.getElementById('board6').style.backgroundImage = `url(${img6})`;
					break;
				case 7:
					document.getElementById('board7').style.backgroundImage = `url(${img7})`;
					break;
				case 8:
					document.getElementById('board8').style.backgroundImage = `url(${img8})`;
					break;
				default:
					document.getElementById('board' + i).style.backgroundImage = `url(${img4})`;
			}
		}
		if (newSession) {
			$('#userPrompt').html(STR_PLAYER_SELECT);
			newSession = false;
			difficulty = 'hard';
			document.getElementById('hard').style.backgroundColor = '#44DB5E';
			document.getElementById('easy').style.backgroundColor = '#CDCFD6';
			player_xo = null;
			ai_xo = null;
			document.getElementById('x-piece').style.backgroundColor = '#CDCFD6';
			document.getElementById('o-piece').style.backgroundColor = '#CDCFD6';
			playersTurn = false;
			firstPlayer = Math.random() < 0.5 ? 'x' : 'o';
			xScore = 0;
			oScore = 0;
			$('#x-score').html('--');
			$('#o-score').html('--');
			$('#p1').html('?');
			$('#p2').html('?');
		} else {
			startGame();
		}
	}

	/*--------------------- MAIN GAME LOOP -------------------------*/
	function startGame() {
		if (firstPlayer === 'x') {
			$('#userPrompt').html(STR_X_FIRST);
			if (player_xo === 'x') {
				playersTurn = true;
			} else {
				playersTurn = false;
			}
			firstPlayer = 'o';
		} else {
			$('#userPrompt').html(STR_O_FIRST);
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

		let status = checkWinningConditions();
		if (status !== -1) {
			endGame(status);
		} else {
			setTimeout(doCompsTurn, 600);
		}
	}

	function doCompsTurn() {
		if (boardPositions.indexOf(0) === -1) return;

		let ai_move = getAIMove();
		updateGameState(ai_move, ai_xo, 'ai');

		let status = checkWinningConditions();
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
			for (let i = 0; i < winning_positions.length; i++) {
				switch (winning_positions[i]) {
					case 0:
						document.getElementById('board0').style.backgroundImage = `url(${img0_won})`;
						break;
					case 1:
						document.getElementById('board1').style.backgroundImage = `url(${img1_won})`;
						break;
					case 2:
						document.getElementById('board2').style.backgroundImage = `url(${img2_won})`;
						break;
					case 3:
						document.getElementById('board3').style.backgroundImage = `url(${img3_won})`;
						break;
					case 4:
						document.getElementById('board4').style.backgroundImage = `url(${img4_won})`;
						break;
					case 5:
						document.getElementById('board5').style.backgroundImage = `url(${img5_won})`;
						break;
					case 6:
						document.getElementById('board6').style.backgroundImage = `url(${img6_won})`;
						break;
					case 7:
						document.getElementById('board7').style.backgroundImage = `url(${img7_won})`;
						break;
					case 8:
						document.getElementById('board8').style.backgroundImage = `url(${img8_won})`;
						break;
					default:
						document.getElementById('board' + i).style.backgroundImage = `url(${img4_won})`;
				}

				// let imgSrc =
				// 	'https://raw.githubusercontent.com/ptrchoi/FCC-TicTacToe/master/images/board' +
				// 	winning_positions[i] +
				// 	'-won.png';
				// document.getElementById('board' + winning_positions[i]).style.backgroundImage = "url('" + imgSrc + "')";
			}
		}
		$('#x-score').html(xScore);
		$('#o-score').html(oScore);
		SFX_WON.play();
		setTimeout(resetGame, 2000);
	}

	/*--------------------- CORE GAME FUNCTIONS -------------------------*/
	function updateGameState(positionTaken, xo, whichPlayer) {
		let boardID = 'board' + positionTaken;
		let idx = available_positions.indexOf(positionTaken);

		available_positions.splice(idx, 1);
		boardPositions[positionTaken] = xo;
		updateWinScenarios(positionTaken, whichPlayer);

		if (xo === 'x') {
			document.getElementById(boardID).innerHTML = 'X';
			document.getElementById(boardID).style.color = '#FE3824';
			x_taken.push(positionTaken);
		} else {
			document.getElementById(boardID).innerHTML = 'O';
			document.getElementById(boardID).style.color = '#0076FF';
			o_taken.push(positionTaken);
		}
	}

	function updateWinScenarios(positionTaken, opponent) {
		let temp_win_scenarios = [];
		let noWinList = [];

		if (opponent === 'ai') {
			temp_win_scenarios = player_win_scenarios;
		} else {
			temp_win_scenarios = ai_win_scenarios;
		}
		for (let i = 0; i < temp_win_scenarios.length; i++) {
			if (temp_win_scenarios[i].indexOf(positionTaken) !== -1) {
				noWinList.push(i);
			}
		}
		for (let j = noWinList.length; j > 0; j--) {
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

		let tempArr = [];

		for (let i = 0; i < WINNING_CONDITIONS.length; i++) {
			for (let j = 0; j < 3; j++) {
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
		for (let m = 0; m < WINNING_CONDITIONS.length; m++) {
			for (let n = 0; n < 3; n++) {
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

		if (x_taken.length + o_taken.length > 8) {
			return 'tie';
		}
		return -1;
	}

	/*--------------------- AI -------------------------*/
	function showRandMsgFromArr(msgArr) {
		let randStr = Math.floor(Math.random() * msgArr.length);
		$('#userPrompt').html(msgArr[randStr]);
	}

	function showRandLuckMsg() {
		let randStr = Math.floor(Math.random() * STR_GOOD_LUCK.length);
		$('#userPrompt').html(STR_GOOD_LUCK[randStr]);
	}

	function getRandomPosition() {
		let randomPosition = Math.floor(Math.random() * 9);
		while (boardPositions[randomPosition] !== 0) {
			//Check spot is available
			randomPosition = Math.floor(Math.random() * 9);
		}
		return randomPosition;
	}

	function getWinningMoves(forWho) {
		let potentialWinningMoves = [];
		let temp_win_scenarios = ai_win_scenarios;
		if (forWho === 'player') temp_win_scenarios = player_win_scenarios;

		//Available spot in the list of win scenarios?
		for (let i = 0; i < available_positions.length; i++) {
			for (let j = 0; j < temp_win_scenarios.length; j++) {
				if (
					temp_win_scenarios[j].indexOf(available_positions[i]) !== -1 &&
					potentialWinningMoves.indexOf(available_positions[i]) === -1
				) {
					potentialWinningMoves.push(available_positions[i]);
				}
			}
		}
		return potentialWinningMoves;
	}

	function checkFor_X_InARow(forWho, positionList, numInARow, checkMultiples) {
		if (positionList.length >= numInARow) {
			let current_win_scenarios = [];
			let positionsFoundInAWinRow = [];
			let winScenariosFound = 0;
			let potentialPositions = [];
			let keeperPositions = [];
			let tempPos = -1;

			if (forWho === 'ai') {
				current_win_scenarios = ai_win_scenarios;
			} else {
				current_win_scenarios = player_win_scenarios;
			}

			for (let i = 0; i < current_win_scenarios.length; i++) {
				positionsFoundInAWinRow = [];
				potentialPositions = [];

				//Check if 'numInARow'/3 spots in a win scenario
				for (let j = 0; j < 3; j++) {
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
			let cornerList = [ 0, 2, 6, 8 ];
			tempPos = getMatchfromListAtoB(cornerList, keeperPositions);
			if (tempPos !== -1) return tempPos;

			//Select randomly from the keepersList if no corners
			if (winScenariosFound >= 1) {
				idx = Math.floor(Math.random() * keeperPositions.length);
				return keeperPositions[idx];
			}
		}
		return -1;
	}

	function checkTripleCorners(doubleWinPosList) {
		let cornerList = [ 0, 2, 6, 8 ];
		let nonCornerList = [ 1, 3, 5, 7 ];
		let tempPos = getMatchfromListAtoB(getPosList('ai'), cornerList); //Check if AI has a corner

		if (numAvailableCorners() === 2 && tempPos === -1) {
			//Opponent has opposing corners
			tempPos = getMatchfromListAtoB(nonCornerList, doubleWinPosList);
			if (tempPos !== -1) return tempPos;
		}

		return -1;
	}

	function numAvailableCorners() {
		let cornerList = [ 0, 2, 6, 8 ];
		let cornerCount = 0;

		for (let i = 0; i < cornerList.length; i++) {
			let idx = available_positions.indexOf(cornerList[i]);
			if (idx !== -1) cornerCount++;
		}
		return cornerCount;
	}

	function getMatchfromListAtoB(listA, listB) {
		for (let k = 0; k < listA.length; k++) {
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
		let oppCorner = -1;
		if (corner === 0) oppCorner = 8;
		if (corner === 2) oppCorner = 6;
		if (corner === 6) oppCorner = 2;
		if (corner === 8) oppCorner = 0;
		return oppCorner;
	}

	function getAIMove() {
		let AI_arr = getPosList('ai');
		let player_arr = getPosList('player');
		let AI_winningMoves = getWinningMoves('ai');
		let player_winningMoves = getWinningMoves('player');
		let positionDetermined = -1;

		//PRIORITY 1) Can AI win? Always win if I can
		if (AI_winningMoves.length > 0 && AI_arr.length >= 2) {
			positionDetermined = checkFor_X_InARow('ai', AI_arr, 2, false);
			if (positionDetermined >= 0) return positionDetermined;
		}

		//If EASY difficulty, sometimes be random
		if (difficulty === 'easy') {
			let coinflip = Math.random() < 0.5 ? 'heads' : 'tails';
			if (coinflip === 'heads') return getRandomPosition();
		}

		//PRIORITY 2) Can User win?
		if (player_winningMoves.length > 0 && player_arr.length >= 2) {
			positionDetermined = checkFor_X_InARow('player', player_arr, 2, false);
			if (positionDetermined >= 0) return positionDetermined;
		}

		//PRIORITY 3) AI middle & player corner? position for 2 ways to win
		if (
			AI_arr.length === 1 &&
			AI_arr[0] === 4 &&
			(player_arr.length === 1 && numAvailableCorners() === 3) &&
			difficulty === 'hard'
		) {
			return getOppositeCorner(player_arr[0]);
		}

		//PRIORITY 4) Middle open? Else Corner
		if ((AI_arr.length === 0 || player_arr.length === 1) && difficulty === 'hard') {
			let middleOpen = available_positions.indexOf(4);
			if (middleOpen !== -1) {
				positionDetermined = 4;
			} else {
				let cornerList = [ 0, 2, 6, 8 ];
				let randNum = Math.floor(Math.random() * 4);
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
	$('#reset').mousedown(function() {
		SFX_CLICK.play();
		document.getElementById('reset').style.backgroundColor = '#44DB5E';
	});
	$('#reset').mouseup(function() {
		document.getElementById('reset').style.backgroundColor = '#CDCFD6';
		newSession = true;
		resetGame();
	});
	$('#x-piece').click(function() {
		if (!player_xo) {
			SFX_CLICK.play();
			document.getElementById('x-piece').style.backgroundColor = '#44DB5E';
			player_xo = 'x';
			ai_xo = 'o';
			$('#p1').html('player');
			$('#p2').html('computer');
			startGame();
		}
	});
	$('#o-piece').click(function() {
		if (!player_xo) {
			SFX_CLICK.play();
			document.getElementById('o-piece').style.backgroundColor = '#44DB5E';
			player_xo = 'o';
			ai_xo = 'x';
			$('#p1').html('computer');
			$('#p2').html('player');
			startGame();
		}
	});
	$('#easy').click(function() {
		if (difficulty !== 'easy') {
			SFX_CLICK.play();
			document.getElementById('easy').style.backgroundColor = '#44DB5E';
			document.getElementById('hard').style.backgroundColor = '#CDCFD6';
			difficulty = 'easy';
		}
	});
	$('#hard').click(function() {
		if (difficulty !== 'hard') {
			SFX_CLICK.play();
			document.getElementById('hard').style.backgroundColor = '#44DB5E';
			document.getElementById('easy').style.backgroundColor = '#CDCFD6';
			difficulty = 'hard';
		}
	});

	$('#board0').click(function() {
		if (playersTurn && boardPositions[0] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(0, 'board0');
		}
	});
	$('#board1').click(function() {
		if (playersTurn && boardPositions[1] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(1, 'board1');
		}
	});
	$('#board2').click(function() {
		if (playersTurn && boardPositions[2] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(2, 'board2');
		}
	});
	$('#board3').click(function() {
		if (playersTurn && boardPositions[3] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(3, 'board3');
		}
	});
	$('#board4').click(function() {
		if (playersTurn && boardPositions[4] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(4, 'board4');
		}
	});
	$('#board5').click(function() {
		if (playersTurn && boardPositions[5] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(5, 'board5');
		}
	});
	$('#board6').click(function() {
		if (playersTurn && boardPositions[6] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(6, 'board6');
		}
	});
	$('#board7').click(function() {
		if (playersTurn && boardPositions[7] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(7, 'board7');
		}
	});
	$('#board8').click(function() {
		if (playersTurn && boardPositions[8] === 0) {
			SFX_CLICK.play();
			doPlayersTurn(8, 'board8');
		}
	});
})(); //END Closure/IIFE
