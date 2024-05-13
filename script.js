// script.js
let words = [];
let categories = Object.keys(listaDePalavras); // Acesse os dados do JSON diretamente

let selectedWords = [];
let correctRows = 0;
let attempts = 0;

let timerInterval;
let elapsedTime = 0;
let attemptCount = 0;
let timerStarted = false;
let gameCompleted = false;

// Funcao para iniciar o cronometro
function startTimer() {
  timerInterval = setInterval(function () {
    elapsedTime++;
    document.getElementById("time").textContent = elapsedTime;
  }, 1000); // Atualiza a cada segundo
}

// Funcao para parar o cronometro
function stopTimer() {
  clearInterval(timerInterval);
}

// Funcao para atualizar o contador de tentativas
function updateAttemptCount() {
  attemptCount++;
  document.getElementById("attemptCount").textContent = attemptCount;
}

// Define a Funcao initializeGame no escopo global
function initializeGame() {
  // Seleciona 4 categorias aleatorias
  shuffle(categories);
  const selectedCategories = categories.slice(0, 4);

// Cria o array words com as palavras das categorias selecionadas
words = [];
for (let i = 0; i < selectedCategories.length; i++) {
  const categoryName = selectedCategories[i]; // Nome da categoria
  if (listaDePalavras[categoryName]) { // Verifica se a categoria existe
    shuffle(listaDePalavras[categoryName]); // Embaralha as palavras da categoria
    for (let j = 0; j < 4; j++) {
      words.push(listaDePalavras[categoryName][j]); // Adiciona as palavras
    }
  }
}

// Embaralha as palavras no array words
shuffle(words);

  createGameBoard();
}

// Embaralha os elementos de um array aleatoriamente
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Cria o tabuleiro do jogo
function createGameBoard() {
  const table = document.getElementById("gameBoard");
  table.innerHTML = ""; // Limpa o tabuleiro

  for (let i = 0; i < 4; i++) {
    const row = table.insertRow();
    for (let j = 0; j < 4; j++) {
      const cell = row.insertCell();
      const index = i * 4 + j; // Indice da palavra
      cell.textContent = words[index];
      cell.addEventListener("click", () => selectWord(index));
    }
  }

  // Destaca as palavras corretas ao recriar o tabuleiro
  highlightCorrectWords();
}

// Seleciona/desseleciona uma palavra
function selectWord(index) {
  // Verifica se o jogo foi concluido
  if (gameCompleted) {
    return;
  }

  // Verifica se o cronometro ja foi iniciado
  if (!timerStarted) {
    startTimer(); // Inicia o cronometro
    timerStarted = true; // Define que o cronometro foi iniciado
  }

  const cell = document.getElementById("gameBoard").rows[Math.floor(index / 4)].cells[index % 4];
  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedWords = selectedWords.filter((i) => i !== index);
  } else {
    if (selectedWords.length < 4) {
      cell.classList.add("selected");
      selectedWords.push(index);
    }
  }
}

// Verifica a selecao do jogador
function checkSelection() {
  // Verifica se o jogo foi concluido
  if (gameCompleted) {
    return;
  }

  updateAttemptCount(); // Atualiza o contador de tentativas

  const message = document.getElementById("message");
  if (selectedWords.length !== 4) {
    message.textContent = "Selecione 4 palavras!";
    return;
  }
  console.log(selectedWords.length);
  const category = getCategory();

  if (category) {
    message.textContent = `Parab鮳! A categoria 頤{category}`;
    moveSelectedToTop();
  } else {
    message.textContent = "Tente de Novo!";
  }
}

// Determina a categoria com base nas palavras selecionadas
function getCategory() {
  const categoryCounts = {}; // Objeto para contar a ocorrência de cada categoria

  // Conta quantas palavras de cada categoria foram selecionadas
  for (const word of words) {
    for (const categoryName in categories) {
      if (categories[categoryName].includes(word)) {
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      }
    }
  }

  // Encontra a categoria com mais ocorrencias
  let mostFrequentCategory = null;
  let maxCount = 0;
  for (const categoryName in categoryCounts) {
    if (categoryCounts[categoryName] > maxCount) {
      mostFrequentCategory = categoryName;
      maxCount = categoryCounts[categoryName];
    }
  }

  return mostFrequentCategory;
}

// Move as palavras selecionadas para o topo do tabuleiro
function moveSelectedToTop() {
  // Verifica se o jogo foi concluido
  if (gameCompleted) {
    return;
  }

  // Ordena os indices das palavras selecionadas
  selectedWords.sort((a, b) => a - b);

  // Cria um novo array para armazenar as palavras reorganizadas
  let newWords = [];

  // 1. Adiciona as palavras da categoria correta ao inicio do novo array
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

  // Limpa a selecao e recria o tabuleiro
  selectedWords = [];
  createGameBoard();
  highlightCorrectWords(); // Destaca as palavras corretas
  document.getElementById("message").textContent = "";

  // Verifica se o jogo terminou (todas as linhas corretas)
  if (correctRows === 4) {
    const category = getCategory(); // Obtenha a categoria
    document.getElementById("categoryDisplay").style.display = "block"; // Exiba o div de categoria
    document.getElementById("categoryDisplay").textContent = `Categoria: ${category}`; // Exiba a categoria
    document.getElementById("message").textContent = "Parab鮳! Vocꠣompletou o jogo!";
    stopTimer(); // Parar o cronômetro quando o jogo terminar
    gameCompleted = true; // Define que o jogo foi concluído

    // Desabilitar seleção de palavras
    const cells = document.querySelectorAll("#gameBoard td");
    cells.forEach((cell) => {
      cell.removeEventListener("click", selectWord);
      cell.style.pointerEvents = "none";
    });

    // Desabilitar botão "Verifique"
    document.getElementById("checkButton").disabled = true;
  }
}

// Funcao para destacar as palavras da categoria correta
function highlightCorrectWords() {
  const table = document.getElementById("gameBoard");

  // Define cores diferentes para cada categoria (classes CSS corretas)
  const categoryColors = ["category0", "category1", "category2", "category3"];

  // Percorre todas as celulas da tabela
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = table.rows[i].cells[j];

      // Remove as classes de categoria anteriores da celula
      cell.classList.remove("category0", "category1", "category2", "category3");

      // Se a celula faz parte das linhas corretas, aplica a classe de cor correspondente
      if (i < correctRows) {
        cell.classList.add(categoryColors[i]);
      }

      // Remove a classe 'selected' da celula
      cell.classList.remove("selected");
    }
  }
}

// Chama initializeGame para iniciar o jogo
initializeGame();
