// Initialize a new deck by making a fetch request to the Deck of Cards API
let deckId;
let playerPoints = 0;
let dealerPoints = 0;
let playerCash = 1000;
let playerWins = 0;
let dealerWins = 0;
let playerTurn = true;
let gameGoing = true;



function startGame() {
    document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
    document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
    document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
    document.getElementById('textHeading').innerHTML = "Players Turn";
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('play-again-button').style.display = 'none';
    document.getElementById('hit-button').style.display = 'block';
    document.getElementById('stand-button').style.display = 'block';
    gameGoing = true;
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            deckId = data.deck_id; // Extract the deck ID from the response data
            console.log("New deck created with ID:", deckId); // Log the deck ID to the console

            // Draw two cards from the newly created deck using the deck ID
            return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
        })
        .then(response => response.json()) // Parse the response of the draw request as JSON
        .then(data => {
            // Iterate over the drawn cards and log their value and suit
            data.cards.forEach(card => {
                console.log(`You drew the ${card.value} of ${card.suit}`);
                const cardImage = document.createElement('img');
                cardImage.src = card.image;
                cardImage.style.width = '100px';
                document.getElementById('player-hand').appendChild(cardImage);
                // Update the player's points
                const cardValue = card.value;
                let points;
                if (cardValue === "ACE") {
                    points = 11; // or 1, based on game rules
                } else if (["KING", "QUEEN", "JACK"].includes(cardValue)) {
                    points = 10;
                } else {
                    points = parseInt(cardValue);
                }
                playerPoints += points;
                if(playerPoints === 21){
                    checkScores();
                }
                document.getElementById('player-points').textContent = playerPoints;
                console.log(`Player points: ${playerPoints}`);
            });
        })
        .catch(error => console.error("An error occurred:", error)); // Log any errors that occur during the fetch requests
}

function hit() {
    if (gameGoing && playerTurn) {
        // Add a card to the player's hand
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                const cardImage = document.createElement('img');
                cardImage.src = data.cards[0].image;
                cardImage.style.width = '100px';
                console.log(`You drew the ${data.cards[0].value} of ${data.cards[0].suit}`);
                document.getElementById('player-hand').appendChild(cardImage);

                // Update the player's points
                const cardValue = data.cards[0].value;
                let points;
                if (cardValue === "ACE") {
                    points = playerPoints + 11 > 21 ? 1 : 11; // or 1, based on game rules
                } else if (["KING", "QUEEN", "JACK"].includes(cardValue)) {
                    points = 10;
                } else {
                    points = parseInt(cardValue);
                }
                playerPoints += points;
                checkScores();
                document.getElementById('player-points').textContent = playerPoints;
                console.log(`Player points: ${playerPoints}`);

            })
            .catch(error => console.error("An error occurred:", error)); // Log any errors that occur during the fetch request
    }

}

function checkScores() {
    if (playerPoints === 21 && playerTurn) {
        console.log(`Player wins. Blackjack`);
        document.getElementById('textHeading').innerHTML = "Player wins"
        playerWins++;
        document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
        document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
        document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
        gameGoing = false;
    } else if (playerPoints > 21) {
        console.log(`Dealer wins. Player busts`);
        document.getElementById('textHeading').innerHTML = "Dealer wins"
        dealerWins++;
        document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
        document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
        document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
        gameGoing = false;
    } else if (!playerTurn) {
        if (dealerPoints === 21) {
            console.log(`Dealer wins. Blackjack`);
            document.getElementById('textHeading').innerHTML = "Dealer wins"
            dealerWins++;
            document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
            document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
            document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
            gameGoing = false;
        } else if (dealerPoints > 21) {
            console.log(`Player wins. Dealer busts`);
            document.getElementById('textHeading').innerHTML = "Player wins"
            playerWins++;
            document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
            document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
            document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
            gameGoing = false;
        } else if (dealerPoints >= 17 && dealerPoints >= playerPoints) {
            console.log(`Dealer wins.`);
            document.getElementById('textHeading').innerHTML = "Dealer wins"
            dealerWins++;
            document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
            document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
            document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
            gameGoing = false;
        } else if (dealerPoints >= 17 && dealerPoints < playerPoints) {
            console.log(`Player wins.`);
            document.getElementById('textHeading').innerHTML = "Player wins"
            playerWins++;
            document.getElementById('player-cash').innerHTML = "Cash: " + playerCash;
            document.getElementById('player-wins').innerHTML = "Player Wins: " + playerWins;
            document.getElementById('dealer-wins').innerHTML = "Dealer Wins: " + dealerWins;
            gameGoing = false;
        }
    }

    if (!gameGoing) {
        document.getElementById("play-again-button").style.display = 'block';
    }
}


function stand() {
    if (gameGoing && playerTurn) {
        playerTurn = false;
        document.getElementById("hit-button").style.display = 'none';
        document.getElementById("stand-button").style.display = 'none';
        dealerTurn();
    }
}

function dealerTurn() {
    console.log("Dealer's turn begins.");
    document.getElementById('textHeading').innerHTML = "Dealers Turn"
    const dealerThreshold = 17; // Dealer must stand at 17 or higher

    // Function to draw a single card with a delay
    function drawCardWithDelay() {
        // Check if the dealer needs to draw more cards
        if (dealerPoints < dealerThreshold && gameGoing) {
            setTimeout(() => {
                // Draw a single card from the deck
                fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
                    .then(response => response.json())
                    .then(data => {
                        const card = data.cards[0];
                        const cardImage = document.createElement('img');
                        cardImage.src = card.image;
                        cardImage.style.width = '100px';
                        document.getElementById('dealer-hand').appendChild(cardImage);

                        // Calculate card value
                        let cardValue = card.value;
                        let points;
                        if (cardValue === "ACE") {
                            points = dealerPoints + 11 > 21 ? 1 : 11; // Choose the best value for the ACE
                        } else if (["KING", "QUEEN", "JACK"].includes(cardValue)) {
                            points = 10;
                        } else {
                            points = parseInt(cardValue);
                        }

                        // Update dealer's points
                        dealerPoints += points;
                        document.getElementById('dealer-points').textContent = dealerPoints;
                        console.log(`Dealer drew ${card.value} of ${card.suit}. Dealer points: ${dealerPoints}`);

                        // Continue drawing cards if dealerPoints < dealerThreshold
                        drawCardWithDelay();
                    })
                    .catch(error => console.error("An error occurred during dealer draw:", error));
            }, 1000); // 1000ms (1-second) delay before drawing the next card
        } else {
            console.log(`Dealer stands with ${dealerPoints} points.`);
            checkScores(); // Check final scores after the dealer stands
        }
    }

    drawCardWithDelay(); // Start drawing cards
}

function resetGame() {
    playerPoints = 0;
    dealerPoints = 0;
    playerTurn = true;
    gameGoing = true;
    document.getElementById('player-hand').innerHTML = '';
    document.getElementById('dealer-hand').innerHTML = '';
    document.getElementById('dealer-points').textContent = '';
    document.getElementById('player-points').textContent = '';
    startGame();
}