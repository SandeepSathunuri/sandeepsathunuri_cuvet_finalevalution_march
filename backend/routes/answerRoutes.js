const express = require('express');
const router = express.Router();
const Option = require('../schema/answerSchema');

router.put('/options/:optionId', async (req, res) => {
  try {
    const { optionId } = req.params;
    const { text, imageUrl, type } = req.body;

    const updatedOption = await Option.findByIdAndUpdate(
      optionId,
      { text, imageUrl, type },
      { new: true, runValidators: true }
    );

    if (!updatedOption) {
      return res.status(404).json({ message: 'Option not found' });
    }

    res.json(updatedOption);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
