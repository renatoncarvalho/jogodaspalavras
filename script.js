const words = [
  // Categoria 1
  "Maçã", "Banana", "Laranja", "Uva",
  // Categoria 2
  "Cachorro", "Gato", "Elefante", "Leão",
  // Categoria 3
  "Azul", "Verde", "Vermelho", "Amarelo",
  // Categoria 4
  "Carro", "Avião", "Trem", "Bicicleta"
];

let selectedWords = [];
let correctRows = 0; // Variável para controlar as linhas corretas
let attempts = 0; // Contador de tentativas

let timerInterval; // Variável para armazenar o intervalo do cronômetro
let elapsedTime = 0; // Tempo decorrido em segundos
let attemptCount = 0; // Contador de tentativas
let timerStarted = false; // Variável para controlar se o cronômetro foi iniciado
let gameCompleted = false; // Variável para controlar se o jogo foi concluído

// Função para iniciar o cronômetro
function startTimer() {
  timerInterval = setInterval(function() {
    elapsedTime++;
    document.getElementById("time").textContent = elapsedTime;
  }, 1000); // Atualiza a cada segundo
}

// Função para parar o cronômetro
function stopTimer() {
  clearInterval(timerInterval);
}

// Função para atualizar o contador de tentativas
function updateAttemptCount() {
  attemptCount++;
  document.getElementById("attemptCount").textContent = attemptCount;
}

// Embaralha as palavras aleatoriamente
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Cria o tabuleiro do jogo
function createGameBoard() {
  const table = document.getElementById("gameBoard");
  table.innerHTML = ''; // Limpa o tabuleiro

  for (let i = 0; i < 4; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 4; j++) {
      const cell = row.insertCell();
      const index = i * 4 + j; // Índice da palavra
      cell.textContent = words[index];
      cell.addEventListener('click', () => selectWord(index));
    }
  }

  // Destaca as palavras corretas ao recriar o tabuleiro
  highlightCorrectWords();
}

// Seleciona/desseleciona uma palavra
function selectWord(index) {
  // Verifica se o jogo foi concluído
  if (gameCompleted) {
    return;
  }

  // Verifica se o cronômetro já foi iniciado
  if (!timerStarted) {
    startTimer(); // Inicia o cronômetro
    timerStarted = true; // Define que o cronômetro foi iniciado
  }

  const cell = document.getElementById("gameBoard").rows[Math.floor(index / 4)].cells[index % 4];
  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedWords = selectedWords.filter(i => i !== index);
  } else {
    if (selectedWords.length < 4) {
      cell.classList.add("selected");
      selectedWords.push(index);
    }
  }
}

// Verifica a seleção do jogador
function checkSelection() {
  // Verifica se o jogo foi concluído
  if (gameCompleted) {
    return;
  }

  updateAttemptCount(); // Atualiza o contador de tentativas

  const message = document.getElementById("message");
  if (selectedWords.length !== 4) {
    message.textContent = "Selecione 4 palavras!";
    return;
  }

  const category = getCategory();

  if (category) {
    message.textContent = `Parabéns! A categoria é ${category}`;
    moveSelectedToTop();
  } else {
    message.textContent = "Tente de Novo!";
  }
}

// Determina a categoria com base nas palavras selecionadas 
function getCategory() {
  const categories = new Set();

  for (const index of selectedWords) {
    const word = words[index];

    if (word === "Maçã" || word === "Banana" || word === "Laranja" || word === "Uva") {
      categories.add("Categoria Frutas");
    } else if (word === "Cachorro" || word === "Gato" || word === "Elefante" || word === "Leão") {
      categories.add("Categoria Animais");
    } else if (word === "Azul" || word === "Verde" || word === "Vermelho" || word === "Amarelo") {
      categories.add("Categoria Cores");
    } else if (word === "Carro" || word === "Avião" || word === "Trem" || word === "Bicicleta") {
      categories.add("Categoria Meios de Transporte");
    }
  }

  if (categories.size === 1) {
    return categories.values().next().value;
  } else {
    return null;
  }
}

// Move as palavras selecionadas para o topo do tabuleiro
function moveSelectedToTop() {
  // Verifica se o jogo foi concluído
  if (gameCompleted) {
    return;
  }

  // Ordena os índices das palavras selecionadas
  selectedWords.sort((a, b) => a - b);

  // Cria um novo array para armazenar as palavras reorganizadas
  let newWords = [];

  // 1. Adiciona as palavras da categoria correta ao início do novo array
  for (const index of selectedWords) {
    newWords.push(words[index]);
  }

  // 2. Adiciona as palavras restantes ao novo array
  for (let i = 0; i < words.length; i++) {
    if (!selectedWords.includes(i)) {
      newWords.push(words[i]);
    }
  }

  // Atualiza o array words com a nova ordem
  words.length = 0;
  words.push(...newWords);

  // Incrementa o contador de linhas corretas
  correctRows++;

  // Limpa a seleção e recria o tabuleiro
  selectedWords = [];
  createGameBoard();
  highlightCorrectWords(); // Destaca as palavras corretas
  document.getElementById("message").textContent = "";

  // Verifica se o jogo terminou (todas as linhas corretas)
  if (correctRows === 4) {
    const category = getCategory(); // Obtenha a categoria
    document.getElementById("categoryDisplay").style.display = "block"; // Exiba o div de categoria
    document.getElementById("categoryDisplay").textContent = `Categoria: ${category}`; // Exiba a categoria
    document.getElementById("message").textContent = "Parabéns! Você completou o jogo!";
    stopTimer(); // Parar o cronômetro quando o jogo terminar
    gameCompleted = true; // Define que o jogo foi concluído

    // Desabilitar seleção de palavras
    const cells = document.querySelectorAll("#gameBoard td");
    cells.forEach(cell => {
      cell.removeEventListener('click', selectWord);
      cell.style.pointerEvents = "none";
    });

    // Desabilitar botão "Verifique"
    document.getElementById("checkButton").disabled = true;
  }
}
// Função para destacar as palavras da categoria correta
function highlightCorrectWords() {
  const table = document.getElementById("gameBoard");

  // Define cores diferentes para cada categoria (classes CSS corretas)
  const categoryColors = ["category0", "category1", "category2", "category3"];

  // Percorre todas as células da tabela
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = table.rows[i].cells[j];

      // Remove as classes de categoria anteriores da célula
      cell.classList.remove("category0", "category1", "category2", "category3");

      // Se a célula faz parte das linhas corretas, aplica a classe de cor correspondente
      if (i < correctRows) {
        cell.classList.add(categoryColors[i]);
      }

      // Remove a classe 'selected' da célula
      cell.classList.remove("selected");
    }
  }
}

// Inicializa o jogo
shuffle(words);
createGameBoard();
