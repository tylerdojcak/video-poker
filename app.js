let deckID;
let hand;
let handDiv = document.querySelector(".hand");
let replacements = [];
let handCodes = [];
let newCards = [];

// GET A BRAND NEW DECK WITH UNIQUE IDENTIFIER
function getNewDeck() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    .then(data => data.json())
    .then(newDeck => {
        deckID = newDeck.deck_id;
    });
}

// SHUFFLE THE DECK AND DRAW A 5-CARD HAND, THEN DISPLAY THEM ON-SCREEN
async function newHand() {
    //await shuffleDeck();
    await fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/shuffle/`);
    fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/draw/?count=5`)
    .then(data => data.json())
    .then(newHand => {
        hand = newHand.cards;
        handDiv.innerHTML = "";
        for (let card of hand) {
            handCodes.push(card.code);
            createCardDiv(card);
        }
        /*handDiv.innerHTML = "";
        for (let card of hand) {
            createCardDiv(card)
        }*/
    });
}

function createCardDiv(card) {
    let newCard = document.createElement("div");
    newCard.setAttribute("id", card.code)
    newCard.setAttribute("class", "card");
    newCard.style.backgroundImage = `url(${card.image})`;
    handDiv.appendChild(newCard);
    newCard.addEventListener("click", setToReplace);
}

//PUSH CLICKED CARDS INTO REPLACEMENTS ARRAY
function setToReplace() {
    this.classList.add("to-replace");
    replacements.push(this);
    this.addEventListener("click", unReplace);
    this.removeEventListener("click", setToReplace);
}

//REMOVE RE-CLICKED CARDS FROM REPLACEMENT LIST
function unReplace() {
    this.classList.remove("to-replace");
    let index = replacements.indexOf(this);
    replacements.splice(index, 1);
    this.addEventListener("click", setToReplace);
    this.removeEventListener("click", unReplace);
}

function removeReplacements() {
    for (let card of replacements) {
        let code = card.id;
        let index = handCodes.indexOf(code);
        handCodes.splice(index, 1);
        let removalElement = document.getElementById(`${code}`);
        removalElement.remove();
    }
    replacements = [];
}

function reDeal() {
    fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/draw/?count=${5 - handCodes.length}`)
    .then(data => data.json())
    .then(newHandCards => {
        newCards = newHandCards.cards;
        for (let card of newCards) {
            handCodes.push(card.code);
            createCardDiv(card);
        }
        for (let div of handDiv.children) {
            div.removeEventListener("click", setToReplace);
        }
    })
}

//newHand();
//getNewDeck();