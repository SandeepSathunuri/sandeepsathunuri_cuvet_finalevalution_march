import React, { useState } from 'react';
import './Modal.css'; // Ensure you have appropriate styles for the modal
import QuestionModal from './QuestionModal';

const QuizModal = ({ isOpen, onClose, onCreateQuiz }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('MCQ');
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quizName.trim() === '') {
      alert('Quiz name is required');
      return;
    }
    onCreateQuiz({ name: quizName, type: quizType });
    setShowQuestionModal(true); // Show the question modal after quiz creation
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Create Quiz</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="quizName">Quiz Name</label>
              <input
                type="text"
                id="quizName"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quizType">Quiz Type</label>
              <select
                id="quizType"
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                required
              >
                <option value="MCQ">MCQ</option>
                <option value="Poll">Poll</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="submit" className="continue-btn">
                Continue
              </button>
              <button type="button" onClick={() => {
                onClose();
                setQuizName('');
                setQuizType('MCQ');
              }} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {showQuestionModal && (
        <QuestionModal
          isOpen={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          onCreateQuiz={(questions) => {
            console.log('Questions:', questions);
            onClose(); // Close everything after saving
            setShowQuestionModal(false); // Ensure the question modal is also closed
          }}
        />
      )}
    </>
  );
};

export default QuizModal;
