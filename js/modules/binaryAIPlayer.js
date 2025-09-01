/**
 * Inteligência Artificial sendo o jogador 0 (false)
 * 
 * IA especializada para o jogo usando algoritmo Minimax otimizado.
 * A IA joga com o bit '0' e implementa estratégias que remetem a
 * algoritmos de programação, mantendo o jogo desafiador, mas justo.
 */

import { BinaryGameLogic } from './binaryGameLogic.js';

export class BinaryAIPlayer {
    constructor() {
        this.gameLogic = new BinaryGameLogic();
        
        // Configurações da IA
        this.aiConfig = {
            bit: '0',              // IA sempre joga com 0
            opponentBit: '1',      // Humano joga com 1
            difficulty: 0.88,      // 88% de chance de jogada ótima
            maxDepth: 9,           // Profundidade máxima do Minimax
            thinkingTime: 800      // Tempo mínimo de "processamento"
        };
        
        // Estatísticas da IA
        this.stats = {
            totalMoves: 0,
            optimalMoves: 0,
            strategicMoves: 0,
            randomMoves: 0
        };
        
        console.log('🤖 BinaryAIPlayer inicializado');
        console.log('⚙️ Configuração:', this.aiConfig);
    }
    
    /**
     * Calcula a melhor jogada para o estado atual
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {number} Índice da posição escolhida
     */
    calculateBestMove(boardState) {
        const startTime = performance.now();
        const availablePositions = this.gameLogic.getAvailablePositions(boardState);
        
        if (availablePositions.length === 0) {
            return -1; // Sem jogadas disponíveis
        }
        
        console.log('🧮 IA analisando', availablePositions.length, 'posições disponíveis...');
        
        this.stats.totalMoves++;
        
        // Estratégia baseada no estado do jogo
        let chosenMove;
        
        if (availablePositions.length === 9) {
            // Primeira jogada: estratégia de abertura
            chosenMove = this.getOpeningStrategy();
            this.stats.strategicMoves++;
        } else if (availablePositions.length >= 6) {
            // Início do jogo: misturar estratégia e otimização
            chosenMove = Math.random() < this.aiConfig.difficulty 
                ? this.getOptimalMove(boardState)
                : this.getStrategicMove(boardState);
        } else {
            // Final do jogo: sempre jogar otimamente
            chosenMove = this.getOptimalMove(boardState);
            this.stats.optimalMoves++;
        }
        
        const endTime = performance.now();
        console.log(`⚡ IA processou em ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`🎯 Jogada escolhida: posição [${chosenMove}]`);
        
        return chosenMove;
    }
    
    /**
     * Estratégia da IA
     * Baseada em princípios clássicos: centro primeiro, depois cantos
     */
    getOpeningStrategy() {
        // Estratégias com diferentes complexidades, fazendo referencia a programação/ estrutura de dados:
        const strategies = {
            center: [4],                    // Centro: O(1) - acesso direto
            corners: [0, 2, 6, 8],         // Cantos: O(log n) - busca binária
            edges: [1, 3, 5, 7]            // Bordas: O(n) - busca linear
        };
        
        // Priorizar centro (melhor complexidade)
        if (Math.random() < 0.7) {
            console.log('🎯 IA escolheu estratégia CENTER (O(1))');
            return strategies.center[0];
        }
        
        // Senão, escolher canto aleatório
        const corners = strategies.corners;
        const chosenCorner = corners[Math.floor(Math.random() * corners.length)];
        console.log('🎯 IA escolheu estratégia CORNER (O(log n))');
        return chosenCorner;
    }
    
    /**
     * Calcula jogada ótima usando Minimax
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {number} Melhor jogada possível
     */
    getOptimalMove(boardState) {
        let bestScore = -Infinity;
        let bestMove = -1;
        
        const availablePositions = this.gameLogic.getAvailablePositions(boardState);
        
        // Avaliar cada posição possível
        for (const position of availablePositions) {
            const newState = this.gameLogic.simulateWrite(boardState, position, this.aiConfig.bit);
            const score = this.minimax(newState, 0, false, -Infinity, Infinity);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = position;
            }
        }
        
        console.log(`🧠 Minimax calculou jogada ótima: [${bestMove}] com score ${bestScore}`);
        return bestMove;
    }
    
    /**
     * Algoritmo Minimax com poda Alpha-Beta
     * @param {Array} boardState - Estado do tabuleiro
     * @param {number} depth - Profundidade atual
     * @param {boolean} isMaximizing - Se está maximizando
     * @param {number} alpha - Valor alpha para poda
     * @param {number} beta - Valor beta para poda
     * @returns {number} Pontuação da jogada
     */
    minimax(boardState, depth, isMaximizing, alpha, beta) {
        // Verificar condição de parada
        const result = this.gameLogic.checkGameEnd(boardState);
        
        if (result.isGameOver || depth >= this.aiConfig.maxDepth) {
            const score = this.gameLogic.evaluateState(boardState, this.aiConfig.bit);
            // Penalizar jogadas que demoram mais
            return score * (10 - depth);
        }
        
        const availablePositions = this.gameLogic.getAvailablePositions(boardState);
        
        if (isMaximizing) {
            // IA está jogando (maximizando)
            let maxScore = -Infinity;
            
            for (const position of availablePositions) {
                const newState = this.gameLogic.simulateWrite(boardState, position, this.aiConfig.bit);
                const score = this.minimax(newState, depth + 1, false, alpha, beta);
                
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, score);
                
                // Poda Alpha-Beta
                if (beta <= alpha) {
                    break;
                }
            }
            
            return maxScore;
        } else {
            // Oponente está jogando (minimizando)
            let minScore = Infinity;
            
            for (const position of availablePositions) {
                const newState = this.gameLogic.simulateWrite(boardState, position, this.aiConfig.opponentBit);
                const score = this.minimax(newState, depth + 1, true, alpha, beta);
                
                minScore = Math.min(score, minScore);
                beta = Math.min(beta, score);
                
                // Poda Alpha-Beta
                if (beta <= alpha) {
                    break;
                }
            }
            
            return minScore;
        }
    }
    
    /**
     * Retorna jogada estratégica (boa mas não necessariamente perfeita)
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {number} Jogada estratégica
     */
    getStrategicMove(boardState) {
        // Verificar se pode vencer imediatamente
        const winningMove = this.findImmediateWin(boardState, this.aiConfig.bit);
        if (winningMove !== -1) {
            console.log('🏆 IA encontrou vitória imediata');
            return winningMove;
        }
        
        // Verificar se precisa bloquear oponente
        const blockingMove = this.findImmediateWin(boardState, this.aiConfig.opponentBit);
        if (blockingMove !== -1) {
            console.log('🛡️ IA bloqueou ameaça do oponente');
            return blockingMove;
        }
        
        // Jogada estratégica baseada em heurísticas
        return this.getHeuristicMove(boardState);
    }
    
    /**
     * Encontra jogada que resulta em vitória imediata
     * @param {Array} boardState - Estado do tabuleiro
     * @param {string} bit - Bit para verificar
     * @returns {number} Posição da vitória ou -1
     */
    findImmediateWin(boardState, bit) {
        const availablePositions = this.gameLogic.getAvailablePositions(boardState);
        
        for (const position of availablePositions) {
            const testState = this.gameLogic.simulateWrite(boardState, position, bit);
            const result = this.gameLogic.checkGameEnd(testState);
            
            if (result.isGameOver && result.winner === bit) {
                return position;
            }
        }
        
        return -1;
    }
    
    /**
     * Escolhe jogada baseada em heurísticas de programação
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {number} Jogada heurística
     */
    getHeuristicMove(boardState) {
        const availablePositions = this.gameLogic.getAvailablePositions(boardState);
        
        // Prioridades como estruturas de dados
        const priorities = {
            center: [4],           // Stack: LIFO - centro primeiro
            corners: [0, 2, 6, 8], // Array: acesso indexado
            edges: [1, 3, 5, 7]    // Queue: FIFO - bordas por último
        };
        
        // Verificar centro
        if (availablePositions.includes(4)) {
            console.log('🎯 IA escolheu centro (estratégia STACK)');
            return 4;
        }
        
        // Verificar cantos disponíveis
        const availableCorners = priorities.corners.filter(corner => 
            availablePositions.includes(corner)
        );
        if (availableCorners.length > 0) {
            const chosen = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            console.log('🎯 IA escolheu canto (estratégia ARRAY)');
            return chosen;
        }
        
        // Por último, bordas
        const availableEdges = priorities.edges.filter(edge => 
            availablePositions.includes(edge)
        );
        if (availableEdges.length > 0) {
            const chosen = availableEdges[Math.floor(Math.random() * availableEdges.length)];
            console.log('🎯 IA escolheu borda (estratégia QUEUE)');
            return chosen;
        }
        
        // Fallback: primeira posição disponível
        this.stats.randomMoves++;
        return availablePositions[0];
    }
    
    /**
     * Ajusta dificuldade da IA dinamicamente
     * @param {number} newDifficulty - Nova dificuldade (0.0 a 1.0)
     */
    adjustDifficulty(newDifficulty) {
        this.aiConfig.difficulty = Math.max(0, Math.min(1, newDifficulty));
        console.log('⚙️ Dificuldade da IA ajustada para:', this.aiConfig.difficulty);
    }
    
    /**
     * Retorna estatísticas detalhadas da IA
     * @returns {Object} Estatísticas completas
     */
    getDetailedStats() {
        const total = this.stats.totalMoves;
        
        return {
            ...this.stats,
            efficiency: {
                optimal: total > 0 ? (this.stats.optimalMoves / total * 100).toFixed(1) : 0,
                strategic: total > 0 ? (this.stats.strategicMoves / total * 100).toFixed(1) : 0,
                random: total > 0 ? (this.stats.randomMoves / total * 100).toFixed(1) : 0
            },
            config: this.aiConfig
        };
    }
    
    /**
     * Reseta estatísticas da IA
     */
    resetStats() {
        this.stats = {
            totalMoves: 0,
            optimalMoves: 0,
            strategicMoves: 0,
            randomMoves: 0
        };
        console.log('📊 Estatísticas da IA resetadas');
    }
    
    /**
     * Simula diferentes personalidades de IA
     * @param {string} personality - Tipo de personalidade
     */
    setPersonality(personality) {
        const personalities = {
            aggressive: { difficulty: 0.95, thinkingTime: 600 },
            balanced: { difficulty: 0.85, thinkingTime: 800 },
            friendly: { difficulty: 0.70, thinkingTime: 1000 },
            beginner: { difficulty: 0.50, thinkingTime: 1200 }
        };
        
        if (personalities[personality]) {
            Object.assign(this.aiConfig, personalities[personality]);
            console.log(`🎭 IA assumiu personalidade: ${personality}`);
        }
    }
}

// Easter egg: adicionar IA ao escopo global para debug
window.getAIStats = () => {
    if (window.binaryTicTacToe && window.binaryTicTacToe.aiPlayer) {
        return window.binaryTicTacToe.aiPlayer.getDetailedStats();
    }
    return null;
};