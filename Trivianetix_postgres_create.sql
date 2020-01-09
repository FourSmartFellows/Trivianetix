CREATE TABLE "users"
(
  "_id" serial NOT NULL,
  "username" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "age" integer NOT NULL,
  "state" varchar(255) NOT NULL,
  "education" varchar(255) NOT NULL,
  "games_played" integer NOT NULL,
  "correct_answers" integer NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("_id")
)
WITH (
  OIDS=FALSE
);



CREATE TABLE "users"
(
  "_id" serial NOT NULL,
  "username" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "age" integer NOT NULL,
  "state" varchar(255) NOT NULL,
  "education" varchar(255) NOT NULL,
  "games_played" integer NOT NULL,
  "correct_answers" integer NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("_id")
)
WITH (
  OIDS=FALSE
);


CREATE TABLE "response"
(
  "response_id" serial NOT NULL,
  "category" varchar(255) NOT NULL,
  "difficulty" varchar(255) NOT NULL,
  "is_correct" varchar(255) NOT NULL,
  "actual_answer" varchar(255) NOT NULL,
  "chosen_answer" varchar(255) NOT NULL,
  "users_id" integer NOT NULL,
  "question" varchar(500) NOT NULL,
  "current_time" varchar(255) NOT NULL,
  "response_time" varchar(255) NOT NULL,
  CONSTRAINT "response_pk" PRIMARY KEY ("response_id")
)
WITH (
  OIDS=FALSE
);




ALTER TABLE "response" ADD CONSTRAINT "response_fk0" FOREIGN KEY ("users_id") REFERENCES "users"("_id");


