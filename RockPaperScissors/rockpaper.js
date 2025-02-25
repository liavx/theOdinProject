let humanScore = 0;
let computerScore = 0;
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", () => playGame(button.id))
});
const scoreboard = document.querySelector("#scoreboard");
const message= document.createElement("div");
const score = document.createElement("div");
scoreboard.appendChild(message);
scoreboard.appendChild(score);





function getComputerChoice() {
    let rand = Math.floor(Math.random() * 3);
    switch (rand) {
        case 0:
            return "paper"
        case 1:
            return "rock"
        case 2:
            return "scissors"
    }
}


function playRound (humanChoice , computerChoice){
      if (humanChoice == computerChoice) {
        message.textContent = "You played the same move";
      }
      else if (humanChoice == "paper" && computerChoice == "scissors" ||
               humanChoice == "scissors" && computerChoice == "rock" ||
               humanChoice == "rock"  && computerChoice == "paper"
       ){
        message.textContent = `you lose! ${computerChoice} beats ${humanChoice}`;
        computerScore++;
       } else{
        message.textContent =`you won! ${humanChoice} beats ${computerChoice}`;
        humanScore++;
       }
}

function playGame(userMove) {
playRound(userMove,getComputerChoice());
score.textContent = `Current Score - You: ${humanScore}, Computer: ${computerScore}\n`;
if (humanScore == 5 || computerScore == 5){
    printWinner(humanScore, computerScore)
    humanScore = 0;
    computerScore = 0;
    score.textContent = `Current Score - You: ${humanScore}, Computer: ${computerScore}`;

}

}

function printWinner (humanScore , computerScore){
    if(humanScore > computerScore){
        message.textContent = "You have won the game";
    }else{
        message.textContent="You Lost!";
    }
}


