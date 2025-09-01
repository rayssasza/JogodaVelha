/**
 * Lógica do Jogo 
 * 
 * Implementa toda a lógica de negócio do jogo da velha com o tema binário.
 * Trabalha com os símbolos '0' e '1' mantendo todas as regras
 * clássicas do jogo da velha tradicional.
 */

export class BinaryGameLogic {
    constructor() {
        // Padrões de vitória: todas as combinações possíveis
        // Organizadas como sequências binárias vencedoras
        this.winningPatterns = [
            // Sequências horizontais (linhas)
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // Sequências verticais (colunas)
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // Sequências diagonais
            [0, 4, 8], [2, 4, 6]
        ];
        
        console.log('🧠 BinaryGameLogic inicializado com', this.winningPatterns.length, 'padrões de vitória');
    }
    
    /**
     * Verifica se o jogo terminou (vitória ou buffer overflow/empate)
     * @param {Array} boardState - Estado atual do tabuleiro
     * @returns {Object} Resultado detalhado do jogo
     */
    checkGameEnd(boardState) {
        // Verificar padrões de vitória
        const victoryResult = this.checkVictoryPatterns(boardState);
        if (victoryResult.hasWinner) {
            return {
                isGameOver: true,
                winner: victoryResult.winner,
                winningCombination: victoryResult.winningPattern,
                type: 'victory',
                message: this.getVictoryMessage(victoryResult.winner)
            };
        }
        
        // Verificar buffer overflow (empate)
        if (this.isBufferFull(boardState)) {
            return {
                isGameOver: true,
                winner: 'draw',
                winningCombination: null,
                type: 'overflow',
                message: 'Buffer overflow! Memória cheia sem padrão vencedor.'
            };
        }
        
        // Jogo em execução
        return {
            isGameOver: false,
            winner: null,
            winningCombination: null,
            type: 'running',
            message: 'Sistema em execução...'
        };
    }
    
    /**
     * Verifica todos os padrões de vitória
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {Object} Resultado da verificação
     */
    checkVictoryPatterns(boardState) {
        for (const pattern of this.winningPatterns) {
            const [a, b, c] = pattern;
            
            // Verificar se as três posições formam uma sequência válida
            if (boardState[a] && 
                boardState[a] === boardState[b] && 
                boardState[a] === boardState[c]) {
                
                console.log(`🎯 Padrão vencedor detectado! Bit ${boardState[a]} em sequência [${pattern}]`);
                
                return {
                    hasWinner: true,
                    winner: boardState[a],
                    winningPattern: pattern,
                    patternType: this.getPatternType(pattern)
                };
            }
        }
        
        return {
            hasWinner: false,
            winner: null,
            winningPattern: null,
            patternType: null
        };
    }
    
    /**
     * Determina o tipo do padrão vencedor
     * @param {Array} pattern - Padrão vencedor
     * @returns {string} Tipo do padrão
     */
    getPatternType(pattern) {
        const [a, b, c] = pattern;
        
        // Verificar se é linha horizontal
        if (Math.floor(a / 3) === Math.floor(b / 3) && Math.floor(b / 3) === Math.floor(c / 3)) {
            return 'horizontal';
        }
        
        // Verificar se é coluna vertical
        if (a % 3 === b % 3 && b % 3 === c % 3) {
            return 'vertical';
        }
        
        // Deve ser diagonal
        return 'diagonal';
    }
    
    /**
     * Verifica se o buffer (tabuleiro) está cheio
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {boolean} True se todas as posições estão ocupadas
     */
    isBufferFull(boardState) {
        return boardState.every(cell => cell !== null);
    }
    
    /**
     * Valida se uma operação de escrita é possível
     * @param {Array} boardState - Estado do tabuleiro
     * @param {number} position - Posição para escrever
     * @returns {boolean} True se a operação é válida
     */
    isValidWrite(boardState, position) {
        return position >= 0 && 
               position < 9 && 
               boardState[position] === null;
    }
    
    /**
     * Simula uma operação de escrita sem modificar o estado original
     * @param {Array} boardState - Estado atual
     * @param {number} position - Posição para escrever
     * @param {string} bit - Bit a ser escrito ('0' ou '1')
     * @returns {Array|null} Novo estado ou null se inválido
     */
    simulateWrite(boardState, position, bit) {
        if (!this.isValidWrite(boardState, position)) {
            return null;
        }
        
        const newState = [...boardState];
        newState[position] = bit;
        return newState;
    }
    
    /**
     * Retorna todas as posições disponíveis para escrita
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {Array} Array com índices das posições vazias
     */
    getAvailablePositions(boardState) {
        return boardState
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
    }
    
    /**
     * Avalia o estado do tabuleiro para algoritmos de IA
     * @param {Array} boardState - Estado do tabuleiro
     * @param {string} maximizingBit - Bit que está maximizando ('0' ou '1')
     * @returns {number} Pontuação do estado
     */
    evaluateState(boardState, maximizingBit) {
        const result = this.checkGameEnd(boardState);
        
        if (!result.isGameOver) {
            return 0; // Estado neutro
        }
        
        if (result.winner === 'draw') {
            return 0; // Empate
        }
        
        // Retorna 1 se o bit maximizador venceu, -1 caso contrário
        return result.winner === maximizingBit ? 1 : -1;
    }
    
    /**
     * Gera mensagem de vitória temática
     * @param {string} winner - Bit vencedor
     * @returns {string} Mensagem personalizada
     */
    getVictoryMessage(winner) {
        const messages = {
            '1': [
                'Bit 1 executou sequência vencedora!',
                'Algoritmo do jogador 1 foi superior!',
                'Condição TRUE alcançada pelo bit 1!',
                'Player 1 compilou a vitória com sucesso!'
            ],
            '0': [
                'Bit 0 dominou o sistema!',
                'Algoritmo do jogador 0 foi mais eficiente!',
                'Condição FALSE resultou em vitória!',
                'Player 0 executou o código perfeito!'
            ]
        };
        
        const playerMessages = messages[winner];
        return playerMessages[Math.floor(Math.random() * playerMessages.length)];
    }
    
    /**
     * Analisa padrões estratégicos no tabuleiro
     * @param {Array} boardState - Estado do tabuleiro
     * @param {string} bit - Bit para analisar
     * @returns {Object} Análise estratégica
     */
    analyzeStrategicPatterns(boardState, bit) {
        let threatsCount = 0;
        let opportunitiesCount = 0;
        let controlledCenter = boardState[4] === bit;
        let controlledCorners = [0, 2, 6, 8].filter(pos => boardState[pos] === bit).length;
        
        for (const pattern of this.winningPatterns) {
            const [a, b, c] = pattern;
            const positions = [boardState[a], boardState[b], boardState[c]];
            const bitCount = positions.filter(pos => pos === bit).length;
            const emptyCount = positions.filter(pos => pos === null).length;
            const opponentCount = positions.filter(pos => pos !== null && pos !== bit).length;
            
            // Oportunidade de vitória (2 bits próprios + 1 vazio)
            if (bitCount === 2 && emptyCount === 1) {
                opportunitiesCount++;
            }
            
            // Ameaça do oponente (2 bits oponente + 1 vazio)
            if (opponentCount === 2 && emptyCount === 1) {
                threatsCount++;
            }
        }
        
        return {
            threats: threatsCount,
            opportunities: opportunitiesCount,
            centerControl: controlledCenter,
            cornerControl: controlledCorners,
            strategicValue: this.calculateStrategicValue(threatsCount, opportunitiesCount, controlledCenter, controlledCorners)
        };
    }
    
    /**
     * Calcula valor estratégico da posição
     */
    calculateStrategicValue(threats, opportunities, centerControl, cornerControl) {
        let value = 0;
        
        value += opportunities * 10; // Oportunidades de vitória são valiosas
        value += threats * 8; // Ameaças precisam ser bloqueadas
        value += centerControl ? 5 : 0; // Centro é estratégico
        value += cornerControl * 2; // Cantos são importantes
        
        return value;
    }
    
    /**
     * Converte estado do tabuleiro para string binária
     * @param {Array} boardState - Estado do tabuleiro
     * @returns {string} Representação binária
     */
    toBinaryRepresentation(boardState) {
        return boardState
            .map(cell => cell === null ? '_' : cell)
            .join('');
    }
}

// Adicionar estilos para efeitos de partículas
const logicStyles = document.createElement('style');
logicStyles.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(0.3) rotate(360deg);
        }
    }
`;
document.head.appendChild(logicStyles);