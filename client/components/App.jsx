import React, { Component } from 'react';
import UserInfo from './UserInfo.jsx';
import Stats from './Stats.jsx';
import GameContainer from './GameContainer.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //ACTUAL DEFAULT
      username: document.cookie.slice(9),
      gameMode: false,
      results: [],
      stats: { gamesPlayed: 0, correctAnswers: 0 },
      correctResponses: [],
      incorrectResponses: [],
      question: {},
      choice: 'none',
      is_correct: null
    };

    // Function binds=================================================
    this.startGame = this.startGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.sendStats = this.sendStats.bind(this);
  }

  // Wait until server is working to test correct data
  componentDidMount() {
    fetch(`/trivia/${this.state.username}`)
      .then(res => res.json())
      .then(data => {
        const { username, results, gamesPlayed, correctAnswers } = data;
        this.setState({
          username,
          results,
          stats: { gamesPlayed, correctAnswers }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  startGame() {
    if (!this.state.gameMode) {
      fetch(`/trivia/${this.state.username}`)
        .then(res => res.json())
        .then(data => {
          const { results, gamesPlayed, correctAnswers } = data;
          const gameMode = true;
          const question = results.pop();
          this.setState({
            gameMode,
            results,
            question,
            stats: { gamesPlayed, correctAnswers }
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let gameMode = this.state.gameMode;
      let results = [...this.state.results];
      let question = this.state.question;

      // populate question
      if (results.length > 0) {
        question = results.pop();
        gameMode = true;
      }
      // Updating state
      this.setState({
        gameMode,
        results,
        question,
        choice: 'pending'
      });
    }
  }

  handleClick(e) {
    let gameMode = this.state.gameMode;
    const choice = e.target.value;
    const correct = this.state.question.correct_answer;
    const correctResponses = [...this.state.correctResponses];
    const incorrectResponses = [...this.state.incorrectResponses];
    // console.log('button value', e.target.value);
    // console.log('correct', correct);
    if (choice === correct) {
      correctResponses.push(this.state.question);
      this.setState({ is_correct: 'true' });
    } else {
      incorrectResponses.push(this.state.question);
      this.setState({ is_correct: 'false' });
    }
    if (this.state.results.length > 0) {
      this.startGame();
    } else {
      this.sendResponse();
      gameMode = false;
    }
    e.target.checked = false;
    this.setState(
      {
        gameMode,
        correctResponses,
        incorrectResponses,
        choice: choice
      },
      () => this.sendStats()
    );
  }

  sendResponse() {
    console.log('Sending Repsonse...');
    fetch('/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        correctAnswers: this.state.correctResponses.length
      })
    })
      .then(res => res.json())
      .then(data => {
        const { gamesPlayed, correctAnswers } = data;
        this.setState({
          stats: { gamesPlayed, correctAnswers }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendStats() {
    let tempTime = new Date();
    let stringTime = tempTime.toString();
    fetch('/response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: this.state.question.category,
        difficulty: this.state.question.difficulty,
        is_correct: this.state.is_correct,
        actual_answer: this.state.question.correct_answer,
        chosen_answer: this.state.choice,
        username: this.state.username,
        question: this.state.question.question,
        current_time: stringTime,
        response_time: '20',
        stats: this.state.stats
      })
    });
  }

  render() {
    return (
      <div className="app">
        {/* ===================================================================================== */}
        {/* When User is logged in, and gameMode=false, render UserInfo, Stats, and GameContainer */}
        {/* ===================================================================================== */}
        {!this.state.gameMode ? (
          <React.Fragment>
            <UserInfo
              username={this.state.username}
              gameMode={this.state.gameMode}
            />
            <Stats stats={this.state.stats} gameMode={this.state.gameMode} />
            <GameContainer
              results={this.state.results}
              gameMode={this.state.gameMode}
              startGame={this.startGame}
            />
          </React.Fragment>
        ) : (
          //*================================================================= */}
          //* When User is logged in, and gameMode=true, render GameContainer */}
          //*================================================================= */}
          <React.Fragment>
            <GameContainer
              choice={this.state.choice}
              results={this.state.results}
              gameMode={this.state.gameMode}
              question={this.state.question}
              handleClick={this.handleClick}
            />
          </React.Fragment>
        )}
        {/* ================================================================= */}
      </div>
    );
  }
}

export default App;
