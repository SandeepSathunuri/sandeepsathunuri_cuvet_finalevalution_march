const express = require('express');
const router = express.Router();
const Quiz = require('../schema/testSchema');
const Question = require('../schema/querySchema');
const Option = require('../schema/testSchema');
const jwt = require('jsonwebtoken');

router.post('/quizzes', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded._id;

    const { name, questionType } = req.body;

    const newQuiz = new Quiz({
      userId,
      name,
      questionType,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/quizzes/:userId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.params.userId }).populate('questions');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/quizzes/:quizId', async (req, res) => {
  try {
    const { name } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { name },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes/:quizId/questions', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { type, text, options } = req.body;

    let parsedOptions = Array.isArray(options) ? options : JSON.parse(options);

    const quiz = await Quiz.findOne({ _id: quizId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or you do not have permission.' });
    }

    if (quiz.questions.length >= 5) {
      return res.status(400).json({ message: 'Cannot add more than 5 questions to a quiz.' });
    }

    const question = new Question({
      quizId,
      type,
      text,
    });

    const savedQuestion = await question.save();

    if (Array.isArray(parsedOptions) && parsedOptions.length) {
      const optionPromises = parsedOptions.map(optionData => {
        const option = new Option({
          questionId: savedQuestion._id,
          ...optionData,
        });
        return option.save();
      });
      const savedOptions = await Promise.all(optionPromises);

      savedQuestion.options = savedOptions.map(option => option._id);
      await savedQuestion.save();
    }

    quiz.questions.push(savedQuestion._id);
    await quiz.save();

    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/quizzes/:quizId/questions/:questionId', async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const quiz = await Quiz.findOne({ _id: quizId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or you do not have permission.' });
    }

    const question = await Question.findOneAndDelete({ _id: questionId });
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    quiz.questions = quiz.questions.filter(id => id.toString() !== questionId);
    await quiz.save();

    await Option.deleteMany({ questionId });

    res.status(200).json({ message: 'Question deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
