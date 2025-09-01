/**
 * Módulo do Tabuleiro 
 * 
 * Gerencia o tabuleiro do jogo
 * Usa símbolos 0 e 1 para criar a referência
 * ao sistema binário da computação.
 */

export class BinaryGameBoard {
    constructor() {
        // Estado do tabuleiro: array de 9 posições (null, '0', ou '1')
        this.boardState = Array(9).fill(null);
        
        // Referência para o container do tabuleiro
        this.boardElement = document.getElementById('game-board');
        
        // Callback para cliques (definido externamente)
        this.onCellClick = null;
        
        // Mapeamento de posições para coordenadas
        this.positionMap = [
            '[0,0]', '[0,1]', '[0,2]',
            '[1,0]', '[1,1]', '[1,2]',
            '[2,0]', '[2,1]', '[2,2]'
        ];
        
        console.log('📋 BinaryGameBoard inicializado');
    }
    
    /**
     * Inicializa o tabuleiro criando a grade 3x3
     */
    initialize(onCellClick) {
        this.onCellClick = onCellClick;
        this.createBinaryGrid();
        this.reset();
    }
    
    /**
     * Cria a grade de células com tema binário
     */
    createBinaryGrid() {
        this.boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'game-cell';
            cell.dataset.index = i;
            
            // Acessibilidade com tema de programação
            const position = this.positionMap[i];
            cell.setAttribute('aria-label', `Posição ${position}, célula ${i + 1}`);
            cell.setAttribute('role', 'gridcell');
            
            // Adicionar indicador de posição sutil
            const positionIndicator = document.createElement('span');
            positionIndicator.className = 'position-indicator';
            positionIndicator.textContent = position;
            cell.appendChild(positionIndicator);
            
            // Event listener
            cell.addEventListener('click', this.onCellClick);
            
            // Adicionar ao tabuleiro
            this.boardElement.appendChild(cell);
        }
        
        console.log('🎯 Grade binária 3x3 criada');
    }
    
    /**
     * Executa uma jogada (escreve um bit na posição)
     */
    makeMove(cellIndex, player) {
        if (cellIndex < 0 || cellIndex > 8 || this.boardState[cellIndex] !== null) {
            console.warn(`⚠️ Tentativa de escrita inválida na posição ${cellIndex}`);
            return false;
        }
        
        // Atualizar estado interno
        this.boardState[cellIndex] = player;
        
        // Atualizar célula visual
        const cell = this.getCell(cellIndex);
        this.writeBitToCell(cell, player);
        
        console.log(`✅ Bit ${player} gravado na posição [${cellIndex}]`);
        return true;
    }
    
    /**
     * "Escreve" um bit na célula com animação
     */
    writeBitToCell(cell, player) {
        // Remover indicador de posição
        const positionIndicator = cell.querySelector('.position-indicator');
        if (positionIndicator) {
            positionIndicator.remove();
        }
        
        // Criar elemento do bit
        const bitElement = document.createElement('span');
        bitElement.className = 'symbol';
        bitElement.textContent = player;
        bitElement.setAttribute('aria-hidden', 'true');
        
        // Aplicar classes de estilo
        cell.classList.add('occupied', `player-${player}`);
        cell.appendChild(bitElement);
        
        // Atualizar acessibilidade
        const position = this.positionMap[parseInt(cell.dataset.index)];
        cell.setAttribute('aria-label', 
            `Posição ${position}, ocupada pelo bit ${player}`
        );
        
        // Desabilitar célula
        cell.disabled = true;
        
        // Efeito visual de "escrita de dados"
        this.addWriteEffect(cell);
    }
    
    /**
     * Adiciona efeito visual de escrita de dados
     */
    addWriteEffect(cell) {
        cell.style.animation = 'dataWrite 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            cell.style.animation = '';
        }, 400);
    }
    
    /**
     * Destaca a sequência vencedora com efeitos visuais
     */
    highlightWinningSequence(winningCombination) {
        console.log('🏆 Destacando sequência vencedora:', winningCombination);
        
        winningCombination.forEach((cellIndex, delay) => {
            setTimeout(() => {
                const cell = this.getCell(cellIndex);
                cell.classList.add('winning');
                
                // Efeito sonoro visual (piscada)
                this.addVictoryEffect(cell);
            }, delay * 200);
        });
    }
    
    /**
     * Adiciona efeito de vitória na célula
     */
    addVictoryEffect(cell) {
        // Criar partículas binárias
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createBinaryParticle(cell);
            }, i * 100);
        }
    }
    
    /**
     * Cria partícula binária para efeito de vitória
     */
    createBinaryParticle(cell) {
        const particle = document.createElement('span');
        particle.textContent = Math.random() > 0.5 ? '1' : '0';
        particle.style.cssText = `
            position: absolute;
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--accent-primary);
            pointer-events: none;
            animation: particleFloat 1s ease-out forwards;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        
        cell.style.position = 'relative';
        cell.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    /**
     * Reseta o tabuleiro para nova execução
     */
    reset() {
        console.log('🔄 Formatando tabuleiro...');
        
        // Limpar estado interno
        this.boardState = Array(9).fill(null);
        
        // Limpar células visuais
        const cells = this.boardElement.querySelectorAll('.game-cell');
        cells.forEach((cell, index) => {
            cell.innerHTML = '';
            cell.className = 'game-cell';
            cell.disabled = false;
            
            // Restaurar indicador de posição
            const positionIndicator = document.createElement('span');
            positionIndicator.className = 'position-indicator';
            positionIndicator.textContent = this.positionMap[index];
            cell.appendChild(positionIndicator);
            
            // Restaurar aria-label
            cell.setAttribute('aria-label', `Posição ${this.positionMap[index]}, célula ${index + 1}`);
        });
    }
    
    /**
     * Retorna estado atual do tabuleiro
     */
    getBoardState() {
        return [...this.boardState];
    }
    
    /**
     * Retorna elemento de célula específica
     */
    getCell(index) {
        return this.boardElement.querySelector(`[data-index="${index}"]`);
    }
    
    /**
     * Verifica se posição está vazia
     */
    isCellEmpty(index) {
        return this.boardState[index] === null;
    }
    
    /**
     * Retorna todas as posições vazias
     */
    getEmptyPositions() {
        return this.boardState
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
    }
    
    /**
     * Converte estado do tabuleiro para representação binária
     * Útil para debug e logs
     */
    toBinaryString() {
        return this.boardState
            .map(cell => cell === null ? '_' : cell)
            .join('');
    }
}

// Adicionar estilos para animações via JavaScript
const boardStyles = document.createElement('style');
boardStyles.textContent = `
    .position-indicator {
        position: absolute;
        top: 4px;
        right: 4px;
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--text-muted);
        opacity: 0.6;
        pointer-events: none;
        transition: opacity var(--transition-fast);
    }
    
    .game-cell:hover .position-indicator {
        opacity: 0;
    }
    
    @keyframes dataWrite {
        0% {
            transform: scale(1);
            filter: brightness(1);
        }
        50% {
            transform: scale(1.05);
            filter: brightness(1.3);
        }
        100% {
            transform: scale(1);
            filter: brightness(1);
        }
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.5);
        }
    }
`;
document.head.appendChild(boardStyles);