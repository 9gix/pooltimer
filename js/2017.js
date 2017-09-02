
var headline = document.getElementById('headline');
var url = new URL(window.location);

var match = {
	0: { // Team 0
		name: url.searchParams.get('home') || "Home",
		players: [
			url.searchParams.get('p1') || "Player 1",
			url.searchParams.get('p2') || "Player 2"
		],
		currentPlayer: 0, // current player index
	},
	1: { // Team 1
		name: url.searchParams.get('away') || "Away",
		players: [
			url.searchParams.get('p3') || "Player 3",
			url.searchParams.get('p4') || "Player 4"
		],
		currentPlayer: 0, // current player index
	},
	// -1: game stopped, 0: home team start, 1: away team start
	currentTeam: -1, 
}

var homeTeamEl = document.getElementById('home-team');
var awayTeamEl = document.getElementById('away-team');
homeTeamEl.innerHTML = match[0].name;
awayTeamEl.innerHTML = match[1].name;

var teamEl = [
	[
		document.getElementById('home-1'),
		document.getElementById('home-2'),
		document.getElementById('home-0'),
	], [
		document.getElementById('away-1'),
		document.getElementById('away-2'),
		document.getElementById('away-0'),
	]
];
var renderPlayers = function(){
	if (match.currentTeam === -1){
		for (var i = 0; i < 3; i++){
			teamEl[0][i].classList.remove('playing', 'shooting');
			teamEl[1][i].classList.remove('playing', 'shooting');
		}
	} else {
		var currentPlayer = match[match.currentTeam].currentPlayer;
		teamEl[match.currentTeam][currentPlayer].classList.add('shooting');
		teamEl[match.currentTeam][1^currentPlayer].classList.remove('shooting');

		for (var i = 0; i < 3; i++){
			teamEl[match.currentTeam][i].classList.add('playing');
			teamEl[1^match.currentTeam][i].classList.remove('playing');
		}
	}
} 
var initialPlayerRenders = function(){
	teamEl[0][0].innerHTML = match[0].players[0];
	teamEl[0][1].innerHTML = match[0].players[1];
	teamEl[0][2].innerHTML = "Team " + match[0].name;
	teamEl[1][0].innerHTML = match[1].players[0];
	teamEl[1][1].innerHTML = match[1].players[1];	
	teamEl[1][2].innerHTML = "Team " + match[1].name;
}
initialPlayerRenders();

window.onload = function(){
	var GAME_TIME = {
		LIMIT: 30 * 60,
		WARN: 25 * 60,
	};
	var PLAYER_TIME = {
		LIMIT: 45,
		WARN: 40,
	};
	var playerWarnSound = new Audio('beep.wav');
	var playerOverSound = new Audio('horn.wav');
	var gameWarnSound = new Audio('bell.wav');
	var gameOverSound = new Audio('honk.wav')
	playerWarnSound.load();
	playerOverSound.load();
	gameWarnSound.load();
	gameOverSound.load();
	var currentGameTime = 0;
	var currentPlayerTime = 0;
	var isGameStarted = false;
	var isPlayerStarted = false;
	var playerStartBtn = document.getElementById('player-start');
	var gameoverBtn = document.getElementById('gameover');
	var gameTimerLbl = document.getElementById('game-timer');
	var gameTimerLbl2 = document.getElementById('game-timer-lbl');
	var playerTimerLbl = document.getElementById('player-timer')
	var playerTimerLbl2 = document.getElementById('player-timer-lbl')
	var playerTimer;
	var gameTimer;
	var playerStart = function(){
		if (!currentGameTime){
			gameTimer = setInterval(tickGame,1000)
		}
		if (playerTimer){
			resetPlayerTimer();
		}
		clearInterval(playerTimer);
		playerTimer = setInterval(tickPlayer, 1000)
	}

	var resetPlayer = function(){
		match.currentTeam = -1;
		renderPlayers();
	}

	var reset = function(){
		resetTimer();
		resetPlayer();
	}
	var resetTimer = function(){
		resetGameTimer();
		resetPlayerTimer();
	}
	var resetGameTimer = function(){
		clearInterval(gameTimer);
		currentGameTime = 0;
		renderGameTimer();
	}
	var resetPlayerTimer = function(){		
		clearInterval(playerTimer);
		currentPlayerTime = 0;
		renderPlayerTimer();
	}
	var tickPlayer = function(){
		currentPlayerTime++;
		renderPlayerTimer();
		playPlayerSound();
		if (currentPlayerTime > PLAYER_TIME.LIMIT){
			resetPlayerTimer();
		}
	}
	var tickGame = function(){
		currentGameTime++;
		renderGameTimer();
		playGameSound();
	}
	var renderTimer = function(){
		renderGameTimer();
		renderPlayerTimer();
	}

	var renderPlayerTimer = function(){
		var formattedTime = formatTime(PLAYER_TIME.LIMIT - currentPlayerTime);
		playerTimerLbl.innerHTML = formattedTime;
		playerTimerLbl2.innerHTML = formattedTime;
		playerTimerLbl.classList.toggle("progress-bar-warning", currentPlayerTime >= PLAYER_TIME.WARN && currentPlayerTime < PLAYER_TIME.LIMIT);
		playerTimerLbl.classList.toggle("progress-bar-danger", currentPlayerTime >= PLAYER_TIME.LIMIT);
		playerTimerLbl.classList.toggle("progress-bar-success", currentPlayerTime <= PLAYER_TIME.WARN);
		var ratio = Math.min(100, currentPlayerTime/PLAYER_TIME.LIMIT * 100);
		playerTimerLbl.setAttribute('style', `width: ${ratio}%`);
	}
	var renderGameTimer = function(){
		var formattedTime = formatTime(currentGameTime);
		gameTimerLbl.innerHTML = formattedTime;
		gameTimerLbl2.innerHTML = formattedTime;
		gameTimerLbl.classList.toggle("progress-bar-warning", currentGameTime >= GAME_TIME.WARN && currentGameTime < GAME_TIME.LIMIT);
		gameTimerLbl.classList.toggle("progress-bar-danger", currentGameTime >= GAME_TIME.LIMIT);
		gameTimerLbl.classList.toggle("progress-bar-info", currentGameTime < GAME_TIME.WARN);
		var ratio = Math.min(100, currentGameTime/GAME_TIME.LIMIT * 100);
		gameTimerLbl.setAttribute('style', `width: ${ratio}%`)
	}

	var playGameSound = function(){
		if (currentGameTime == GAME_TIME.LIMIT){
			gameOverSound.play();
		} else if (currentGameTime == GAME_TIME.WARN){
			gameWarnSound.play();
		}
	}

	var playPlayerSound = function(){
		if (currentPlayerTime == PLAYER_TIME.LIMIT){
			playerOverSound.play();
		} else if ( currentPlayerTime >= PLAYER_TIME.WARN && 
					currentPlayerTime < PLAYER_TIME.LIMIT){
			playerWarnSound.play();
		}
	}

	var formatTime = function(second){
		var minutes = Math.floor(second / 60);
		var seconds = second % 60;
		return `${String("00"+minutes).slice(-2)}:${String("00"+seconds).slice(-2)}`;
	}


	var toggleHomeTeam = function(){
		match[0].currentPlayer ^= 1;
		match.currentTeam = 0;
		playerStart();
		renderPlayers()
	}

	var toggleAwayTeam = function(){
		match[1].currentPlayer ^= 1;
		match.currentTeam = 1;
		playerStart();
		renderPlayers();
	}

	var rightDown, leftDown = false;

	var mainsite = document.getElementById('main-site');
	mainsite.addEventListener('contextmenu', function(ev){
		ev.preventDefault();
	});

	mainsite.addEventListener('mousedown', function(e){
		if (e.which == 1){
			leftDown = 1;
		} else if (e.which == 2) {
			middleDown = 1;
		} else if (e.which == 3){
			rightDown = 1;
		}
	});

	mainsite.addEventListener('mouseup', function(e){
		if (leftDown && rightDown){
			var isReset = window.confirm("Are you sure to reset the game?")
			if (isReset){
				reset();
			}
			leftDown = 0;
			middleDown = 0;
			rightDown = 0;
		} else if (leftDown){
			leftDown = 0;
			toggleHomeTeam();
		} else if (rightDown){
			rightDown = 0;
			toggleAwayTeam();
		} else if (middleDown){
			middleDown = 0;
			playerStart();
		}
	})

	mainsite.addEventListener('wheel', function(e){
		resetPlayerTimer();
	})
	reset();
}
