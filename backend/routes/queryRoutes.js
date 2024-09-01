const express = require('express');
const router = express.Router();
const Question = require('../schema/querySchema');
const Option = require('../schema/answerSchema');

// Create a new question for a quiz
// Route to create a question for a specific quiz
router.post('/quizzes/:quizId/questions', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded._id;

    const { quizId } = req.params;
    const { type, text, options } = req.body;

    // Verify the quiz belongs to the authenticated user
    const quiz = await Quiz.findOne({ _id: quizId, userId });
    if (!quiz) {
      return res
        .status(404)
        .json({ message: 'Quiz not found or you do not have permission.' });
    }

    // Check if the quiz already has 5 questions
    if (quiz.questions.length >= 5) {
      return res
        .status(400)
        .json({ message: 'You can only add up to 5 questions.' });
    }

    // Create new question
    const question = new Question({
      quizId,
      type,
      text,
    });

    const savedQuestion = await question.save();

    if (options && options.length) {
      const optionPromises = options.map(async (optionData) => {
        const option = new Option({
          questionId: savedQuestion._id,
          ...optionData,
        });
        return await option.save();
      });
      const savedOptions = await Promise.all(optionPromises);

      savedQuestion.options = savedOptions.map((option) => option._id);
      await savedQuestion.save();
    }

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all questions for a quiz
router.get('/questions/:quizId', async (req, res) => {
  try {
    const questions = await Question.find({
      quizId: req.params.quizId,
    }).populate('options');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a question
router.put('/questions/:questionId', async (req, res) => {
  try {
    const { text, options } = req.body;
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      { text },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (options && options.length > 0) {
      // Update existing options or add new ones
      const optionIds = await Promise.all(
        options.map(async (optionData) => {
          let option;
          if (optionData._id) {
            option = await Option.findByIdAndUpdate(
              optionData._id,
              optionData,
              { new: true }
            );
          } else {
            option = new Option({ ...optionData, questionId: question._id });
            await option.save();
          }
          return option._id;
        })
      );
      question.options = optionIds;
      await question.save();
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a question
router.delete('/questions/:questionId', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
