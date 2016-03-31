function nextMove(color){
	var moveTree = generateMoveTree(readBoard());
};

function generateMoveTree(color, board){
	var moves = availableMoves(board);

	return moves;
};

function boardFromMove(originalBoard, move){
	var newBoard = [];
	originalBoard.forEach(function(hole){
		newBoard.push({
			owner: hole.owner,
			index: hole.index,
			dom: hole.dom,
		});
	});

	return newBoard;
}

function availableMoves(board){
	var availableHoles = [];

	availableHoles = board.filter(function(node){
		return node.owner == null;
	});

	if(availableHoles.length <= 1){
		return []
	}

	var moves = [];

	availableHoles.forEach(function(hole){
		var newMove = {
			hole: hole.index,
		};
		moves.push(newMove);
	});

	return moves;
};

function readBoard(){
	var domHoles = document.querySelectorAll('.hole');
	var holes = [];
	for(var i = 0; i < domHoles.length; i++){
		var classes = domHoles[i].classList;
		var owner = null;
		if(classes.contains('red')){
			owner = 'red';
		}
		if(classes.contains('blue')){
			owner = 'blue';
		}
		holes.push({
			owner: owner,
			index: i,
			dom: domHoles[i],
		});
	}

	return holes;
}
