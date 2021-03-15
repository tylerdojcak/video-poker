let deckID;

function getNewDeck() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    .then(data => data.json())
    .then(newDeck => {
        deckID = newDeck.deck_id;
    });
}

//getNewDeck();