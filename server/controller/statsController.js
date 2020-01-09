const db = require('../data/userModel');
const fetch = require('node-fetch');

const statsController = {};

//LEADERBOARD: % correct over time (all time / week / month), by category/difficulty/age/education
//front end will send question just asked, actual response, correct response--is correct? insert to db

statsController.createResponse = (req, res, next) => {
  const {
    category,
    difficulty,
    is_correct,
    actual_answer,
    chosen_answer,
    username,
    question,
    current_time,
    response_time
  } = req.body;
  const text1 = `
          SELECT username, _id
          FROM users 
          WHERE username LIKE $1
      `;
  const text2 = `
          INSERT INTO response (category, difficulty, is_correct, actual_answer, chosen_answer, users_id, question, "current_time", response_time )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

  const values1 = [username];

  console.log('values array', values1);
  // const values = [username];
  db.query(text1, values1)
    .then(response => {
      if (response.rows[0]) {
        res.locals._id = response.rows[0]._id;
      } else console.log('No user found');
    })
    .then(() => {
      const values2 = [
        category,
        difficulty,
        is_correct,
        actual_answer,
        chosen_answer,
        res.locals._id,
        question,
        current_time,
        response_time
      ];
      db.query(text2, values2).catch(err =>
        console.log('Error in second query', err)
      );
      next();
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

statsController.leaderByCategory = (req, res, next) => {
  const { username, stats, category } = req.body;
  const percentage = Math.floor(
    (stats.correctAnswers / stats.gamesPlayed) * 100
  );
  //query
  next();
};

statsController.leaderByAge = (req, res, next) => {
  const { username, stats } = req.body;
  const percentage = Math.floor(
    (stats.correctAnswers / stats.gamesPlayed) * 100
  );
  //query
  next();
};

statsController.leaderByState = (req, res, next) => {
  const { username, stats } = req.body;
  const percentage = Math.floor(
    (stats.correctAnswers / stats.gamesPlayed) * 100
  );
  //query
  next();
};

statsController.leaderByEducation = (req, res, next) => {
  const { username, stats } = req.body;
  const percentage = Math.floor(
    (stats.correctAnswers / stats.gamesPlayed) * 100
  );
  //query
  next();
};

/*
  helpful query examples

  add column to table:
  alter table vendor_item
  add column "market_id" integer NOT NULL;

  insert data into multiple columns at once
  INSERT INTO business_hours (hours_day, hours_open, hours_close, market_hours_id)
  VALUES (0, '09:00', '14:00', 7);

  alter table vendor
  alter column "vendor_phone" set data type varchar(255);

  INSERT INTO vendor_item (vendor_item_price, vendor_item_details, vendor_id, item_id, date_id, market_id )
 VALUES ('1.25', 'The dilliest dalliest pickles you ever did eat.', '1', '1', '1', '1');
 
  INSERT INTO vendor (vendor_name, vendor_phone, vendor_website, vendor_email, vendor_bio)
 VALUES ('Boris Farms', '(555) 555-5555', 'http://www.borisfarmfun.com', 'boris@borisfarmfun.com', 'Boris loves to farm!');
 */

module.exports = statsController;
