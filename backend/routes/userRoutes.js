const express = require('express');
const router = express.Router();
const User = require('../schema/accountSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

router.get('/', (req, res) => {
  res.send('login page');
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hash = bcrypt.hashSync(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hash,
    });

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(201).json({
      email: user.email,
      token,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({
      email: user.email,
      token,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
