const authService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json({ error: 'Validation failed', details: error.details });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

exports.signin = async (req, res) => {
  try {
    const token = await authService.signin(req.body);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
