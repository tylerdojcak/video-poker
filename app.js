let deckID;
let hand;
let handDiv = document.querySelector(".hand");
let replacements = [];
let handCodes = [];
let newCards = [];
const FIVEHIGHSTRAIGHT = ["2", "3", "4", "5", "A"];
let dealBtn = document.querySelector("#deal-btn");
let replaceBtn = document.querySelector("#replace-btn");
dealBtn.addEventListener("click", newHand);
replaceBtn.addEventListener("click", removeReplacements);

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
    await fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/shuffle/`);
    fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/draw/?count=5`)
    .then(data => data.json())
    .then(newHand => {
        //console.log(newHand.remaining);
        handCodes = [];
        hand = newHand.cards;
        handDiv.innerHTML = "";
        for (let card of hand) {
            handCodes.push(card.code);
            createCardDiv(card);
        }
        dealBtn.disabled = true;
        replaceBtn.disabled = false;
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

//REMOVE SELECTED CARDS TO REPLACE
function removeReplacements() {
    for (let card of replacements) {
        let code = card.id;
        let index = handCodes.indexOf(code);
        handCodes.splice(index, 1);
        let removalElement = document.getElementById(`${code}`);
        removalElement.remove();
    }
    replacements = [];
    dealBtn.disabled = false;
    replaceBtn.disabled = true;
    reDeal();
}

//DEAL APPROPRIATE NUMBER OF NEW CARDS
function reDeal() {
    fetch(`https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/draw/?count=${5 - handCodes.length}`)
    .then(data => data.json())
    .then(newHandCards => {
        //console.log(newHandCards.remaining)
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

//SPLIT THE HANDCODES INTO RANKS AND SUITS
function ranksAndSuits(hand) {
    let ranks = [];
    let suits = {};
    for (let card of hand) {
        let codes = card.split("");
        ranks.push(codes[0]);
        let suit = codes[1];
        if (suit in suits) {
            suits[suit] += 1;
        }  else {
            suits[suit] = 1;
        }
    }
    //console.log(ranks, suits);
    return ranks//, suits;
}

// TRANSFORM RANKS INTO NUMBERS AND RETURN THEM SORTED
function transformRanks(arr) {
    if (isFiveHiStraight(arr.sort())) {
        return "It's a 5-high straight";
    } else {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "0") {
                arr[i] = 10;
            } else if (arr[i] === "J") {
                arr[i] = 11;
            } else if (arr[i] === "Q") {
                arr[i] = 12;
            } else if (arr[i] === "K") {
                arr[i] = 13;
            } else if (arr[i] === "A") {
                arr[i] = 14;
            } else {
                arr[i] = parseInt(arr[i]);
            }
        }
        return arr.sort((a, b) => a - b);
    }
}

function evaluateHand(hand) {

}

function isFlush(suits) {
    if (suits.length === 1) {
        return "It's a flush!";
    } else {
        return "It's not a flush.";
    }
}

function isFiveHiStraight(arr1, arr2 = FIVEHIGHSTRAIGHT) {
    return arr1.every((v, i) => v === arr2[i]);
}

function isStraight() {
    if (transformRanks(ranksAndSuits(handCodes)) === "It's a 5-high straight" || transformRanks(ranksAndSuits(handCodes))[4] - transformRanks(ranksAndSuits(handCodes))[0] === 3) {
        return "STRAIGHT!";
    } else  {
        return "Not a straight.";
    }
}