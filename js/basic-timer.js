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
	var currentGameTime = 0;
	var currentPlayerTime = 0;
	var isGameStarted = false;
	var isPlayerStarted = false;
	var playerStartBtn = document.getElementById('player-start');
	var gameoverBtn = document.getElementById('gameover');
	var gameTimerLbl = document.getElementById('game-timer');
	gameTimerLbl.setAttribute('aria-valuemax', GAME_TIME.LIMIT);
	var playerTimerLbl = document.getElementById('player-timer')
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

	playerStartBtn.onclick = function(){
		playerStart();
	}

	gameoverBtn.onclick = function(){
		var isReset = window.confirm("Are you sure to reset the game?")
		if (isReset){
			resetTimer();
		}
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
		playerTimerLbl.innerHTML = formatTime(PLAYER_TIME.LIMIT - currentPlayerTime);
		playerTimerLbl.classList.toggle("progress-bar-warning", currentPlayerTime >= PLAYER_TIME.WARN && currentPlayerTime < PLAYER_TIME.LIMIT);
		playerTimerLbl.classList.toggle("progress-bar-danger", currentPlayerTime >= PLAYER_TIME.LIMIT);
		playerTimerLbl.classList.toggle("progress-bar-success", currentPlayerTime <= PLAYER_TIME.WARN);
		var ratio = Math.min(100, currentPlayerTime/PLAYER_TIME.LIMIT * 100);
		playerTimerLbl.setAttribute('style', `width: ${ratio}%`);
	}
	var renderGameTimer = function(){
		gameTimerLbl.innerHTML = formatTime(currentGameTime);
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
	resetTimer();
	playerStartBtn.focus();
}

var headline = document.getElementById('headline');
var url = new URL(window.location);
headline.innerHTML = url.searchParams.get('title');