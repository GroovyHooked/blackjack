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
  betting_input,
  betting_value,
  app
} from "./utils.js";

const fakeHandForPlayer = {
  0: {
    value: 10,
    width: "-630px",
    height: "275px",
  },
  1: {
    value: 11,
    width: "-80px",
    height: "275px",
  },
};

let player = {};
let dealer = {};
let isDealerTurn = false;
let wallet = 50;
let betValue = 5;

betting_value.innerHTML = betValue;

function _entierAleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _changeBettingValue(event) {
  betValue = event.target.value;
  betting_value.innerHTML = event.target.value;
  console.log(betValue);
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
function _isPlayerLostEvrerything() {
  if (wallet <= 0) _gameOver()
}

function _gameOver() {
  const div = document.createElement('div');
  const title = document.createElement('h1')
  title.innerHTML = "Game Over";
  title.style.color = "white";
  div.appendChild(title);
  div.style.display = "flex";
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "0";
  div.style.right = "0";
  div.style.bottom = "0";
  div.style.backgroundColor = "rgba(0,0,0,0.8)";
  div.style.justifyContent = "center";
  div.style.fontSize = "1.5rem";
  div.style.gap = "50px";
  div.style.alignItems = "center";
  div.style.flexDirection = "column";
  const replay_button = document.createElement('button');
  replay_button.innerHTML = "Replay";
  replay_button.classList.add('btn');
  replay_button.style.color = "white";
  div.appendChild(replay_button);
  app.appendChild(div);
  replay_button.addEventListener('click', () => {
    wallet = 50;
    walletValue.innerHTML = wallet;
    betting_value.innerHTML = "5";
    betting_input.value = "5";
    betValue = 5;
    restartGame();
    div.remove();
  })
}

function _updateWinner(who) {
  if (who.includes("Player")) winner.style.color = "#81B29A";
  if (who.includes("Dealer")) winner.style.color = "#E07A5F";
  winner.innerHTML = who;
}

function _updateWallet(status) {
  if (status === "win") {
    wallet += Number(betValue);
  } else {
    wallet -= Number(betValue);
  }
  walletValue.innerHTML = wallet;
}

function _playeSound() {
  const audio = new Audio("./carte.mp3");
  audio.play();
}

function _addRandomCardWithDetails(participant, bool = false) {
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
  // if (participant === player) {
  //   player[index] = {
  //     value: bool ? fakeHandForPlayer[0].value : fakeHandForPlayer[1].value,
  //     width: cards[entier].width,
  //     height: symbols[color].height,
  //   };
  // } else {
  participant[index] = {
    value: value ? value : cards[entier].value,
    width: cards[entier].width,
    height: symbols[color].height,
  };
  // }
}

function _dealCards(whichPlayer) {
  _addRandomCardWithDetails(whichPlayer);
  _addRandomCardWithDetails(whichPlayer, true);
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

function _removeDealtCards() {
  const added = document.querySelectorAll(".added-sprite");
  if (added.length > 0) {
    added.forEach((child) => {
      child.remove();
    });
  }
}

function _startGame(dealer, player) {
  _updateWinner("");
  _removeDealtCards();
  _dealCards(player);
  _dealCards(dealer);
  if (_isBlackJack(player)) {
    button3.classList.remove("btn-disabled")
    button3.disabled = false;
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
      button3.classList.remove("btn-disabled")
      button3.disabled = false;
      _enableAndDisableButtons();
      _updateWinner("Dealer wins");
      _updateWallet("lost");
      _isPlayerLostEvrerything();
    }
    clearTimeout(timeout);
  }, 500);
};

const dealerTakeOver = (dealer, player) => {
  _playeSound();
  button3.classList.remove("btn-disabled") 
  button3.disabled = false
  betting_input.disabled = false
  const timeout = setTimeout(() => {
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
      _isPlayerLostEvrerything();
      return;
    }
    if (_getHandValue(dealer) <= _getHandValue(player)) {
      console.log("Player wins", _getHandValue(player));
      _updateWinner("Player wins");
      _updateWallet("win");
      _enableAndDisableButtons();
      return;
    }
    clearTimeout(timeout);
  }, 500);
};

function restartGame(){
  dealer = {};
  player = {};
  winner.style.width = "80px";
  winner.classList.remove("blackjack");
  winner.innerHTML = ""
  winner.style.top = "0px";
  winner.style.left = "0px";
  _timeToBet();
};

function _timeToBet() {
  _removeDealtCards();
  if (button3.innerHTML !== "Bet") {
    button3.innerHTML = "Bet"
    betting_input.disabled = false
    player_counter.innerHTML = "&nbsp;";
    dealer_counter.innerHTML = "&nbsp;";
    player1.style.backgroundPosition = "-795px 340px";
    player2.style.backgroundPosition = "-795px 340px";
    dealer1.style.backgroundPosition = "-795px 340px";
    dealer2.style.backgroundPosition = "-795px 340px";
  } else {
    button3.innerHTML = "Replay"
    button3.disabled = true
    button3.className += " btn-disabled"
    betting_input.disabled = true
    _enableAndDisableButtons();
    isDealerTurn = false;
    _startGame(dealer, player);
  }
}


_timeToBet()
_enableAndDisableButtons()

button1.addEventListener("click", playerPlay);
button2.addEventListener("click", () => dealerTakeOver(dealer, player));
button3.addEventListener("click", restartGame);
betting_input.addEventListener("input", _changeBettingValue);
