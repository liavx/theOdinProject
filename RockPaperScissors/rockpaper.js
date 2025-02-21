let humanScore;
let computerScore;

function getComputerChoice() {
    let rand = Math.floor(Math.random() * 3);
    switch (rand) {
        case 0:
            return "paper"
        case 1:
            return "rock"
        case 2:
            return "scissor"
    }
}

function getHumanChoice() {
    while(true){
    let userMove = prompt ("enter your move").toLowerCase();
    if (userMove == "paper" || userMove == "rock" || userMove == "scissor" ){
        return userMove;
    }else{
        continue;
    }
}
}

function playRound (humanChoice , computerChoice){
      if (humanChoice == computerChoice) {
        console.log("You played the same move")
      }
      else if (humanChoice == "paper" && computerChoice == "scissor" ||
               humanChoice == "scissor" && computerChoice == "rock" ||
               humanChoice == "rock"  && computerChoice == "paper"
       ){
        console.log (`you lose! ${computerChoice} beats ${humanChoice}`);
        computerScore++;
       } else{
        console.log (`you won! ${humanChoice} beats ${computerChoice}`);
        humanScore++;
       }
}

function playGame() {
humanScore = 0;
computerScore = 0;
for (let i = 0 ; i <5 ; i ++){
playRound(getHumanChoice(),getComputerChoice());
console.log(humanScore,computerScore);
}
printWinner(humanScore,computerScore);
}

function printWinner (humanScore , computerScore){
    if(humanScore == computerScore){
        console.log("its a tie");
    }
    else if(humanScore > computerScore){
        console.log("You have won the game");
    } else{
        console.log("You Lost!");
    }
}

playGame();

