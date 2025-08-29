const History = require('../models/History');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 🧾 Add treatment record (doctor)
exports.addHistory = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes } = req.body;
    const doctorId = req.user.userId;

    const reportFiles = req.files?.map(file => file.path) || [];

    const history = new History({
      patientId, doctorId, diagnosis, prescription, notes, reports: reportFiles
    });

    await history.save();
    res.status(201).json({ message: "History added", history });
  } catch (err) {
    res.status(500).json({ message: "Error adding history" });
  }
};

// 📄 Get patient history (doctor or patient)
exports.getHistory = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const history = await History.find({ patientId })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// 📥 Generate Prescription PDF
exports.generatePDF = async (req, res) => {
  try {
    const history = await History.findById(req.params.id).populate('doctorId patientId');

    if (!history) return res.status(404).json({ message: "Not found" });

    const doc = new PDFDocument();
    const fileName = `Prescription-${history._id}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Prescription", { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Doctor: ${history.doctorId.name}`);
    doc.text(`Patient: ${history.patientId.name}`);
    doc.text(`Date: ${new Date(history.date).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Diagnosis: ${history.diagnosis}`);
    doc.text(`Prescription: ${history.prescription}`);
    doc.text(`Notes: ${history.notes}`);
    
    doc.end();

    res.download(filePath, fileName);
  } catch (err) {
    res.status(500).json({ message: "Error generating PDF" });
  }
};
