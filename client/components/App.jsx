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
    this.getLeadersByDifficulty = this.getLeadersByDifficulty.bind(this);
    this.getLeadersByCategory = this.getLeadersByCategory.bind(this);
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
          this.setState(
            {
              gameMode,
              results,
              question,
              stats: { gamesPlayed, correctAnswers }
            },
            () => this.getLeaders()
          );
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
        response_time: '20'
      })
    });
  }

  getLeadersByDifficulty() {
    console.log('getLeaders here');
    fetch('/response/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(el => {
          const easy = {};
          const medium = {};
          const hard = {};

          if (el.difficulty === 'easy') {
            easy[el.username] = (easy[el.username] || 0) + 1;
          }
          if (el.difficulty === 'medium') {
            medium[el.username] = (medium[el.username] || 0) + 1;
          }
          if (el.difficulty === 'hard') {
            hard[el.username] = (hard[el.username] || 0) + 1;
          }
          return easy, medium, hard;
        });
        const easyLeader = Object.keys(easy).reduce((a, b) =>
          easy[a] > easy[b] ? a : b
        );
        const mediumLeader = Object.keys(easy).reduce((a, b) =>
          medium[a] > medium[b] ? a : b
        );
        const hardLeader = Object.keys(easy).reduce((a, b) =>
          hard[a] > hard[b] ? a : b
        );
        return easyLeader, mediumLeader, hardLeader;
      })
      .catch(err => console.log(err));
  }

  getLeadersByCategory() {
    fetch('/response/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(el => {
          let GeneralKnowlegde = {};
          let EntertainmentBooks = {};
          let EntertainmentFilm = {};
          let EntertainmentMusic = {};
          let EntertainmentMusicals = {};
          let EntertainmentTelevision = {};
          let EntertainmentVideoGames = {};
          let EntertainmentBoardGames = {};
          let ScienceNature = {};
          let ScienceComputers = {};
          let ScienceMathematics = {};
          let Mythology = {};
          let Sports = {};
          let Geography = {};
          let History = {};
          let Politics = {};
          let Art = {};
          let Celebrities = {};
          let Animals = {};
          let Vehicles = {};
          let EntertainmentComics = {};
          let ScienceGadgets = {};
          let EntertainmentAnime = {};
          let EntertainmentCartoon = {};

          if (el.category === 'General Knowlegde') {
            GeneralKnowlegde[el.username] =
              (GeneralKnowlegde[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Books') {
            EntertainmentBooks[el.username] =
              (EntertainmentBooks[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Film') {
            EntertainmentFilm[el.username] =
              (EntertainmentFilm[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Music') {
            EntertainmentMusic[el.username] =
              (EntertainmentMusic[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Musicals & Theatres') {
            EntertainmentMusicals[el.username] =
              (EntertainmentMusicals[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Television') {
            EntertainmentTelevision[el.username] =
              (EntertainmentTelevision[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Video Games') {
            EntertainmentVideoGames[el.username] =
              (EntertainmentVideoGames[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Board Games') {
            EntertainmentBoardGames[el.username] =
              (EntertainmentBoardGames[el.username] || 0) + 1;
          }
          if (el.category === 'Science & Nature') {
            ScienceNature[el.username] = (ScienceNature[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Computers') {
            ScienceComputers[el.username] =
              (ScienceComputers[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Mathematics') {
            ScienceMathematics[el.username] =
              (ScienceMathematics[el.username] || 0) + 1;
          }
          if (el.category === 'Mythology') {
            Mythology[el.username] = (Mythology[el.username] || 0) + 1;
          }
          if (el.category === 'Sports') {
            Sports[el.username] = (Sports[el.username] || 0) + 1;
          }
          if (el.category === 'Geography') {
            Geography[el.username] = (Geography[el.username] || 0) + 1;
          }
          if (el.category === 'History') {
            History[el.username] = (History[el.username] || 0) + 1;
          }
          if (el.category === 'Politics') {
            Politics[el.username] = (Politics[el.username] || 0) + 1;
          }
          if (el.category === 'Art') {
            Art[el.username] = (Art[el.username] || 0) + 1;
          }
          if (el.category === 'Celebrities') {
            Celebrities[el.username] = (Celebrities[el.username] || 0) + 1;
          }
          if (el.category === 'Animals') {
            Animals[el.username] = (Animals[el.username] || 0) + 1;
          }
          if (el.category === 'Vehicles') {
            Vehicles[el.username] = (Vehicles[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Comics') {
            EntertainmentComics[el.username] =
              (EntertainmentComics[el.username] || 0) + 1;
          }
          if (el.category === 'Science: Gadgets') {
            ScienceGadgets[el.username] =
              (ScienceGadgets[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Japanese Anime & Manga') {
            EntertainmentAnime[el.username] =
              (EntertainmentAnime[el.username] || 0) + 1;
          }
          if (el.category === 'Entertainment: Cartoon & Animations') {
            EntertainmentCartoon[el.username] =
              (EntertainmentCartoon[el.username] || 0) + 1;
          }
          return (
            GeneralKnowlegde,
            EntertainmentBooks,
            EntertainmentFilm,
            EntertainmentMusic,
            EntertainmentMusicals,
            EntertainmentTelevision,
            EntertainmentVideoGames,
            EntertainmentBoardGames,
            ScienceNature,
            ScienceComputers,
            ScienceMathematics,
            Mythology,
            Sports,
            Geography,
            History,
            Politics,
            Art,
            Celebrities,
            Animals,
            Vehicles,
            EntertainmentComics,
            ScienceGadgets,
            EntertainmentAnime,
            EntertainmentCartoon
          );
        });
        const GeneralKnowlegdeLeader = Object.keys(
          GeneralKnowlegde
        ).reduce((a, b) => (GeneralKnowlegde[a] > GeneralKnowlegde[b] ? a : b));
        const EntertainmentBooksLeader = Object.keys(
          EntertainmentBooks
        ).reduce((a, b) =>
          EntertainmentBooks[a] > EntertainmentBooks[b] ? a : b
        );
        const EntertainmentFilmLeader = Object.keys(
          EntertainmentFilm
        ).reduce((a, b) =>
          EntertainmentFilm[a] > EntertainmentFilm[b] ? a : b
        );
        const EntertainmentMusicLeader = Object.keys(
          EntertainmentMusic
        ).reduce((a, b) =>
          EntertainmentMusic[a] > EntertainmentMusic[b] ? a : b
        );
        const EntertainmentMusicalsLeader = Object.keys(
          EntertainmentMusicals
        ).reduce((a, b) =>
          EntertainmentMusicals[a] > EntertainmentMusicals[b] ? a : b
        );
        const EntertainmentTelevisionLeader = Object.keys(
          EntertainmentTelevision
        ).reduce((a, b) =>
          EntertainmentTelevision[a] > EntertainmentTelevision[b] ? a : b
        );
        const EntertainmentVideoGamesLeader = Object.keys(
          EntertainmentVideoGames
        ).reduce((a, b) =>
          EntertainmentVideoGames[a] > EntertainmentVideoGames[b] ? a : b
        );
        const EntertainmentBoardGamesLeader = Object.keys(
          EntertainmentBoardGames
        ).reduce((a, b) =>
          EntertainmentBoardGames[a] > EntertainmentBoardGames[b] ? a : b
        );
        const ScienceNatureLeader = Object.keys(ScienceNature).reduce((a, b) =>
          ScienceNature[a] > ScienceNature[b] ? a : b
        );
        const ScienceComputersLeader = Object.keys(
          ScienceComputers
        ).reduce((a, b) => (ScienceComputers[a] > ScienceComputers[b] ? a : b));
        const ScienceMathematicsLeader = Object.keys(
          ScienceMathematics
        ).reduce((a, b) =>
          ScienceMathematics[a] > ScienceMathematics[b] ? a : b
        );
        const MythologyLeader = Object.keys(Mythology).reduce((a, b) =>
          Mythology[a] > Mythology[b] ? a : b
        );
        const SportsLeader = Object.keys(Sports).reduce((a, b) =>
          Sports[a] > Sports[b] ? a : b
        );
        const GeographyLeader = Object.keys(Geography).reduce((a, b) =>
          Geography[a] > Geography[b] ? a : b
        );
        const HistoryLeader = Object.keys(History).reduce((a, b) =>
          History[a] > History[b] ? a : b
        );
        const PoliticsLeader = Object.keys(Politics).reduce((a, b) =>
          Politics[a] > Politics[b] ? a : b
        );
        const ArtLeader = Object.keys(Art).reduce((a, b) =>
          Art[a] > Art[b] ? a : b
        );
        const CelebritiesLeader = Object.keys(Celebrities).reduce((a, b) =>
          Celebrities[a] > Celebrities[b] ? a : b
        );
        const AnimalsLeader = Object.keys(Animals).reduce((a, b) =>
          Animals[a] > Animals[b] ? a : b
        );
        const VehiclesLeader = Object.keys(Vehicles).reduce((a, b) =>
          Vehicles[a] > Vehicles[b] ? a : b
        );
        const EntertainmentComicsLeader = Object.keys(
          EntertainmentComics
        ).reduce((a, b) =>
          EntertainmentComics[a] > EntertainmentComics[b] ? a : b
        );
        const ScienceGadgetsLeader = Object.keys(
          ScienceGadgets
        ).reduce((a, b) => (ScienceGadgets[a] > ScienceGadgets[b] ? a : b));
        const EntertainmentAnimeLeader = Object.keys(
          EntertainmentAnime
        ).reduce((a, b) =>
          EntertainmentAnime[a] > EntertainmentAnime[b] ? a : b
        );
        const EntertainmentCartoonLeader = Object.keys(
          EntertainmentCartoon
        ).reduce((a, b) =>
          EntertainmentCartoon[a] > EntertainmentCartoon[b] ? a : b
        );
        return (
          GeneralKnowlegdeLeader,
          EntertainmentBooksLeader,
          EntertainmentFilmLeader,
          EntertainmentMusicLeader,
          EntertainmentMusicalsLeader,
          EntertainmentTelevisionLeader,
          EntertainmentVideoGamesLeader,
          EntertainmentBoardGamesLeader,
          ScienceNatureLeader,
          ScienceComputersLeader,
          ScienceMathematicsLeader,
          MythologyLeader,
          SportsLeader,
          GeographyLeader,
          HistoryLeader,
          PoliticsLeader,
          ArtLeader,
          CelebritiesLeader,
          AnimalsLeader,
          VehiclesLeader,
          EntertainmentComicsLeader,
          ScienceGadgetsLeader,
          EntertainmentAnimeLeader,
          EntertainmentCartoonLeader
        );
      })
      .catch(err => {
        console.log('error in getLeaders APP.jsx', err);
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
