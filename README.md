# 🎮 Jogo da Velha Binário

Bem-vindo ao **Jogo da Velha Binário**: uma versão adaptada do jogo da velha, onde os tradicionais X e O foram substituídos pelos bits **0** e **1**, criando uma referência ao mundo da programação e sistemas binários. Escolhi dessa forma adaptada, porque a matéria que eu mais gostei no primeiro semestre de programação foi Fundamentos da Computação e quis referenciar a matéria em um projeto pessoal.

## 🎯 Como Jogar

### 🔧 Iniciando o Sistema

1. **Abra o jogo** no seu navegador
2. **Escolha seu modo de execução:**
   - **👥 Modo Duplo**: Dois jogadores humanos (1 vs 0)
   - **🤖 Vs Algoritmo**: Você (1) contra a IA (0)

### 📋 Regras do Protocolo

- **Objetivo**: Conseguir três bits iguais em sequência (horizontal, vertical ou diagonal)
- **Bit 1 sempre inicia** a execução (como `true` em lógica booleana)
- **Clique em uma posição vazia** para gravar seu bit
- **O sistema alterna automaticamente** entre os jogadores
- **Primeira sequência válida vence** a execução

### 🎮 Modos de Jogo

#### 👥 Modo Duplo (Local)
```
Player 1: Bit 1 (azul)  // true
Player 2: Bit 0 (vermelho)  // false
```
- Dois jogadores no mesmo dispositivo
- Alternância manual entre jogadores
  
#### 🤖 Vs Algoritmo (IA)
```
Humano: Bit 1 (azul)     // você
AI: Bit 0 (vermelho)    // inteligência artificial
```
- Você sempre joga com bit 1 e inicia
- IA usa algoritmo Minimax otimizado
- IA tem pequeno delay para simular "processamento"
- Desafio inteligente, mas não impossível

## ⌨️ Controles e Interface

### 🖱️ Controles por Mouse
- **Clique** em qualquer célula vazia para gravar seu bit
- **Botões de navegação** para controlar o fluxo do jogo

### ⌨️ Controles por Teclado (Acessibilidade)
```bash
# Navegação no tabuleiro
1-9     # Jogar nas posições correspondentes
        # Layout: 1 2 3
        #         4 5 6  
        #         7 8 9

# Controles do sistema
N       # Nova execução (quando em jogo)
M       # Voltar ao menu principal
ESC     # Fechar modal de resultado
TAB     # Navegar entre elementos
ENTER   # Ativar botões e células
```

### 🗺️ Mapeamento do Tabuleiro
```
Posições:     Coordenadas:
1 | 2 | 3     [0,0] [0,1] [0,2]
---------  =  -----------------
4 | 5 | 6     [1,0] [1,1] [1,2]
---------     -----------------
7 | 8 | 9     [2,0] [2,1] [2,2]
```

## 🏆 Sistema de Pontuação

### 📊 Placar da Sessão
- **Vitória**: +1 ponto para o bit vencedor
- **Buffer Overflow** (empate, o nome sendo outra referência com programação): Nenhum ponto adicionado 
- **Placar persistente**: Mantido durante toda a sessão
- **Reset**: Voltar ao menu zera todas as estatísticas

### 🎯 Tipos de Resultado
- **🏆 Vitória**: Três bits iguais em sequência
- **⚠️ Buffer Overflow**: Tabuleiro cheio sem vencedor
- **🔄 Sistema em Execução**: Jogo ainda em andamento

## 🧠 Estratégias e Dicas

### 💡 Para Iniciantes
```javascript
// Estratégia básica
if (centro_livre) {
    jogar(centro);  // Posição [1,1] - melhor abertura
} else if (cantos_livres) {
    jogar(canto);   // Posições estratégicas
} else {
    bloquear(oponente);  // Sempre bloquear ameaças
}
```

### 🎯 Contra a IA
- **A IA é inteligente** mas comete pequenos erros intencionais
- **Crie armadilhas duplas**: Force a IA a escolher entre duas ameaças
- **Varie sua estratégia**: Não seja previsível
- **Use o centro**: Posição [1,1] oferece mais possibilidades
- **Controle os cantos**: Posições [0,0], [0,2], [2,0], [2,2] são boas

### 🔬 Análise Avançada
A IA usa diferentes estratégias baseadas em estruturas de dados, algo que também aprendi na faculdade:
- **Centro**: Estratégia STACK (O(1)) - acesso direto
- **Cantos**: Estratégia ARRAY (O(log n)) - busca binária  
- **Bordas**: Estratégia QUEUE (O(n)) - busca linear

## 🛠️ Tecnologias e Arquitetura

### 💻 Stack Tecnológico
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design system com tema de programação seguindo a temática binária
- **JavaScript ES6+**: Arquitetura modular orientada a objetos
- **Web APIs**: Para acessibilidade e experiência nativa

### 🏗️ Arquitetura Modular
```
src/
├── index.html                 # Interface principal
├── css/
│   └── styles.css            # Design system completo
└── js/
    ├── main.js               # Orquestrador principal
    └── modules/
        ├── binaryGameBoard.js    # Gerenciamento do tabuleiro
        ├── binaryGameLogic.js    # Lógica do Jogo
        ├── binaryUIController.js # Controle da interface
        └── binaryAIPlayer.js     # Inteligência artificial
```

### 🎨 Design System 
- **Paleta temática**: As cores inspiradas em IDEs, cores que remetem a tecnologia e terminais
- **Tipografia**: JetBrains Mono para elementos de código
- **Micro-interações**: Animações suaves e feedback visual
- **Alto contraste**: Garantia de legibilidade em qualquer situação

## ♿ Acessibilidade

### 🔍 Recursos Implementados
- **Navegação completa por teclado**
- **Leitores de tela** totalmente suportados
- **Alto contraste** para usuários com baixa visão
- **Indicadores visuais** claros para todas as ações
- **Anúncios de estado** para usuários com deficiência visual
- **Suporte a preferências do sistema** (movimento reduzido, tema escuro)

### 🎯 ARIA e Semântica
- Elementos com roles apropriados (`grid`, `gridcell`, `dialog`)
- Labels descritivos para cada célula
- Anúncios dinâmicos com `aria-live`
- Navegação lógica com `tabindex`

## 🐛 Solução de Problemas
// ainda nenhum problema encontrado

### ❌ Problemas Comuns

**O jogo não responde aos cliques**
```bash
# Verificações:
1. É sua vez de jogar?
2. A célula está vazia?
3. A IA está processando? (aguarde o ⚡)
```

**Navegação por teclado não funciona**
```bash
# Soluções:
1. Certifique-se que o jogo está em foco
2. Use TAB para navegar entre elementos
3. Use números 1-9 apenas quando for sua vez
```

**Problemas visuais ou de performance**
```bash
# Diagnóstico:
1. Atualize a página (F5 ou Ctrl+R)
2. Verifique se JavaScript está habilitado
3. Use um navegador moderno (Chrome, Firefox, Safari, Edge)
4. Desative extensões que possam interferir
```

### 🔧 Comandos de Debug (Para Desenvolvedores)

Abra o console do navegador e experimente:

```javascript
// Verificar estatísticas da sessão
getBinaryStats()

// Ver estatísticas da IA
getAIStats()

// Alternar modo debug
toggleDebugMode()

// Verificar estado atual do jogo
window.binaryTicTacToe.gameState
```

## 🎉 Easter Eggs e Detalhes

### 🥚 Recursos Escondidos
Todo o sistema é feito para referenciar a programação de alguma forma, tais como:
- **Animações de partículas** nas vitórias
- **Código binário** animado durante processamento da IA
- **Logs temáticos** no console do navegador
- **Efeitos de "escrita de dados"** nas jogadas
- **Indicadores de posição** em formato de coordenadas

### 🎨 Detalhes Visuais
- **Gradientes sutis** que remetem a interfaces de código
- **Sombras com brilho** para simular telas de computador

## 🌟 Entendendo mais sobre o Projeto

Este jogo foi criado para referenciar o que aprendi na programação, porque a área de tecnologia me deu propósito e eu realmente gostei de implementar o que aprendi.
Inicialmente ele foi feito para ser entregue para um trabalho da faculdade, mas aperfeiçoei, incrementei e modifiquei ele, não por obrigação,
mas porque gostei do que eu estava aprendendo em cursos, vídeos aulas e quis um trabalho que sintetização isso. Espero que tenha gostado e toda crítica é bem-vinda. 🤝


### 👨‍💻 Para Desenvolvedores
- **Código comentado** para aprendizado, tentei ser o mais didática possível nas explicações, mas confesso que esse não é meu forte
- **Arquitetura modular** fácil de estender
- **Acessibilidade como exemplo** de implementação, porque atualmente poucos sites são acessíveis, segundo dados da BigDataCorp recentes.

---

## 🎮 Comece a Jogar!

Agora que você entende mais sobre o projeto, que tal testar? 

**Desafio**: Consegue vencer a IA 3 vezes seguidas? 

---

**Obrigada, espero que tenha entendido e aprendido com a aplicação! Qualquer contribuição é bem-vinda também. 🚀**
