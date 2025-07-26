import mongoose from 'mongoose';

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  requiredSkills: [{ type: String }], // used to match with dev skills
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: {type: Date},
  relatedSkills: [{type: String}],
  helpfulNotes: {type: String}
}, 
{ timestamps: true });


module.exports = mongoose.model('Ticket', ticketSchema);
