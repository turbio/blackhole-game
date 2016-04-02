var startTime = null;
var ticks = null;

function nextMove(board, color){
	startTime = new Date().getTime();
	ticks = 0;

	var moveTree = generateMoveTree(color, board);

	console.log(ticks);

	return document.querySelectorAll('.hole')[moveTree[0].hole.index];
};

function generateMoveTree(color, board, currentColor, depth){ ticks++;
	if(!currentColor){
		currentColor = color;
	}
	if(depth === undefined){
		depth = 1;
	}

	var moves = availableMoves(currentColor, board);

	//if(new Date().getTime() - startTime > 1000){
		//return evaluateBoard(board, color);
	//}

	if(ticks / depth > 1000){
		return evaluateBoard(board, color);
	}

	if(!moves.length){
		return evaluateBoard(board, color);
	}

	moves.forEach(function(move){
		var result = generateMoveTree(color,
			move.result,
			oppositeColor(currentColor),
			depth + 1);
		if(Array.isArray(result)){
			move.sub = result.sort(function(a, b){
				return b.score - a.score;
			});


			move.score = 0;
			result.forEach(function(res){
				move.score += res.score;
			});
		}else{
			move.score = result;
		}
	});

	return moves;
};

function evaluateBoard(board, color){
	var winner = findWinner(board);
	if(winner){
		if(winner == color){
			return 100;
		}else if(winner == oppositeColor(color)){
			return -100;
		}

		return 0;
	}

	var score = 0;

	board.forEach(function(hole){
		var surround = getBoardSurround(board, hole);
		if(hole.owner == null){
			surround.forEach(function(shole){
				var value = shole.value;
				if(shole.owner == color){
					score -= value - 4;
				}else if(shole.owner == oppositeColor(color)){
					score += value - 4;
				}
			});
		}
	});

	return score;
}

function oppositeColor(color){
	if(color == 'red'){
		return 'blue';
	}else if(color == 'blue'){
		return 'red';
	}

	return null;
}

function boardFromMove(originalBoard, move){
	var newBoard = [];
	originalBoard.forEach(function(hole){
		if(move.hole.index == hole.index){
			newBoard.push({
				owner: move.owner,
				index: hole.index,
				value: highestHole(originalBoard, move.owner) + 1
			});
		}else{
			newBoard.push({
				owner: hole.owner,
				index: hole.index,
				value: hole.value
			});
		}
	});

	return newBoard;
}

function highestHole(board, color){
	var highest = 0;
	board.forEach(function(hole){
		if(hole.owner == color && hole.value && hole.value > highest){
			highest = hole.value;
		}
	});

	return highest;
}

function getBoardSurround(board, hole){
	var row = getRow(hole);
	var column = getColumn(hole);

	var surround = [];

	for(var i = 0; i < 9; i++){
		if(i == 4 || i == 2 || i == 6){
			continue;
		}
		var surroundHole = getHole(
				board,
				row + Math.floor(i / 3) - 1,
				column + (i % 3) - 1);
		if(surroundHole){
			surround.push(surroundHole);
		}
	}

	return surround;
}

function getHole(board, row, column){
	for(var i = 0; i < board.length; i++){
		if(row == getRow(board[i]) && column == getColumn(board[i])){
			return board[i];
		}
	}

	return null;
}

function getColumn(hole){
	var offset = 0;
	for(var i = 0; i < getRow(hole); i++){
		offset += i + 1;
	}
	return hole.index - offset;
}

function getRow(hole){
	var offset = 0;
	for(var i = 0; i <= 6; i++){
		if(hole.index < offset){
			return i - 1;
		}
		offset += i + 1;
	}
}

function findWinner(board){
	var blackHoles = board.filter(function(node){
		return node.owner == null;
	});

	if(blackHoles.length != 1){
		return null;
	}

	var redScoreNum = 0;
	var blueScoreNum = 0;

	getBoardSurround(board, blackHoles[0]).forEach(function(hole){
		if(hole.owner == 'red'){
			redScoreNum += hole.value;
		}else if(hole.owner == 'blue'){
			blueScoreNum += hole.value;
		}
	});

	if(redScoreNum > blueScoreNum){
		return 'blue';
	}else if(redScoreNum < blueScoreNum){
		return 'red';
	}else{
		return 'tie';
	}
}

function availableMoves(color, board){
	var availableHoles = board.filter(function(node){
		return node.owner == null;
	});

	if(availableHoles.length <= 1){
		return []
	}

	var moves = [];

	availableHoles.forEach(function(hole){
		var newMove = {
			hole: hole,
			owner: color
		};
		newMove.result = boardFromMove(board, newMove);
		moves.push(newMove);
	});

	return moves;
};
