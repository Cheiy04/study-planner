const express = require('express');
const pdf = require('pdfkit');
const fs = require('fs');
const router = express.Router();

// POST endpoint to generate PDF report
router.post('/generate', async (req, res) => {
    const { progressData } = req.body;
    if (!progressData) {
        return res.status(400).json({ error: 'Progress data is required.' });
    }

    const doc = new pdf();
    const filePath = `report_${Date.now()}.pdf`;  
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text('Progress Report', { align: 'center' });
    doc.fontSize(16).text(`Progress Data: ${progressData}`);
    doc.end();

    // Simulate async operation
    setTimeout(() => {
        res.status(201).json({ message: 'PDF generated successfully.', filePath });
    }, 1000);
});

// GET endpoint to download PDF
router.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = `./${fileName}`;
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send({ error: 'File not found.' });
        }
    });
});

module.exports = router;