/**
 * Interface do Usuário
 * 
 * Gerencia toda a interface visual do jogo.
 * Inclui transições suaves, feedback visual e elementos
 * que remetem ao mundo da programação e sistemas binários.
 */

export class BinaryUIController {
    constructor() {
        // Referências para elementos da interface
        this.elements = {
            modeSelection: document.getElementById('game-mode-selection'),
            boardSection: document.getElementById('game-board-section'),
            scoreboardSection: document.getElementById('scoreboard-section'),
            currentPlayerDisplay: document.getElementById('current-player-display'),
            playerIndicator: document.getElementById('current-player-indicator'),
            resultModal: document.getElementById('result-modal'),
            resultIcon: document.getElementById('result-icon'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            binaryAnimation: document.getElementById('binary-animation'),
            score1: document.getElementById('score-1'),
            score0: document.getElementById('score-0')
        };
        
        // Estado das notificações
        this.notificationQueue = [];
        this.isShowingNotification = false;
        
        console.log('🎨 BinaryUIController inicializado');
    }
    
    /**
     * Mostra mensagem de boas-vindas com tema binário
     */
    showWelcomeMessage() {
        const welcomeMessages = [
            'Sistema inicializado com sucesso!',
            'Bem-vindo ao mundo binário!',
            'Pronto para processar jogadas...',
            'Interface carregada. Selecione um modo.'
        ];
        
        const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        this.showNotification(message, 'success');
    }
    
    /**
     * Transição para tela de seleção de modo
     */
    showModeSelection() {
        console.log('📱 Exibindo seleção de modo');
        
        this.elements.modeSelection.classList.remove('hidden');
        this.elements.boardSection.classList.add('hidden');
        this.elements.scoreboardSection.classList.add('hidden');
        this.elements.playerIndicator.classList.add('hidden');
        
        // Foco automático para acessibilidade
        setTimeout(() => {
            document.getElementById('two-players-btn').focus();
        }, 150);
        
        // Efeito de entrada suave
        this.addTransitionEffect(this.elements.modeSelection, 'slideInFromLeft');
    }
    
    /**
     * Transição para tela do jogo
     */
    showGameBoard() {
        console.log('🎮 Carregando interface de jogo...');
        
        // Esconder seleção com efeito
        this.addTransitionEffect(this.elements.modeSelection, 'slideOutToLeft');
        
        setTimeout(() => {
            this.elements.modeSelection.classList.add('hidden');
            this.elements.boardSection.classList.remove('hidden');
            this.elements.scoreboardSection.classList.remove('hidden');
            this.elements.playerIndicator.classList.remove('hidden');
            
            // Efeitos de entrada
            this.addTransitionEffect(this.elements.boardSection, 'slideInFromRight');
            this.addTransitionEffect(this.elements.scoreboardSection, 'fadeInUp');
            
            // Foco na primeira célula
            setTimeout(() => {
                const firstCell = document.querySelector('.game-cell');
                if (firstCell) firstCell.focus();
            }, 200);
        }, 300);
    }
    
    /**
     * Atualiza indicador do jogador atual com tema binário
     * @param {string} player - Jogador atual ('0' ou '1')
     */
    updateCurrentPlayerIndicator(player) {
        const display = this.elements.currentPlayerDisplay;
        const indicator = this.elements.playerIndicator;
        
        // Atualizar conteúdo e classes
        display.textContent = player;
        display.className = `player-symbol player-${player}`;
        
        // Micro-animação de transição
        indicator.style.transform = 'scale(1.08)';
        indicator.style.filter = 'brightness(1.2)';
        
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
            indicator.style.filter = 'brightness(1)';
        }, 250);
        
        // Log temático
        console.log(`🔄 Controle transferido para bit ${player}`);
    }
    
    /**
     * Mostra indicador de processamento da IA
     * @param {boolean} isProcessing - Se a IA está processando
     */
    showAIProcessing(isProcessing) {
        const container = document.querySelector('.game-container');
        const display = this.elements.currentPlayerDisplay;
        
        if (isProcessing) {
            container.classList.add('thinking');
            display.textContent = '⚡';
            display.className = 'player-symbol processing';
            
            // Animação de código binário
            this.startBinaryAnimation();
            
            this.announceToScreenReader('IA processando algoritmo...');
        } else {
            container.classList.remove('thinking');
            this.stopBinaryAnimation();
        }
    }
    
    /**
     * Inicia animação de código binário
     */
    startBinaryAnimation() {
        const animation = this.elements.binaryAnimation;
        let binaryString = '';
        
        // Gerar string binária aleatória
        for (let i = 0; i < 20; i++) {
            binaryString += Math.random() > 0.5 ? '1' : '0';
        }
        
        animation.textContent = binaryString;
        animation.style.animation = 'binaryFlow 1s linear infinite';
    }
    
    /**
     * Para animação de código binário
     */
    stopBinaryAnimation() {
        this.elements.binaryAnimation.style.animation = 'none';
        this.elements.binaryAnimation.textContent = '';
    }
    
    /**
     * Atualiza placar com animações suaves
     * @param {Object} stats - Estatísticas da sessão
     */
    updateScoreboard(stats) {
        this.updateScoreValue(this.elements.score1, stats['1']);
        this.updateScoreValue(this.elements.score0, stats['0']);
        
        console.log('📊 Placar atualizado:', stats);
    }
    
    /**
     * Atualiza valor individual do placar com animação
     * @param {HTMLElement} element - Elemento do placar
     * @param {number} newValue - Novo valor
     */
    updateScoreValue(element, newValue) {
        const currentValue = parseInt(element.textContent);
        
        if (currentValue !== newValue) {
            // Animação de incremento
            element.style.transform = 'scale(1.3)';
            element.style.filter = 'brightness(1.4)';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.filter = 'brightness(1)';
            }, 150);
            
            // Efeito de brilho
            this.addGlowEffect(element);
        }
    }
    
    /**
     * Exibe resultado do jogo com tema de programação
     * @param {Object} gameResult - Resultado do jogo
     * @param {string} gameMode - Modo de jogo atual
     */
    showGameResult(gameResult, gameMode) {
        const { winner, type, message } = gameResult;
        
        let icon, title, description, modalClass;
        
        if (type === 'victory') {
            if (gameMode === 'ai-player') {
                if (winner === '1') {
                    icon = '🎉';
                    title = 'Vitória do Humano!';
                    description = 'Seu algoritmo superou a IA! Excelente lógica de programação!';
                    modalClass = 'result-win';
                } else {
                    icon = '🤖';
                    title = 'IA Executou com Sucesso!';
                    description = 'O algoritmo da IA foi mais eficiente. Analise o código e tente novamente!';
                    modalClass = 'result-loss';
                }
            } else {
                icon = winner === '1' ? '🥇' : '🥈';
                title = `Bit ${winner} Venceu!`;
                description = `Parabéns! O jogador ${winner} executou a sequência vencedora.`;
                modalClass = 'result-win';
            }
        } else if (type === 'overflow') {
            icon = '⚠️';
            title = 'Buffer Overflow!';
            description = 'Memória cheia sem padrão vencedor detectado. Sistema em estado de empate.';
            modalClass = 'result-draw';
        }
        
        // Configurar modal
        this.elements.resultIcon.textContent = icon;
        this.elements.resultTitle.textContent = title;
        this.elements.resultMessage.textContent = description;
        
        // Aplicar classe de estilo
        this.elements.resultModal.className = `modal-overlay ${modalClass}`;
        
        // Mostrar modal
        this.elements.resultModal.classList.remove('hidden');
        
        // Iniciar animação no modal
        this.startModalBinaryAnimation();
        
        // Foco para visualizar melhor
        setTimeout(() => {
            document.getElementById('play-again-btn').focus();
        }, 400);
        
        // Anunciar resultado
        this.announceToScreenReader(`${title}. ${description}`);
        
        console.log('🎭 Modal de resultado exibido:', { winner, type });
    }
    
    /**
     * Inicia animação no modal
     */
    startModalBinaryAnimation() {
        const animation = this.elements.binaryAnimation;
        let counter = 0;
        
        const interval = setInterval(() => {
            let binaryString = '';
            for (let i = 0; i < 15; i++) {
                binaryString += Math.random() > 0.5 ? '1' : '0';
            }
            animation.textContent = binaryString;
            
            counter++;
            if (counter > 10) {
                clearInterval(interval);
                animation.textContent = '';
            }
        }, 200);
    }
    
    /**
     * Esconde modal de resultado
     */
    hideResultModal() {
        this.addTransitionEffect(this.elements.resultModal, 'fadeOut');
        
        setTimeout(() => {
            this.elements.resultModal.classList.add('hidden');
            this.elements.resultModal.className = 'modal-overlay hidden';
        }, 300);
    }
    
    /**
     * Sistema de notificações com tema de terminal
     * @param {string} message - Mensagem
     * @param {string} type - Tipo ('success', 'info', 'warning', 'error')
     */
    showNotification(message, type = 'info') {
        // Adicionar à fila se já estiver mostrando uma notificação
        if (this.isShowingNotification) {
            this.notificationQueue.push({ message, type });
            return;
        }
        
        this.isShowingNotification = true;
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `terminal-notification notification-${type}`;
        
        // Conteúdo com tema de terminal
        notification.innerHTML = `
            <div class="notification-header">
                <span class="terminal-prompt">$</span>
                <span class="notification-type">${type.toUpperCase()}</span>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        // Estilos inline para notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--accent-primary)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg), var(--glow-sm) var(--accent-primary)',
            zIndex: '1001',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-mono)',
            maxWidth: '320px',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        });
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.isShowingNotification = false;
                
                // Processar próxima notificação na fila
                if (this.notificationQueue.length > 0) {
                    const next = this.notificationQueue.shift();
                    this.showNotification(next.message, next.type);
                }
            }, 300);
        }, 3000);
        
        console.log('📢 Notificação do sistema:', message);
    }
    
    /**
     * Aplica tema visual baseado no modo de jogo
     * @param {string} mode - Modo de jogo
     */
    applyModeTheme(mode) {
        const container = document.querySelector('.game-container');
        
        // Remover temas anteriores
        container.classList.remove('theme-two-players', 'theme-ai-player');
        
        // Aplicar novo tema
        container.classList.add(`theme-${mode}`);
        
        // Efeito visual de mudança de tema
        container.style.filter = 'brightness(1.1)';
        setTimeout(() => {
            container.style.filter = 'brightness(1)';
        }, 300);
        
        console.log(`🎨 Tema aplicado: ${mode}`);
    }
    
    /**
     * Adiciona efeito de brilho a um elemento
     * @param {HTMLElement} element - Elemento para aplicar efeito
     */
    addGlowEffect(element) {
        element.style.boxShadow = 'var(--glow-md) var(--accent-primary)';
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transform = 'scale(1)';
        }, 400);
    }
    
    /**
     * Adiciona efeito de transição a um elemento
     * @param {HTMLElement} element - Elemento
     * @param {string} effectName - Nome do efeito
     */
    addTransitionEffect(element, effectName) {
        element.style.animation = `${effectName} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, 400);
    }
    
    /**
     * Configura anúncios para leitores de tela
     */
    setupScreenReaderAnnouncements() {
        // Criar região para anúncios dinâmicos
        const announceRegion = document.createElement('div');
        announceRegion.id = 'screen-reader-announcements';
        announceRegion.setAttribute('aria-live', 'polite');
        announceRegion.setAttribute('aria-atomic', 'true');
        announceRegion.className = 'sr-only';
        
        document.body.appendChild(announceRegion);
        
        this.announceRegion = announceRegion;
    }
    
    /**
     * Anuncia mensagem para leitores de tela
     * @param {string} message - Mensagem para anunciar
     */
    announceToScreenReader(message) {
        if (this.announceRegion) {
            this.announceRegion.textContent = message;
            
            // Limpar após anúncio
            setTimeout(() => {
                this.announceRegion.textContent = '';
            }, 1000);
        }
    }
    
    /**
     * Configura feedback visual para usuários com deficiência auditiva
     */
    setupVisualFeedback() {
        // Adicionar indicadores visuais para eventos sonoros
        this.visualFeedbackEnabled = true;
    }
    
    /**
     * Cria efeito de celebração para vitórias
     */
    createCelebrationEffect() {
        const celebration = document.createElement('div');
        celebration.className = 'celebration-effect';
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 3000);
    }
    
    /**
     * Mostra indicador de carregamento
     * @param {boolean} isLoading - Se está carregando
     */
    setLoadingState(isLoading) {
        const container = document.querySelector('.game-container');
        
        if (isLoading) {
            container.classList.add('loading');
            this.showNotification('Processando...', 'info');
        } else {
            container.classList.remove('loading');
        }
    }
    
    /**
     * Adiciona efeito visual pulsante
     * @param {HTMLElement} element - Elemento
     * @param {string} color - Cor do efeito
     */
    addPulseEffect(element, color = 'var(--accent-primary)') {
        element.style.boxShadow = `var(--glow-md) ${color}`;
        element.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.animation = '';
        }, 600);
    }
    
    /**
     * Cria partículas binárias para efeitos visuais
     * @param {HTMLElement} container - Container para as partículas
     * @param {number} count - Número de partículas
     */
    createBinaryParticles(container, count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('span');
                particle.textContent = Math.random() > 0.5 ? '1' : '0';
                particle.className = 'binary-particle';
                
                // Posição aleatória
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                particle.style.cssText = `
                    position: absolute;
                    left: ${x}%;
                    top: ${y}%;
                    font-family: var(--font-mono);
                    font-size: 12px;
                    color: var(--accent-primary);
                    pointer-events: none;
                    animation: particleFade 2s ease-out forwards;
                `;
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }
    
    /**
     * Mostra dica
     * @param {string} tip - Dica para mostrar
     */
    showContextualTip(tip) {
        this.showNotification(`💡 Dica: ${tip}`, 'info');
    }
    
    /**
     * Aplica efeito de erro visual
     * @param {HTMLElement} element - Elemento
     */
    showErrorEffect(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        element.style.borderColor = 'var(--error-color)';
        
        setTimeout(() => {
            element.style.animation = '';
            element.style.borderColor = '';
        }, 500);
    }
}

// Adicionar estilos para animações e efeitos
const uiStyles = document.createElement('style');
uiStyles.textContent = `
    .terminal-notification {
        font-family: var(--font-mono);
        border-left: 4px solid var(--accent-primary);
    }
    
    .notification-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-1);
        font-size: var(--font-size-xs);
        opacity: 0.8;
    }
    
    .terminal-prompt {
        color: var(--accent-primary);
        font-weight: 700;
    }
    
    .notification-type {
        color: var(--text-muted);
        font-weight: 500;
    }
    
    .notification-content {
        font-size: var(--font-size-sm);
        color: var(--text-primary);
    }
    
    .player-symbol.processing {
        background: var(--bg-tertiary);
        color: var(--accent-primary);
        border-color: var(--accent-primary);
        animation: processingPulse 1s ease-in-out infinite;
    }
    
    @keyframes processingPulse {
        0%, 100% { 
            opacity: 1;
            transform: scale(1);
        }
        50% { 
            opacity: 0.7;
            transform: scale(1.05);
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutToLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.5);
        }
    }
`;
document.head.appendChild(uiStyles);