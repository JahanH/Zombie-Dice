// Write JavaScript here and press Ctrl+Enter to execute
const SYM = {
	heart: "fas fa-heart",
  hit: "fas fa-times",
  escaped: "fab fa-accessible-icon"
}
const ALLDICE = [
      {
        id: 1,
        sides: [SYM.heart,SYM.hit,SYM.heart,SYM.escaped,SYM.heart,SYM.escaped]
      },
     	{
        id: 2,
        sides: [SYM.heart,SYM.hit,SYM.heart,SYM.escaped,SYM.heart,SYM.escaped]
      },
      {
        id: 3,
        sides: [SYM.heart,SYM.hit,SYM.heart,SYM.escaped,SYM.heart,SYM.escaped]
      },
      {
        id: 4,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.escaped,SYM.hit,SYM.heart]
      },
     	{
        id: 5,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.escaped,SYM.hit,SYM.heart]
      },
      {
        id: 6,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.escaped,SYM.hit,SYM.heart]
      },
      {
        id: 7,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.hit,SYM.escaped,SYM.hit]
      },
     	{
        id: 8,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.hit,SYM.escaped,SYM.hit]
      },
      {
        id: 9,
        sides: [SYM.escaped,SYM.hit,SYM.heart,SYM.hit,SYM.escaped,SYM.hit]
      }
]

const Stats = (props) =>{
  return (
    <div className="infoPane"> 
     	<h2>Score: {props.stats.totalScore}</h2>
     	<br/>
    	<h4>Hearts: {props.stats.hearts}</h4>
      <h4>Escaped: {props.stats.fled.length}</h4>
      <h4>Hits: {props.stats.hits}</h4>
      <br/>
		</div>  
  )
}

class Control extends React.Component{
	render(){
  	let rollDisplay = "ROLL EM!";
    let gameOver = this.props.gameState.gameWon || this.props.gameState.gameLost;
    if(gameOver){
    	rollDisplay = "Play again?";
    }
    return (
  		<div className="controlPane">
    		<button className="roll" onClick={() => this.props.rollDice(ALLDICE)}>
        	<h3>{rollDisplay}</h3>
          <h4>Turns: {this.props.turns}</h4>
        </button>
     		{gameOver || <button className="end" onClick={() => this.props.endTurn()}>End Turn</button>}
    	</div>
		)
  }
}

const Dice = (props) => {
	const symbolClass = (die) => {
    return die;
  }
  const colorClass = (die) => {
  	switch (die) {
    	case SYM.heart:
      	return "green";
        break;
      case SYM.hit: 
      	return "red";
        break;
      case SYM.escaped:
				return "blue";
        break;
    }
  }
  let display;
  if(props.gameState.gameWon){
    display = <h1>YOU WON!</h1>;
  }
  else if(props.gameState.gameLost){
    display = <h1>YOU LOSE!</h1>;
  }
  else if(!props.gameState.gameWon && !props.gameState.gameLost){
    display = (
    		<div>
          {props.rolledDice.map((die, i) => 
            <i className={`fa-border ${symbolClass(die)}`} style={{color: colorClass(die)}} key={i}></i>
          )}
        </div>
    )
  }
  
	return (
    <div className="diceRow">
			{display}
    </div>
  )
}

class Game extends React.Component{
	state = {
  	remainingDice: ALLDICE.slice(0),
    rolledDice: [],
    stats: {
    	totalScore: 0,
    	hearts: 0,
    	fled: [],
    	hits: 0
    },
    turns: 5,
    gameState: {
      gameWon: false,
      gameLost: false
  	}
  };
  rollDice = (arr) => {
  		//First check if game is over and reset state
  		if(this.state.gameState.gameWon || this.state.gameState.gameLost){
      	this.setState({
          remainingDice: ALLDICE.slice(0),
          rolledDice: [],
          stats: {
            totalScore: 0,
            hearts: 0,
            fled: [],
            hits: 0
          },
          turns: 5,
          gameState: {
            gameWon: false,
            gameLost: false
          }
        })
      }
      else{
      	//Randomly rearrange ALL the dice before "rolling"
        let shuffled = arr.slice(0), i = arr.length, rolled, temp, index;
        while (i--) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        }
        //take top 3 dice plus previously rolled "escaped" dice
        rolled = shuffled.splice(0, 3);
        rolled = rolled.concat(this.state.stats.fled);

        //temp containers and iteration index
        let j = rolled.length, 
            upside,
            tempArr = [],
            tempHit = 0, 
            tempFled = [],
            tempHeart = 0; 

        //get random "top" side from rolled dice and increment counters 
        while(j--){
          upside = rolled[j].sides[Math.floor(6*Math.random())];
          switch(upside) {
            case SYM.hit: 
              tempHit++;
              break;
            case SYM.escaped:
              tempFled.unshift(rolled[j]);
              break;
            case SYM.heart:
              tempHeart++;
              break;
          }
          tempArr.unshift(upside);
        }

        //set state with final new counts/values
        this.setState(prevState => {
          return {
              remainingDice: shuffled,
              rolledDice: tempArr,
              stats: {
                totalScore: prevState.stats.totalScore,
                hearts: prevState.stats.hearts + tempHeart,
                fled: tempFled,
                hits: prevState.stats.hits + tempHit,
              }
          }
        });
        //if hits are 3 or more automatically end turn
        if(this.state.stats.hits >= 3){
          this.endTurn();
        }
        this.checkGameOver();
      }
  };
  endTurn = () => {
  	//clean state for next turn
		this.setState(prevState => {
    	return {
          remainingDice: ALLDICE.slice(0),
          rolledDice: [],
          stats: {
            totalScore: prevState.stats.hits >= 3 ? prevState.stats.totalScore : prevState.stats.totalScore + prevState.stats.hearts,
            hearts: 0,
            fled: [],
            hits: 0
          },
          turns: prevState.turns > 0 ? prevState.turns - 1 : 0
    	}
    });
    this.checkGameOver();
	}
  checkGameOver = () => {
  	    if(this.state.stats.totalScore >= 13){
          this.setState({
            gameState: {
              gameWon: true,
              gameLost: false
            }
          });
        }
        else if(this.state.turns <= 0 && this.state.stats.totalScore < 13){
          this.setState({
            gameState: {
              gameWon: false,
              gameLost: true
            }
          });
        }
  };
	render(){
  	return (
    	<React.Fragment>
        <hr/>
        <Dice rolledDice={this.state.rolledDice} gameState={this.state.gameState}/>
      	<hr/>
      	<div>
      		<Stats stats={this.state.stats}/>
      		<Control 
          	turns={this.state.turns}
            gameState={this.state.gameState}
            endTurn={this.endTurn} 
          	rollDice={this.rollDice} />
      	</div>
      </React.Fragment>
    )
  }
}

class App extends React.Component{
	render() {
  	return (
    	<div>
      	<h1>Zombie Dice</h1>
        <p>Rules:</p>
        	<ul>
          	<li>Hit the green button to roll 3 dice</li>
            <li>Collect as many hearts as you can before your turn is over</li>
            <li>If you get 3 or more red Xs, you lose all your hearts and the turn is over</li>
            <li>Oh no! Some victims escaped in wheelchairs! Escaped dice will carry over into your next roll</li>
            <li>Click "End Turn" to end your turn and add all collected hearts to your total score</li>
            <li>Reach a total score of 13 or more to win, run out of turns and you lose!</li>
          </ul>
				<Game />
      </div>
    )
	}
}

ReactDOM.render(<App />, mountNode);
