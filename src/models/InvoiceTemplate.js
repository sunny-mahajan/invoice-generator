import mongoose from 'mongoose';

const InvoiceTemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  previewUrl: { type: String }, // Link to a preview image or page
});

export default mongoose.models.InvoiceTemplate ||
  mongoose.model('InvoiceTemplate', InvoiceTemplateSchema);
