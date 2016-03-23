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
	var blackhole = document.querySelectorAll('.hole:not(.chosen)')[0];
	blackhole.removeEventListener('click', holeClick);
	blackhole.classList.add('black');

	var holex = blackhole.getAttribute('data-x');
	var holey = blackhole.getAttribute('data-y');

	var blueScoreNum = 0;
	var redScoreNum = 0;

	getSurrounding(blackhole).forEach(function(elem){
		if(elem.classList.contains('red')){
			redScoreNum += parseInt(elem.innerHTML);
		}else if(elem.classList.contains('blue')){
			blueScoreNum += parseInt(elem.innerHTML);
		}
	});

	var redScore = document.getElementById('red-score');
	var blueScore = document.getElementById('blue-score');

	redScore.innerHTML = redScoreNum;
	blueScore.innerHTML = blueScoreNum;
	redScore.style.visibility = blueScore.style.visibility = 'visible';


	var banner = document.getElementById('winner-banner');
	if(redScoreNum > blueScoreNum){
		banner.innerHTML = 'blue wins!';
		banner.classList.add('blue');
	}else if(redScoreNum < blueScoreNum){
		banner.innerHTML = 'red wins';
		banner.classList.add('red');
	}
	banner.style.visibility = 'visible';
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
