const {
    selectTopics
  } = require("../models/topics.models");

  const endpoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics });
      });
}

exports.getEndpoints = (req, res, next) => {
      res.status(200).send({ endpoints });
    }