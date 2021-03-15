let deckID;
let hand;

function getNewDeck() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    .then(data => data.json())
    .then(newDeck => {
        deckID = newDeck.deck_id;
    });
}


function newHand() {
    fetch("https://deckofcardsapi.com/api/deck/ez4gc34z2q6z/draw/?count=5")
    .then(data => data.json())
    .then(newHand => {
        hand = newHand.cards;
    })
}

//newHand();
//getNewDeck();