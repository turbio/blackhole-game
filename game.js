var holes = [];
var RED_TURN = true, BLUE_TURN = false;
var first_turn = RED_TURN;
var turn = first_turn;
var turn_num = 1;

var blue_player = null;
var red_player = null;

function setupGame(){
	var rows = document.querySelectorAll('.row');
	for(var r = 0; r < rows.length; r++){
		var foundHoles = rows[r].querySelectorAll('.hole');
		holes.push(foundHoles);
		for(var c = 0; c < foundHoles.length; c++){
			foundHoles[c].setAttribute('data-y', r);
			foundHoles[c].setAttribute('data-x', c);
			foundHoles[c].addEventListener('click', clickHole);
		}
	}

	document.getElementById('begin-button').addEventListener('click', function(){
		if(document.getElementById('red-radio-ai').checked){
			red_player = 'ai';
		}else if(document.getElementById('red-radio-human').checked){
			red_player = 'human';
		}
		if(document.getElementById('blue-radio-ai').checked){
			blue_player = 'ai';
		}else if(document.getElementById('blue-radio-human').checked){
			blue_player = 'human';
		}
		document.getElementById('menu-board').style.display = 'none';
		document.getElementById('game-board').style.display = 'block';
	});
}

function clickHole(event){
	chooseHole(event.target);
}

function chooseHole(hole){
	hole.removeEventListener('click', clickHole);
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

	if(turn == BLUE_TURN){
		chooseHole(nextMove(readBoard(), 'blue'));
	}
}

function endGame(){
	var blackhole = document.querySelectorAll('.hole:not(.chosen)')[0];
	blackhole.removeEventListener('click', chooseHole);
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
		elem.classList.add('swing');
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
	banner.style.opacity = '1';
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
			value: parseInt(domHoles[i].innerHTML) || null,
			index: i,
		});
	}

	return holes;
}
