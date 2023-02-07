import {
  cards,
  symbols,
  button1,
  button2,
  button3,
  dealer1,
  dealer2,
  player1,
  player2,
  player_container,
  dealer_container,
  player_counter,
  dealer_counter,
  winner,
  walletValue,
} from "./utils.js";

let player = {};
let dealer = {};
let isDealerTurn = false;
let wallet = 50;

function _entierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _updatePlayerScore(score) {
  player_counter.innerHTML = score;
}

function _updateDealerScore(score) {
  dealer_counter.innerHTML = score;
}

function _isBlackJack(participant) {
  const [firstCard, secondCard] = Object.values(participant);
  const total = firstCard.value + secondCard.value;
  if (total === 21) return true;
  return false;
}

function _updateWinner(who) {
  if (who.includes("Player")) winner.style.color = "#81B29A";
  if (who.includes("Dealer")) winner.style.color = "#E07A5F";
  winner.innerHTML = who;
}

function _updateWallet(status) {
  if (status === "win") {
    wallet += 5;
  } else {
    wallet -= 5;
  }
  walletValue.innerHTML = wallet;
}

function _playeSound() {
  const audio = new Audio("./carte.mp3");
  audio.play();
}

function _addRandomCardWithDetails(participant) {
  const entier = _entierAleatoire(1, 13);
  let value = undefined;
  if (cards[entier].value === 11) {
    if (_getRealHandValue(participant) + 11 > 21) {
      value = 1;
    } else {
      value = 11;
    }
  }
  const color = _entierAleatoire(1, 4);
  const index = Object.entries(participant).length;
  participant[index] = {
    value: value ? value : cards[entier].value,
    width: cards[entier].width,
    height: symbols[color].height,
  };
}

function _dealCards(whichPlayer) {
  _addRandomCardWithDetails(whichPlayer);
  _addRandomCardWithDetails(whichPlayer);
  if (whichPlayer === player) {
    _updatePlayerScore(_getHandValue(player));
  } else {
    _updateDealerScore(_getHandValue(dealer));
  }
}

function _getHandValue(hand) {
  if (hand === dealer && isDealerTurn === false) return dealer[1]?.value;
  let count = 0;
  for (const [, value] of Object.entries(hand)) {
    count += value.value;
  }
  return count;
}

function _getRealHandValue(hand) {
  let count = 0;
  for (const [, value] of Object.entries(hand)) {
    count += value.value;
  }
  return count;
}

function _isLost(whoPlays) {
  return _getHandValue(whoPlays) > 21;
}

function _enableAndDisableButtons() {
  button1.disabled = !button1.disabled;
  button2.disabled = !button2.disabled;
  button1.classList.toggle("btn-disabled");
  button2.classList.toggle("btn-disabled");
}

function _addCardToDeck(participant) {
  const card = document.createElement("div");
  card.classList.add("sprite");
  card.classList.add("added-sprite");
  const index = Object.entries(participant).length - 1;
  card.style.backgroundPosition =
    participant[index].width + " " + participant[index].height;
  participant === player
    ? player_container.appendChild(card)
    : dealer_container.appendChild(card);
}

function _startGame(dealer, player) {
  _updateWinner("");
  const added = document.querySelectorAll(".added-sprite");
  if (added.length > 0) {
    added.forEach((child) => {
      child.remove();
    });
  }
  _dealCards(player);
  _dealCards(dealer);
  if (_isBlackJack(player)) {
    winner.style.width = "130px";
    winner.style.color = "#81B29A";
    winner.style.top = "250px";
    winner.style.left = "-5px";
    winner.className += " blackjack";
    _updateWinner("BLACKJACK");
    _updateWallet("win");
    _enableAndDisableButtons();
  }
  _updateDealerScore(_getHandValue(dealer));
  player1.style.backgroundPosition = player[0].width + " " + player[0].height;
  player2.style.backgroundPosition = player[1].width + " " + player[1].height;
  dealer1.style.backgroundPosition = "-795px 340px";
  dealer2.style.backgroundPosition = dealer[1].width + " " + dealer[1].height;
}

const playerPlay = () => {
  _addRandomCardWithDetails(player);
  _playeSound();
  const timeout = setTimeout(() => {
    _addCardToDeck(player);
    _updatePlayerScore(_getHandValue(player));
    if (_isLost(player)) {
      _enableAndDisableButtons();
      _updateWinner("Dealer wins");
      _updateWallet("lost");
    }
    clearTimeout(timeout);
  }, 200);
};

const dealerTakeOver = (dealer, player) => {
  _playeSound();
  isDealerTurn = true;
  dealer1.style.backgroundPosition = dealer[0].width + " " + dealer[0].height;
  _updateDealerScore(_getHandValue(dealer));
  while (_getHandValue(dealer) < 17) {
    _addRandomCardWithDetails(dealer);
    _addCardToDeck(dealer);
    _updateDealerScore(_getHandValue(dealer));
  }
  if (_isLost(dealer)) {
    console.log("Dealer lost", _getHandValue(dealer));
    _updateWinner("Player wins");
    _updateWallet("win");
    _enableAndDisableButtons();
    return;
  }
  if (_getHandValue(dealer) > _getHandValue(player)) {
    console.log("Dealer wins", _getHandValue(dealer));
    _updateWinner("Dealer wins");
    _updateWallet("lost");
    _enableAndDisableButtons();
    return;
  }
  if (_getHandValue(dealer) <= _getHandValue(player)) {
    console.log("Player wins", _getHandValue(player));
    _updateWinner("Player wins");
    _updateWallet("win");
    _enableAndDisableButtons();
    return;
  }
};

const restartGame = () => {
  dealer = {};
  player = {};
  winner.style.width = "80px";
  winner.classList.remove("blackjack");
  winner.style.top = "0px";
  winner.style.left = "0px";
  _enableAndDisableButtons();
  isDealerTurn = false;
  _startGame(dealer, player);
};

_startGame(dealer, player);

button1.addEventListener("click", playerPlay);
button2.addEventListener("click", () => dealerTakeOver(dealer, player));
button3.addEventListener("click", restartGame);
