/*----- constants -----*/
const STARTING_BALANCE = 1000;
const OUTCOMES = {
    'playerWins': 'Player Wins!',
    'dealerWins': 'Dealer Wins, Try again!',
    'tie': "It's a Tie!",
    'playerBlackjack': 'Blackjack! Player Wins!',
    'dealerBlackjack': 'Dealer gets Blackjack!',
    'playerBust': 'Player Busts, You Lose!',
    'dealerBust': 'Dealer Busts, You Win!'
};

/*----- app's state (variables) -----*/
var balance; 
var deck;
var currentBet; 
var dealerHand;
var playerHand;  
var dealerSum;
var playerSum;  
var result;

/*----- cached element references -----*/
var modalContainer = document.getElementById('modal-container'); 
var dealerTotal = document.getElementById('dealerTotal');  
var playerTotal = document.getElementById('playerTotal');
var actionBtnCntr = document.querySelector('.action-btn-container');
var dealBtn = document.getElementById('deal-btn'); 
var hitBtn = document.getElementById('hit-btn');
var standBtn = document.getElementById('stand-btn');
var doubleBtn = document.getElementById('double-btn');
var dealerCards = document.getElementById('dealerCards'); 
var playerCards = document.getElementById('playerCards');
var chipsContainer = document.querySelector('.chip-container');
var betContainer = document.getElementById('bet-container');
var announceTxt = document.getElementById('announcementText');
var moneyTxt = document.getElementById('moneyLost');

/*----- event listeners -----*/
doubleBtn.addEventListener('click', double);
document.getElementById('quitBtn').addEventListener('click', reloadPage);
document.getElementById('restartBtn').addEventListener('click', initGame);
document.getElementById('start-btn').addEventListener('click', function(event) { 
    modalContainer.style.display = 'none';
});
var currentBalance = document.getElementById('currentBalance'); 
chipsContainer.addEventListener('click', placeBet);
dealBtn.addEventListener('click', dealCards); 
hitBtn.addEventListener('click', hitMe);
standBtn.addEventListener('click', stand);

/*----- functions -----*/
function double() {
    drawCard(playerHand);
    playerSum = computeHand(playerHand);
    if (computeHand(playerHand) > 21) result = 'playerBust';
    currentBet += currentBet;
    computerLogic();
    checkWin();
}

function reloadPage() {
    location.reload();
}

function computerLogic() {
    while (dealerSum < 17) {
        drawCard(dealerHand)
        dealerSum = computeHand(dealerHand);
    }
    renderGame();
}

function computePayout() {
    if (result === 'playerWins' || result === 'playerBlackjack' || result === 'dealerBust') balance += currentBet;
    if (result === 'dealerWins' || result === 'dealerBlackjack' || result === 'playerBust') {
        currentBet = 0;
    } else {
        balance += currentBet;
    }
    currentBet = 0;
}

function checkWin() {
    if (computeHand(playerHand) > computeHand(dealerHand)) result = 'playerWins';
    if (computeHand(playerHand) < computeHand(dealerHand)) result = 'dealerWins';
    if (computeHand(playerHand) === computeHand(dealerHand)) result = 'tie';
    if (computeHand(playerHand) === 21) result = 'playerWins';
    if (computeHand(dealerHand) === 21) result = 'dealerWins';
    if (computeHand(playerHand) > 21) result = 'playerBust';
    if (computeHand(dealerHand) > 21) result = 'dealerBust';
    computePayout();
    renderGame();
}

function checkBlackJack() { 
    if ((playerSum === 21) && (playerSum === dealerSum)) {
        result = 'tie';
    } else if (playerSum === 21) {
        result = 'playerBlackjack';
    } else if (dealerSum === 21) {
        result = 'dealerBlackjack';
    }
}

function stand() {
    showDealerCard();
    dealerSum = computeHand(dealerHand);
    renderGame();
    computerLogic();
    checkWin();
}

function computeHand(hand) {
    var sum = 0;
    var aces = 0;
    hand.forEach(function(card) {
        sum += card.value;
        if (card.display.includes('A')) aces++;
    });
    if (sum !== 21) {
        while (sum > 21 && aces) {
            sum -= 10;
            aces -= 1;   
        }
    }   
    return sum;
}

function hitMe() {
    drawCard(playerHand);
    playerSum = computeHand(playerHand);
    if (computeHand(playerHand) > 21){
        showDealerCard();
        dealerSum = computeHand(dealerHand);  
        result = 'playerBust';
    } 
    renderGame();
}

function drawCard(hand) {
    hand.push(deck.pop());
}

function dealCards() {
    if (deck.length < 20) makeNewDeck();
    drawCard(dealerHand);
    dealerSum = computeHand(dealerHand);
    drawCard(dealerHand);
    drawCard(playerHand);
    drawCard(playerHand);
    playerSum = computeHand(playerHand);
    checkBlackJack();
    renderGame()
}

function placeBet(event) {
    var betAmt = parseInt(event.target.textContent);
    if (betAmt > balance) return;
    balance -= betAmt;
    currentBet += betAmt;
    renderGame();
}

function inProgress() {
    return ((playerHand.length !== 0) && !result);
}

function showPlayerCard() {
    html = '';
    playerHand.forEach(function(card) {
        html += `<div class="card large ${card.display}"></div>`;
    });
    playerCards.innerHTML = html;
}

function showDealerCard() {
    var html = '';
    dealerHand.forEach(function(card, idx) {
        html += `<div class="card large ${inProgress() && idx === 1 ? 'back-red' : card.display}"></div>`;
    });
    dealerCards.innerHTML = html;
}

function renderGame() {
    showDealerCard();
    showPlayerCard();
    currentBalance.textContent = balance;
    moneyTxt.textContent = `$ ${currentBet}`;
    dealerTotal.textContent = dealerSum;
    playerTotal.textContent = playerSum;
    betContainer.style.visibility = inProgress() ? 'hidden' : 'visible'; 
    actionBtnCntr.style.visibility = inProgress() ? 'visible' : 'hidden';
    announceTxt.textContent = result ? OUTCOMES[result] : 'Place your bets and press DEAL!';
    dealBtn.style.visibility = currentBet && (playerHand.length < 2) ? 'visible' : 'hidden';
    dealBtn.disabled = !currentBet;
    doubleBtn.style.visibility = inProgress() && (playerHand.length <= 2) ? 'visible' : 'hidden';
    if (result) resetHand();
}

function shuffleDeck() {
    for (var i = 0; i < deck.length; i++) {
        let swapIndex = Math.floor(Math.random() * deck.length);
        let randomCard = deck[swapIndex];
        let currentCard = deck[i];
        deck[swapIndex] = currentCard;
        deck[i] = randomCard;
    }
    return deck;
}

function buildDeck() {
    var suits = ['d', 'h', 's', 'c'];
    var names = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
    var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    var deck = [];

    suits.forEach(function(suit) {
        names.forEach(function(name, idx) {
            var card = {
                display: suit + name,
                value: values[idx]
            };
            deck.push(card);
        });
    });
    return deck;
}

function resetHand() {
    dealerHand = [];
    playerHand = [];
    dealerSum = 0;
    playerSum = 0;
    currentBet = 0;
    result = null;
}

function makeNewDeck() {
    deck = buildDeck();
    shuffleDeck();
}

function initGame() {
    resetHand();
    balance = STARTING_BALANCE;
    makeNewDeck();
    renderGame();   
}

initGame();