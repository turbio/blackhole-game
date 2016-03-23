var holes = [];
var RED_TURN = true, BLUE_TURN = false;
var first_turn = RED_TURN;
var turn = first_turn;
var turn_num = 1;

function setupGame(){
	var rows = document.querySelectorAll('.row');
	for(var r = 0; r < rows.length; r++){
		var foundHoles = rows[r].querySelectorAll('.hole');
		holes.push(foundHoles);
		for(var c = 0; c < foundHoles.length; c++){
			foundHoles[c].setAttribute('data-y', r);
			foundHoles[c].setAttribute('data-x', c);
			foundHoles[c].addEventListener('click', holeClick);
		}
	}

	endGame();
}

function holeClick(hole){
	hole = hole.target;
	hole.removeEventListener('click', holeClick);
	hole.classList.add((turn == RED_TURN) ? 'red' : 'blue');
	hole.classList.add('chosen');

	hole.innerHTML = turn_num;
	if(turn != first_turn){
		turn_num++;
		if(turn_num >= 11){
			endGame();
		}
	}


	turn = !turn;
}

function endGame(){
	var unchosen = document.querySelectorAll('.hole:not(.chosen)')[0];
	console.log(unchosen);
	unchosen.removeEventListener('click', holeClick);
	unchosen.classList.add('black');

	var surround = getSurrounding(unchosen);
	surround.forEach(function(elem){
		elem.style.top = '20px';
		elem.style.left = '20px';
	});
}

function getSurrounding(hole){
	var surrounding = [];

	var holey = parseInt(hole.getAttribute('data-y'));
	var holex = parseInt(hole.getAttribute('data-x'));

	for(var y = -1; y <= 1; y++){
		for(var x = -1; x <= 1; x++){
			if(holes[y + holey] != null
					&& holes[y + holey][x + holex] != null
					&& y + x != 0){
				surrounding.push(holes[y + holey][x + holex]);
			}
		}
	}


	return surrounding;
}
