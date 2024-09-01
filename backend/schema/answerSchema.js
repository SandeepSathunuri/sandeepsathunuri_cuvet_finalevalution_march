const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'text and image'],
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return this.type === 'text' || this.type === 'text and image';
      },
    },
    imageUrl: {
      type: String,
      required: function () {
        return this.type === 'image' || this.type === 'text and image';
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Option', answerSchema);
