// Objeto com algumas informações de forma mais organizada
const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    cardSprites:{
        preview: document.getElementById("card-preview"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        battle: document.getElementById("battle"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}

// Caminho das imagens
const pathImages = "./assets/images/";

// Objeto com todas as cartas
const cardData = [
    {
        id:0,
        name: "Dragon",
        type: "Fire",
        img: `${pathImages}dragon.svg`,
        WinOf:["earth"],
        LoseOf:["wind"],
    },
    {
        id:1,
        name: "Salamander",
        type: "Fire",
        img: `${pathImages}salamander.svg`,
        WinOf:["earth"],
        LoseOf:["wind"],
    },
    {
        id:2,
        name: "Fenix",
        type: "Fire",
        img: `${pathImages}fenix.svg`,
        WinOf:["earth"],
        LoseOf:["wind"],
    },
    {
        id:3,
        name: "Acromantula",
        type: "Earth",
        img: `${pathImages}acromantula.svg`,
        WinOf:["wind"],
        LoseOf:["fire"],
    },
    {
        id:4,
        name: "Troll",
        type: "Earth",
        img: `${pathImages}troll.svg`,
        WinOf:["wind"],
        LoseOf:["fire"],
    },
    {
        id:5,
        name: "Basilisk",
        type: "Earth",
        img: `${pathImages}basilisk.svg`,
        WinOf:["wind"],
        LoseOf:["fire"],
    },
    {
        id:6,
        name: "Dementor",
        type: "Wind",
        img: `${pathImages}dementor.svg`,
        WinOf:["fire"],
        LoseOf:["earth"],
    },
    {
        id:7,
        name: "Thestral",
        type: "Wind",
        img: `${pathImages}thestral.svg`,
        WinOf:["fire"],
        LoseOf:["earth"],
    },
    {
        id:7,
        name: "Hippogrif",
        type: "Wind",
        img: `${pathImages}hippogrif.svg`,
        WinOf:["fire"],
        LoseOf:["earth"],
    },
];

// Função que escolhe um id de carta aleatorio
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Função que cria as cartas 
async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "150px");
    cardImage.setAttribute("src", "./assets/images/back-card.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1) {

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(idCard)
        });

    }

    return cardImage;
}

// Função chamada quando clicado na carta
async function setCardsField(idCard) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();
    let computerCardType = await getTypeById(computerCardId)
    const cardType = await getTypeById(idCard);


    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(idCard, computerCardId);

    let duelResults = await checkDuelResults(cardType, computerCardType);

    await updateScore();
    await drawButton(duelResults);
};

// Função para recuperar o tipo da carta
async function getTypeById(cardId) {
    const card = cardData.find(card => card.id === cardId);
    return card && card.type;
}

// Função que exibe as cartas selecionadas no meio
async function drawCardsInField(idCard, computerCardId) {
    state.fieldCards.player.src = cardData[idCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

// Função que aparece ou oculta as cartas dos jogadores
async function showHiddenCardFieldsImages(value) {
    
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } 

    if (value == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

// Função que tira as informações da carta selecionada
async function hiddenCardDetails() {    
    state.cardSprites.preview.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.battle.innerText = "";
}

// Função que faz aparecer o botão
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// Muda os pontos de vitoria e derrota
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Função que checa se o tipo da carta do jogador perde ou ganho do adversario
async function checkDuelResults(cardType, computerCardType){
    let duelResults = "Draw";

    if ((cardType === "Fire" && computerCardType === "Earth") || (cardType === "Earth" && computerCardType === "Wind") || (cardType === "Wind" && computerCardType === "Fire")) {
        duelResults = "win";
        state.score.playerScore++;
    } else if (cardType === computerCardType){
        duelResults = "draw";
    } else {
        duelResults = "lose"
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

// função que remove as cartas
async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}

// função que coloca na lateral a imagem e especificação da carta escolhida
async function drawSelectCard(index) {
    state.cardSprites.preview.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Type: " + cardData[index].type;
    state.cardSprites.battle.innerText = `Win: ${cardData[index].WinOf} \n Lose: ${cardData[index].LoseOf}`
};

// função inicial para entregar as cartas
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Função do botão de reset
async function resetDuel() {
    state.cardSprites.preview.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// Função do som de vitoria ou derrota
async function playAudio(status) {
    const audio = new Audio(`./assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch (error) {
        
    }
    
}

// Função inicial
function init() {

    showHiddenCardFieldsImages(false);
    
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();
