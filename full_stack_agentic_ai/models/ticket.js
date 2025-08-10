import mongoose from 'mongoose';


const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , default: null},
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  deadline: Date,
  createdAt: {type: Date, default: Date.now },
  relatedSkills: [{type: String}],
  helpfulNotes: {type: String}
}, 
{ timestamps: true });


const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;