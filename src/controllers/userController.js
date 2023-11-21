const userService = require('../services/userService');

exports.getProfile = async (req, res) => {
  try {
    const userProfile = await userService.getProfile(req.user.id);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
