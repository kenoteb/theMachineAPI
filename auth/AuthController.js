const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const VerifyToken = require('./VerifyToken');
const User = require('../model/user/User');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  },
    function (err, user) {
      if (err) return res.status(500).send('There was a problem registering the user.');
      // create a token
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    });
});

router.get('/me', VerifyToken, function (req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send('There was a problem finding the user.');
    if (!user) return res.status(404).send('No user found.');

    res.status(200).send(user);
  });
});

router.post('/login', function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/logout', function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
