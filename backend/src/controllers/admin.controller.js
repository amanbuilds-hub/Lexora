const User = require('../models/user.mysql');
const Case = require('../models/case.mysql');
const Hearing = require('../models/hearing.mysql');
const Grievance = require('../models/grievance.mongo');
const { SkillProfile, EarningTransaction } = require('../models/earning.mongo');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// @desc    Get Admin Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    // 1. MySQL Aggregations
    const totalPrisoners = await User.count({ where: { role: 'prisoner' } });
    const casesByStatus = await Case.findAll({
      attributes: ['currentStatus', [Case.sequelize.fn('COUNT', 'id'), 'count']],
      group: ['currentStatus']
    });

    // 2. MongoDB Aggregations
    const totalEarnings = await EarningTransaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const grievanceStats = await Grievance.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const skillDistribution = await SkillProfile.aggregate([
      { $group: { _id: "$primarySkill", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPrisoners,
        casesByStatus,
        totalEarnings: totalEarnings[0]?.total || 0,
        grievanceStats,
        skillDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Earnings to CSV
exports.exportEarningsCSV = async (req, res) => {
  try {
    const earnings = await EarningTransaction.find().lean();
    const fields = ['_id', 'prisonerId', 'amount', 'timestamp', 'currentHash'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(earnings);

    res.header('Content-Type', 'text/csv');
    res.attachment('earnings_report.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Prison Report to PDF
exports.exportPrisonReportPDF = async (req, res) => {
  const doc = new PDFDocument();
  res.header('Content-Type', 'application/pdf');
  res.attachment('prison_status_report.pdf');
  doc.pipe(res);

  doc.fontSize(25).text('Lexora Prison Status Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Generated On: ${new Date().toLocaleString()}`);
  doc.moveDown();

  const totalPrisoners = await User.count({ where: { role: 'prisoner' } });
  doc.text(`Total Prisoners: ${totalPrisoners}`);
  
  const pendingGrievances = await Grievance.countDocuments({ status: 'Pending' });
  doc.text(`Pending Grievances: ${pendingGrievances}`);

  doc.end();
};
