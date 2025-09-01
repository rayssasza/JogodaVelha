/**
 * Jogo da Velha Binário - Sistema Principal
 * 
 * Um jogo da velha moderno com tema de programação onde os jogadores
 * usam os símbolos 0 e 1, criando um trocadilho divertido com o mundo
 * da programação e sistemas binários.
 * 
 * Arquitetura: Modular e orientada a objetos para fácil manutenção
 */

import { BinaryGameBoard } from './modules/binaryGameBoard.js';
import { BinaryGameLogic } from './modules/binaryGameLogic.js';
import { BinaryUIController } from './modules/binaryUIController.js';
import { BinaryAIPlayer } from './modules/binaryAIPlayer.js';

/**
 * Classe principal que orquestra o Jogo da Velha Binário
 * Gerencia o estado global e coordena todos os módulos
 */
class BinaryTicTacToe {
    constructor() {
        // Inicialização dos módulos especializados
        this.gameBoard = new BinaryGameBoard();
        this.gameLogic = new BinaryGameLogic();
        this.uiController = new BinaryUIController();
        this.aiPlayer = new BinaryAIPlayer();
        
        // Estado central do jogo
        this.gameState = {
            isGameActive: false,
            currentMode: null, // 'two-players' ou 'ai-player'
            currentPlayer: '1', // Jogador 1 sempre começa (como true em programação)
            isAIProcessing: false,
            sessionStats: { 
                '1': 0, 
                '0': 0,
                totalGames: 0,
                draws: 0
            }
        };
        
        // Bind de métodos para preservar contexto
        this.handleCellClick = this.handleCellClick.bind(this);
        this.handleModeSelection = this.handleModeSelection.bind(this);
        this.handleNewGame = this.handleNewGame.bind(this);
        this.handleBackToMenu = this.handleBackToMenu.bind(this);
        
        this.initializeApplication();
    }
    
    /**
     * Inicializa toda a aplicação configurando eventos e interface
     */
    initializeApplication() {
        console.log('🚀 Inicializando Jogo da Velha Binário...');
        
        // Configurar todos os event listeners
        this.setupModeSelection();
        this.setupGameControls();
        this.setupResultModal();
        this.setupKeyboardControls();
        this.setupAccessibilityFeatures();
        
        // Mostrar mensagem de boas-vindas
        this.uiController.showWelcomeMessage();
        
        console.log('✅ Aplicação inicializada com sucesso!');
    }
    
    /**
     * Configura os controles de seleção de modo
     */
    setupModeSelection() {
        const twoPlayersBtn = document.getElementById('two-players-btn');
        const aiPlayerBtn = document.getElementById('ai-player-btn');
        
        twoPlayersBtn.addEventListener('click', () => {
            this.handleModeSelection('two-players');
        });
        
        aiPlayerBtn.addEventListener('click', () => {
            this.handleModeSelection('ai-player');
        });
    }
    
    /**
     * Configura controles principais do jogo
     */
    setupGameControls() {
        const newGameBtn = document.getElementById('new-game-btn');
        const changeModeBtn = document.getElementById('change-mode-btn');
        
        newGameBtn.addEventListener('click', this.handleNewGame);
        changeModeBtn.addEventListener('click', this.handleBackToMenu);
    }
    
    /**
     * Configura controles do modal de resultado
     */
    setupResultModal() {
        const playAgainBtn = document.getElementById('play-again-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        
        playAgainBtn.addEventListener('click', this.handleNewGame);
        backToMenuBtn.addEventListener('click', this.handleBackToMenu);
    }
    
    /**
     * Implementa controles por teclado para acessibilidade
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            // Navegação numérica no tabuleiro (1-9)
            if (this.gameState.isGameActive && !this.gameState.isAIProcessing) {
                const key = parseInt(event.key);
                if (key >= 1 && key <= 9) {
                    const cellIndex = key - 1;
                    const cell = this.gameBoard.getCell(cellIndex);
                    if (cell && !cell.classList.contains('occupied')) {
                        this.handleCellClick({ target: cell });
                    }
                }
            }
            
            // Atalhos de controle
            switch(event.key.toLowerCase()) {
                case 'n':
                    if (this.gameState.isGameActive) {
                        this.handleNewGame();
                    }
                    break;
                case 'escape':
                    this.uiController.hideResultModal();
                    break;
                case 'm':
                    if (this.gameState.isGameActive) {
                        this.handleBackToMenu();
                    }
                    break;
            }
        });
    }
    
    /**
     * Configura recursos de acessibilidade avançados
     */
    setupAccessibilityFeatures() {
        // Anunciar mudanças importantes para leitores de tela
        this.uiController.setupScreenReaderAnnouncements();
        
        // Configurar indicadores visuais para usuários com deficiência auditiva
        this.uiController.setupVisualFeedback();
    }
    
    /**
     * Gerencia a seleção do modo de jogo
     */
    handleModeSelection(mode) {
        console.log(`🎯 Modo selecionado: ${mode}`);
        
        this.gameState.currentMode = mode;
        this.gameState.isGameActive = true;
        this.gameState.currentPlayer = '1'; // 1 sempre começa (como true)
        
        // Transição visual suave
        this.uiController.showGameBoard();
        this.uiController.updateCurrentPlayerIndicator(this.gameState.currentPlayer);
        this.uiController.applyModeTheme(mode);
        
        // Inicializar tabuleiro
        this.gameBoard.initialize(this.handleCellClick);
        
        // Feedback para o usuário
        const modeText = mode === 'two-players' ? 'Modo Duplo' : 'Vs Algoritmo';
        this.uiController.showNotification(`${modeText} ativado!`, 'success');
    }
    
    /**
     * Processa cliques nas células do tabuleiro
     */
    async handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.dataset.index);
        
        // Validações de segurança
        if (!this.gameState.isGameActive || 
            cell.classList.contains('occupied') || 
            this.gameState.isAIProcessing) {
            return;
        }
        
        console.log(`💾 Bit ${this.gameState.currentPlayer} gravado na posição [${cellIndex}]`);
        
        // Executar jogada
        this.gameBoard.makeMove(cellIndex, this.gameState.currentPlayer);
        
        // Verificar condições de fim de jogo
        const gameResult = this.gameLogic.checkGameEnd(this.gameBoard.getBoardState());
        
        if (gameResult.isGameOver) {
            this.handleGameEnd(gameResult);
            return;
        }
        
        // Alternar jogador
        this.switchPlayer();
        
        // Processar turno da IA se necessário
        if (this.gameState.currentMode === 'ai-player' && this.gameState.currentPlayer === '0') {
            await this.handleAITurn();
        }
    }
    
    /**
     * Gerencia o turno da IA com feedback visual
     */
    async handleAITurn() {
        this.gameState.isAIProcessing = true;
        
        // Feedback visual de processamento
        this.uiController.showAIProcessing(true);
        
        // Simular tempo de processamento para melhor UX
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // IA calcula e executa jogada
        const aiMove = this.aiPlayer.calculateBestMove(this.gameBoard.getBoardState());
        
        if (aiMove !== -1) {
            this.gameBoard.makeMove(aiMove, '0');
            
            // Verificar resultado após jogada da IA
            const gameResult = this.gameLogic.checkGameEnd(this.gameBoard.getBoardState());
            
            if (gameResult.isGameOver) {
                this.handleGameEnd(gameResult);
            } else {
                this.switchPlayer();
            }
        }
        
        this.gameState.isAIProcessing = false;
        this.uiController.showAIProcessing(false);
    }
    
    /**
     * Alterna entre jogadores e atualiza interface
     */
    switchPlayer() {
        this.gameState.currentPlayer = this.gameState.currentPlayer === '1' ? '0' : '1';
        this.uiController.updateCurrentPlayerIndicator(this.gameState.currentPlayer);
        
        // Anunciar mudança para acessibilidade
        const playerName = this.gameState.currentPlayer === '1' ? 'um' : 'zero';
        this.uiController.announceToScreenReader(`Vez do jogador ${playerName}`);
    }
    
    /**
     * Processa o fim do jogo e atualiza estatísticas
     */
    handleGameEnd(gameResult) {
        console.log('🏁 Fim de execução:', gameResult);
        
        this.gameState.isGameActive = false;
        this.gameState.totalGames++;
        
        // Destacar sequência vencedora
        if (gameResult.winningCombination) {
            this.gameBoard.highlightWinningSequence(gameResult.winningCombination);
        }
        
        // Atualizar estatísticas da sessão
        this.updateSessionStats(gameResult);
        
        // Mostrar resultado com delay para visualização
        setTimeout(() => {
            this.uiController.showGameResult(gameResult, this.gameState.currentMode);
        }, 1200);
    }
    
    /**
     * Atualiza estatísticas da sessão atual
     */
    updateSessionStats(gameResult) {
        if (gameResult.winner === 'draw') {
            this.gameState.sessionStats.draws++;
        } else if (gameResult.winner) {
            this.gameState.sessionStats[gameResult.winner]++;
        }
        
        this.gameState.sessionStats.totalGames++;
        this.uiController.updateScoreboard(this.gameState.sessionStats);
        
        console.log('📊 Estatísticas atualizadas:', this.gameState.sessionStats);
    }
    
    /**
     * Inicia nova partida mantendo modo e estatísticas
     */
    handleNewGame() {
        console.log('🔄 Reinicializando sistema...');
        
        this.gameBoard.reset();
        this.gameState.isGameActive = true;
        this.gameState.currentPlayer = '1'; // 1 sempre inicia
        this.gameState.isAIProcessing = false;
        
        this.uiController.hideResultModal();
        this.uiController.updateCurrentPlayerIndicator(this.gameState.currentPlayer);
        
        this.uiController.showNotification('Sistema reinicializado!', 'info');
    }
    
    /**
     * Retorna ao menu principal resetando tudo
     */
    handleBackToMenu() {
        console.log('🏠 Retornando ao menu principal...');
        
        // Reset completo do estado
        this.gameBoard.reset();
        this.gameState = {
            isGameActive: false,
            currentMode: null,
            currentPlayer: '1',
            isAIProcessing: false,
            sessionStats: { 
                '1': 0, 
                '0': 0,
                totalGames: 0,
                draws: 0
            }
        };
        
        // Voltar para seleção de modo
        this.uiController.showModeSelection();
        this.uiController.hideResultModal();
        this.uiController.updateScoreboard(this.gameState.sessionStats);
        
        this.uiController.showNotification('Voltando ao menu...', 'info');
    }
    
    /**
     * Retorna estatísticas detalhadas da sessão
     */
    getSessionStats() {
        return {
            ...this.gameState.sessionStats,
            winRate: {
                '1': this.gameState.sessionStats.totalGames > 0 
                    ? (this.gameState.sessionStats['1'] / this.gameState.sessionStats.totalGames * 100).toFixed(1)
                    : 0,
                '0': this.gameState.sessionStats.totalGames > 0 
                    ? (this.gameState.sessionStats['0'] / this.gameState.sessionStats.totalGames * 100).toFixed(1)
                    : 0
            }
        };
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔌 DOM carregado, inicializando aplicação binária...');
    
    // Criar instância global do jogo
    window.binaryTicTacToe = new BinaryTicTacToe();
    
    // Easter egg: log binário no console
    console.log(`
    ╔══════════════════════════════════════╗
    ║  01001010 JOGO DA VELHA 01010101     ║
    ║  Sistema inicializado com sucesso!   ║
    ║  Versão: 1.0.0 | Build: ${Date.now().toString(2).slice(-8)} ║
    ╚══════════════════════════════════════╝
    `);
});

// Adicionar alguns easter eggs para desenvolvedores
window.getBinaryStats = () => {
    if (window.binaryTicTacToe) {
        return window.binaryTicTacToe.getSessionStats();
    }
    return null;
};

window.toggleDebugMode = () => {
    document.body.classList.toggle('debug-mode');
    console.log('🐛 Modo debug alternado');
};