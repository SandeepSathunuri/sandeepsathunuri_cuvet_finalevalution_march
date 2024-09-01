import React, { useState } from 'react';
import './Modal.css';

const QuestionModal = ({ isOpen, onClose, onCreateQuiz }) => {
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      optionType: 'Text',
      correctOption: null,
    },
  ]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  if (!isOpen) return null;

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value, fieldType) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].optionType === 'Text & Image URL') {
      updatedQuestions[questionIndex].options[optionIndex] = {
        ...updatedQuestions[questionIndex].options[optionIndex],
        [fieldType]: value,
      };
    } else {
      updatedQuestions[questionIndex].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].optionType = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        optionType: 'Text',
        correctOption: null,
      },
    ]);
    setActiveQuestionIndex(questions.length);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const handleTabClick = (index) => {
    setActiveQuestionIndex(index);
  };

  const handleOptionDoubleClick = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEnoughOptions = questions.every(
      (q) =>
        q.options.filter((opt) =>
          typeof opt === 'string' ? opt.trim() : opt.text.trim()
        ).length >= 2
    );
    if (!hasEnoughOptions) {
      alert('Please provide at least two options for each question.');
      return;
    }
    onCreateQuiz(questions);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="question-tabs">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-tab ${
                  activeQuestionIndex === index ? 'active' : ''
                }`}
                onClick={() => handleTabClick(index)}
              >
                <span className="question-number">{index + 1}</span>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                    className="delete-question-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {questions.length < 5 && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className="add-question-btn"
              >
                +
              </button>
            )}
            <span className="max-questions">Max 5 questions</span>
          </div>

          <div className="question-section">
            {questions.map(
              (q, questionIndex) =>
                activeQuestionIndex === questionIndex && (
                  <div key={questionIndex}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Poll Question"
                        value={q.question}
                        onChange={(e) =>
                          handleQuestionChange(questionIndex, e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="optionType">Option Type</label>
                      <select
                        id="optionType"
                        value={q.optionType}
                        onChange={(e) =>
                          handleOptionTypeChange(questionIndex, e.target.value)
                        }
                        required
                      >
                        <option value="Text">Text</option>
                        <option value="Image URL">Image URL</option>
                        <option value="Text & Image URL">
                          Text & Image URL
                        </option>
                      </select>
                    </div>

                    {q.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`form-group option ${
                          q.correctOption === optionIndex ? 'correct-option' : ''
                        }`}
                        onDoubleClick={() =>
                          handleOptionDoubleClick(questionIndex, optionIndex)
                        }
                      >
                        {q.optionType === 'Text & Image URL' ? (
                          <div className="side-by-side">
                            <input
                              type="text"
                              placeholder="Text"
                              value={option.text || ''}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value,
                                  'text'
                                )
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={option.imageUrl || ''}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value,
                                  'imageUrl'
                                )
                              }
                              required
                            />
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            required
                          />
                        )}
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteOption(questionIndex, optionIndex)
                            }
                            className="delete-option-btn"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Create Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
