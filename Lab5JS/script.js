class PixelHuntGame {
    constructor() {
        this.dom = {
            startMenu: document.getElementById('start-menu'),
            gameOverMenu: document.getElementById('game-over-menu'),
            gameUI: document.getElementById('game-ui'),
            target: document.getElementById('target'),
            scoreDisplay: document.getElementById('score-display'),
            timeDisplay: document.getElementById('time-display'),
            finalScore: document.getElementById('final-score'),
            errorMsg: document.getElementById('error-message'),
            difficultySelect: document.getElementById('difficulty'),
            skinSelect: document.getElementById('skin'),
            btnStart: document.getElementById('btn-start'),
            btnRestart: document.getElementById('btn-restart'),
        };

        this.state = {
            isPlaying: false,
            score: 0,
            timeLeft: 0,
            maxTime: 0,
            targetSize: 0,
            timerInterval: null
        };

        this.settings = {
            easy:   { size: 80, time: 3.0 },
            normal: { size: 50, time: 2.0 },
            hard:   { size: 25, time: 1.0 }
        };

        this.initEvents();
    }

    initEvents() {
        this.dom.btnStart.addEventListener('click', () => this.startGame());
        this.dom.btnRestart.addEventListener('click', () => this.resetMenu());

        this.dom.target.addEventListener('mousedown', (e) => this.handleHit(e));

        document.body.addEventListener('mousedown', (e) => {
            if (this.state.isPlaying && e.target === document.body) {
                this.handleMiss();
            }
        });
    }

    startGame() {
        const difficulty = this.dom.difficultySelect.value;
        const skin = this.dom.skinSelect.value;

        if (!difficulty || !skin) {
            this.dom.errorMsg.classList.remove('hidden');
            return;
        }
        this.dom.errorMsg.classList.add('hidden');

        const config = this.settings[difficulty];
        this.state.targetSize = config.size;
        this.state.maxTime = config.time;
        this.state.score = 0;

        this.dom.target.className = '';
        this.dom.target.classList.add(`skin-${skin}`);
        this.dom.target.style.width = `${config.size}px`;
        this.dom.target.style.height = `${config.size}px`;

        this.dom.startMenu.classList.add('hidden');
        this.dom.gameOverMenu.classList.add('hidden');
        this.dom.gameUI.classList.remove('hidden');
        this.dom.target.classList.remove('hidden');

        this.state.isPlaying = true;
        this.updateScoreboard();
        this.nextRound();
    }

    nextRound() {
        this.spawnTarget();
        this.resetTimer();
    }

    spawnTarget() {
        const padding = this.state.targetSize;
        const maxX = window.innerWidth - padding;
        const maxY = window.innerHeight - padding;

        const randomX = Math.max(0, Math.floor(Math.random() * maxX));
        const randomY = Math.max(0, Math.floor(Math.random() * maxY));

        this.dom.target.style.left = `${randomX}px`;
        this.dom.target.style.top = `${randomY}px`;
    }

    handleHit(e) {
        if (!this.state.isPlaying) return;
        
        e.stopPropagation(); 
        this.state.score++;
        this.updateScoreboard();
        this.nextRound();
    }

    handleMiss() {
        if (!this.state.isPlaying) return;

        this.state.score--;
        this.updateScoreboard();
        
        document.body.style.backgroundColor = "#4a0000";
        setTimeout(() => { document.body.style.backgroundColor = ""; }, 100);

        if (this.state.score < 0) {
            this.endGame();
        }
    }

    resetTimer() {
        clearInterval(this.state.timerInterval);
        this.state.timeLeft = this.state.maxTime;
        this.updateTimerDisplay();

        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft -= 0.1;
            this.updateTimerDisplay();

            if (this.state.timeLeft <= 0) {
                this.endGame();
            }
        }, 100);
    }

    updateScoreboard() {
        this.dom.scoreDisplay.textContent = this.state.score;
        this.dom.scoreDisplay.style.color = this.state.score === 0 ? "#ff4b4b" : "white";
    }

    updateTimerDisplay() {
        this.dom.timeDisplay.textContent = Math.max(0, this.state.timeLeft).toFixed(1);
    }

    endGame() {
        this.state.isPlaying = false;
        clearInterval(this.state.timerInterval);

        this.dom.target.classList.add('hidden');
        this.dom.gameUI.classList.add('hidden');
        this.dom.gameOverMenu.classList.remove('hidden');
        
        this.dom.finalScore.textContent = Math.max(0, this.state.score); 
    }

    resetMenu() {
        this.dom.gameOverMenu.classList.add('hidden');
        this.dom.startMenu.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PixelHuntGame();
});