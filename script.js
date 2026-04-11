/* ============================================
   GAME STATE MANAGEMENT
   ============================================ */

class TicTacToe {
    constructor() {
        // Game state
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.gameMode = null; // 'pvp' or 'pva'
        this.aiDifficulty = null; // 'easy', 'medium', 'hard'
        this.isAIThinking = false;

        // Scores
        this.scores = {
            x: 0,
            o: 0,
            draws: 0
        };

        // Game history
        this.gameHistory = [];

        // Load data from localStorage
        this.loadData();

        // DOM Elements
        this.modeSelection = document.getElementById('modeSelection');
        this.difficultySelection = document.getElementById('difficultySelection');
        this.gameBoard = document.getElementById('gameBoard');
        this.gameGrid = document.getElementById('gameGrid');
        this.gameStatus = document.getElementById('gameStatus');
        this.cells = document.querySelectorAll('.cell');
        this.turnText = document.getElementById('turnText');
        this.turnAvatar = document.getElementById('turnAvatar');
        this.scoreX = document.getElementById('scoreX');
        this.scoreO = document.getElementById('scoreO');
        this.scoreDraw = document.getElementById('scoreDraw');
        this.scoreOLabel = document.getElementById('scoreOLabel');
        this.historyList = document.getElementById('historyList');
        this.aiThinking = document.getElementById('aiThinking');

        // Initialize events
        this.initializeEvents();

        // Set theme
        this.initializeTheme();
    }

    /* ============================================
       INITIALIZATION & SETUP
       ============================================ */

    initializeEvents() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMode(e.target.closest('.mode-btn').dataset.mode));
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.closest('.difficulty-btn').dataset.difficulty));
        });

        // Cell clicks
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        // Control buttons
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('resetScoreBtn').addEventListener('click', () => this.resetScore());
        document.getElementById('backBtn').addEventListener('click', () => this.backToMenu());
        document.getElementById('restartGameBtn').addEventListener('click', () => this.restartGame());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const body = document.body;
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);

        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    /* ============================================
       GAME FLOW CONTROL
       ============================================ */

    selectMode(mode) {
        this.gameMode = mode;
        this.modeSelection.style.display = 'none';

        if (mode === 'pvp') {
            this.startGame();
        } else if (mode === 'pva') {
            this.difficultySelection.style.display = 'block';
        }
    }

    selectDifficulty(difficulty) {
        this.aiDifficulty = difficulty;
        this.difficultySelection.style.display = 'none';
        this.startGame();
    }

    startGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.gameBoard.style.display = 'block';
        this.updateDisplay();
        this.renderBoard();

        // Update score label based on game mode
        const label = this.gameMode === 'pva' ? 'AI (O)' : 'Player O';
        this.scoreOLabel.textContent = label;

        // If AI and difficulty selected, notify user
        if (this.gameMode === 'pva') {
            this.showToast(`Playing vs AI on ${this.aiDifficulty} difficulty`, 'info');
        }
    }

    restartGame() {
        this.gameStatus.style.display = 'none';
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.updateDisplay();
        this.renderBoard();
    }

    backToMenu() {
        this.gameBoard.style.display = 'none';
        this.modeSelection.style.display = 'block';
        this.difficultySelection.style.display = 'none';
        this.gameStatus.style.display = 'none';
        this.gameMode = null;
        this.aiDifficulty = null;
    }

    resetScore() {
        if (confirm('Are you sure you want to reset all scores?')) {
            this.scores = { x: 0, o: 0, draws: 0 };
            this.gameHistory = [];
            this.saveData();
            this.updateScoreDisplay();
            this.renderHistory();
            this.showToast('Scores reset successfully', 'info');
        }
    }

    /* ============================================
       CELL INTERACTION & GAME LOGIC
       ============================================ */

    handleCellClick(index) {
        // Prevent clicks if: game over, cell filled, AI thinking, or AI's turn
        if (this.gameOver || this.board[index] !== null || this.isAIThinking) {
            return;
        }

        // If PvA and it's O's turn (AI), don't allow
        if (this.gameMode === 'pva' && this.currentPlayer === 'O') {
            return;
        }

        this.makeMove(index);

        // If AI game and it's now AI's turn
        if (this.gameMode === 'pva' && !this.gameOver && this.currentPlayer === 'O') {
            setTimeout(() => this.aiMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.playSound('click');
        this.renderBoard();

        const winner = this.checkWinner();
        if (winner) {
            this.endGame(winner);
            return;
        }

        if (this.isBoardFull()) {
            this.endGame('draw');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    checkWinner() {
        // Winning combinations
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const [a, b, c] of winningCombos) {
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return { player: this.board[a], combination: [a, b, c] };
            }
        }

        return null;
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }

    endGame(result) {
        this.gameOver = true;

        if (result === 'draw') {
            this.scores.draws++;
            this.showGameStatus('Game Over', "It's a Draw!", 'draw');
            this.playSound('draw');
            this.gameHistory.push({ result: 'draw', timestamp: new Date().toLocaleTimeString() });
        } else {
            const winner = result.player;
            if (winner === 'X') {
                this.scores.x++;
                this.showGameStatus('🎉 You Won!', 'Player X wins the game!', 'x-win');
            } else {
                this.scores.o++;
                const message = this.gameMode === 'pva' ? 'AI wins the game!' : 'Player O wins the game!';
                this.showGameStatus('Game Over', message, 'o-win');
            }

            this.playSound('win');
            this.highlightWinningCells(result.combination);
            this.gameHistory.push({ 
                result: `${winner}-win`, 
                timestamp: new Date().toLocaleTimeString(),
                difficulty: this.aiDifficulty 
            });
        }

        this.updateScoreDisplay();
        this.saveData();
        this.renderHistory();
    }

    highlightWinningCells(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('winning-line');
            this.cells[index].classList.add('winning');
        });
    }

    /* ============================================
       AI LOGIC - MINIMAX ALGORITHM
       ============================================ */

    aiMove() {
        this.isAIThinking = true;
        this.aiThinking.style.display = 'block';

        setTimeout(() => {
            let bestMove;

            switch (this.aiDifficulty) {
                case 'easy':
                    bestMove = this.getRandomMove();
                    break;
                case 'medium':
                    bestMove = Math.random() > 0.5 ? this.getBestMove() : this.getRandomMove();
                    break;
                case 'hard':
                    bestMove = this.getBestMove();
                    break;
                default:
                    bestMove = this.getBestMove();
            }

            this.isAIThinking = false;
            this.aiThinking.style.display = 'none';

            if (bestMove !== -1) {
                this.makeMove(bestMove);

                // Check if game continues
                if (!this.gameOver && this.currentPlayer === 'X') {
                    this.updateDisplay();
                }
            }
        }, 1000);
    }

    /**
     * MINIMAX ALGORITHM
     * This is the core AI logic. It explores all possible game states
     * recursively and assigns a score to each position.
     * 
     * How it works:
     * 1. If terminal state (win/loss/draw), return score
     * 2. For AI's turn (O), find move that maximizes score
     * 3. For opponent's turn (X), find move that minimizes score
     * 4. This creates an unbeatable strategy for hard mode
     */
    minimax(depth, isMaximizing) {
        const winner = this.checkWinner();

        // Terminal states: return score
        if (winner && winner.player === 'O') {
            return 10 - depth; // Prefer faster wins
        }
        if (winner && winner.player === 'X') {
            return depth - 10; // Prefer delayed losses
        }
        if (this.isBoardFull()) {
            return 0; // Draw
        }

        if (isMaximizing) {
            // AI's turn: maximize score
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'O';
                    const score = this.minimax(depth + 1, false);
                    this.board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            // Opponent's turn: minimize score
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'X';
                    const score = this.minimax(depth + 1, true);
                    this.board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = 'O';
                const score = this.minimax(0, false);
                this.board[i] = null;

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    getRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    /* ============================================
       DISPLAY & RENDERING
       ============================================ */

    renderBoard() {
        this.cells.forEach((cell, index) => {
            const value = this.board[index];
            cell.textContent = value || '';
            cell.classList.remove('x', 'o', 'filled', 'winning-line', 'winning');

            if (value) {
                cell.classList.add('filled', value.toLowerCase());
            }
        });
    }

    updateDisplay() {
        const playerName = this.currentPlayer === 'X' ? 'X' : (this.gameMode === 'pva' ? 'AI (O)' : 'O');
        this.turnText.textContent = `${playerName}'s Turn`;
        this.turnAvatar.textContent = this.currentPlayer;
    }

    updateScoreDisplay() {
        this.scoreX.textContent = this.scores.x;
        this.scoreO.textContent = this.scores.o;
        this.scoreDraw.textContent = this.scores.draws;
    }

    renderHistory() {
        const lastFiveGames = this.gameHistory.slice(-5);

        if (lastFiveGames.length === 0) {
            this.historyList.innerHTML = '<p style="color: var(--current-text-secondary); text-align: center;">No games played yet</p>';
            return;
        }

        this.historyList.innerHTML = lastFiveGames.reverse().map((game, index) => {
            const resultText = game.result === 'draw' ? 'Draw' : `${game.result.charAt(0).toUpperCase()} Wins`;
            const resultClass = game.result;
            const diffText = game.difficulty ? ` (${game.difficulty})` : '';

            return `
                <div class="history-item ${resultClass}">
                    <span>${resultText}${diffText}</span>
                    <span style="font-size: 0.9rem; color: var(--current-text-secondary);">${game.timestamp}</span>
                </div>
            `;
        }).join('');
    }

    showGameStatus(title, message, type) {
        document.getElementById('statusTitle').textContent = title;
        document.getElementById('statusMessage').textContent = message;
        this.gameStatus.style.display = 'flex';
    }

    /* ============================================
       UTILITIES
       ============================================ */

    playSound(type) {
        try {
            const audioElement = document.getElementById(`${type}Sound`);
            if (audioElement) {
                audioElement.currentTime = 0;
                audioElement.play().catch(() => {
                    // Sound play failed silently
                });
            }
        } catch (e) {
            // Audio not supported
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /* ============================================
       DATA PERSISTENCE
       ============================================ */

    saveData() {
        const data = {
            scores: this.scores,
            gameHistory: this.gameHistory.slice(-20) // Keep last 20 games
        };
        localStorage.setItem('ticTacToeData', JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem('ticTacToeData');
        if (data) {
            const parsed = JSON.parse(data);
            this.scores = parsed.scores || { x: 0, o: 0, draws: 0 };
            this.gameHistory = parsed.gameHistory || [];
        }
    }
}

/* ============================================
   INITIALIZATION
   ============================================ */

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new TicTacToe();

    // Update score display on load
    game.updateScoreDisplay();
    game.renderHistory();

    // Add keyboard support (optional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (game.gameBoard.style.display === 'block') {
                game.backToMenu();
            }
        }
    });
});

/* ============================================
   FEATURE ENHANCEMENTS
   ============================================ */

// Prevent context menu on cells (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('cell')) {
        e.preventDefault();
    }
});
