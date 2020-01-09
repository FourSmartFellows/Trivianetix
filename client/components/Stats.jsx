import React, { Component } from 'react';

class Stats extends Component {
  render() {
    const questionsPosed = this.props.stats.gamesPlayed * 10;
    const questionsRight = this.props.stats.correctAnswers;
    const percentageRight = questionsPosed
      ? Math.floor((questionsRight / questionsPosed) * 100)
      : `You haven't played yet!`;
    let gameMode = this.props.gameMode;
    let scoreBoard = <p>Your All-Time Score: {percentageRight}%</p>;

    return <div className="scoreboard">{scoreBoard}</div>;
  }
}

export default Stats;

/*
{
  "response_code":0,
  "results":[
    {"category":"General Knowledge",
    "type":"multiple",
    "difficulty":"easy",
    "question":"What is the first book of the Old Testament?",
    "correct_answer":"Genesis",
    "incorrect_answers":["Exodus","Leviticus","Numbers"]
}
*/
