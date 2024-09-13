import dbConnect from '../../../lib/mongodb';
import InvoiceTemplate from '../../../models/InvoiceTemplate';

export default async function handler(req, res) {
  await dbConnect();

  const templates = await InvoiceTemplate.find({});
  res.status(200).json(templates);
}
