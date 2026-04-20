class LightsOutGame {
    constructor() {
        this.levels = [];
        this.currentLevelIndex = 0;
        this.grid = []; 
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isPlaying = false;

        this.boardElement = document.getElementById('board');
        this.uiMoves = document.getElementById('current-moves');
        this.uiTarget = document.getElementById('target-moves');
        this.uiTime = document.getElementById('timer');
        this.uiLevelName = document.getElementById('level-name');
        this.winModal = document.getElementById('win-modal');

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.loadLevel(0);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error("Помилка завантаження файлу");
            const data = await response.json();
            this.levels = data.levels;
        } catch (error) {
            console.warn("Не вдалося завантажити data.json (можливо через CORS). Використовую резервні дані.");
            this.levels = [
                {
                    "name": "Рівень A", "minimum_steps_to_win": 7,
                    "matrix": [[0,1,0,0,1], [1,0,1,1,1], [1,0,1,0,1], [0,0,1,0,0], [1,1,1,1,1]]
                },
                {
                    "name": "Рівень B", "minimum_steps_to_win": 8,
                    "matrix": [[0,1,1,1,0], [0,0,1,0,0], [0,0,1,1,0], [0,1,1,1,1], [1,0,1,0,0]]
                },
                {
                    "name": "Рівень C", "minimum_steps_to_win": 9,
                    "matrix": [[1,1,0,0,0], [0,0,1,1,1], [1,0,0,1,1], [0,1,1,0,1], [1,0,0,0,0]]
                }
            ];
        }
    }

    setupEventListeners() {
        document.getElementById('btn-restart').addEventListener('click', () => this.restartLevel());
        document.getElementById('btn-next-level').addEventListener('click', () => this.nextLevel());
        document.getElementById('btn-modal-next').addEventListener('click', () => {
            this.winModal.classList.add('hidden');
            this.nextLevel();
        });
    }

    loadLevel(index) {
        if (index >= this.levels.length) index = 0;
        this.currentLevelIndex = index;
        
        const levelData = this.levels[index];
        this.uiLevelName.textContent = levelData.name;
        this.uiTarget.textContent = levelData.minimum_steps_to_win;
    
        this.grid = JSON.parse(JSON.stringify(levelData.matrix));
        
        this.moves = 0;
        this.updateStatsUI();
        this.renderBoard();
        this.resetTimer();
        this.startTimer();
        this.isPlaying = true;
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const btn = document.createElement('button');
                btn.className = `cell ${this.grid[r][c] === 1 ? 'active' : ''}`;
                btn.addEventListener('click', () => this.handleCellClick(r, c));
                this.boardElement.appendChild(btn);
            }
        }
    }

    handleCellClick(row, col) {
        if (!this.isPlaying) return;

        this.moves++;
        this.toggleLight(row, col); 
        this.toggleLight(row - 1, col); 
        this.toggleLight(row + 1, col); 
        this.toggleLight(row, col - 1);
        this.toggleLight(row, col + 1); 

        this.updateStatsUI();
        this.renderBoard(); 
        this.checkWin();
    }

    toggleLight(r, c) {
        if (r >= 0 && r < 5 && c >= 0 && c < 5) {
            this.grid[r][c] = this.grid[r][c] === 1 ? 0 : 1;
        }
    }

    checkWin() {
        const isWin = this.grid.every(row => row.every(cell => cell === 0));
        
        if (isWin) {
            this.isPlaying = false;
            this.stopTimer();
            document.getElementById('win-moves').textContent = this.moves;
            this.winModal.classList.remove('hidden');
        }
    }

    restartLevel() {
        this.loadLevel(this.currentLevelIndex);
    }

    nextLevel() {
        this.loadLevel(this.currentLevelIndex + 1);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimeUI();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.stopTimer();
        this.timer = 0;
        this.updateTimeUI();
    }

    updateStatsUI() {
        this.uiMoves.textContent = this.moves;
    }

    updateTimeUI() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        this.uiTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LightsOutGame();
});