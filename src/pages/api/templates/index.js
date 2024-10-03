import { db } from '../../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const invoiceTemplatesCollection = collection(db, 'invoiceTemplates');

  try {
    const querySnapshot = await getDocs(invoiceTemplatesCollection);
    
    // Map over documents to extract data and include document ID if needed
    const templates = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Optionally include the document ID
      ...doc.data(),
    }));

    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching invoice templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
