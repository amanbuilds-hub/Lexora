const cron = require('node-cron');
const { Op } = require('sequelize');
const Case = require('../models/case.mysql');

const initCronJobs = () => {
  // Run every 24 hours at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🤖 Running AI Case Auditor...');
    
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Find cases pending for > 6 months
      const delayedCases = await Case.findAll({
        where: {
          arrestDate: {
            [Op.lt]: sixMonthsAgo
          },
          currentStatus: {
            [Op.notIn]: ['Bail Granted', 'Acquitted', 'Convicted', 'Closed']
          },
          isPendingFlagged: false
        }
      });

      for (const caseData of delayedCases) {
        caseData.isPendingFlagged = true;
        caseData.aiAlertMessage = `AI Alert: This case has been pending for over 6 months since arrest (${caseData.arrestDate.toDateString()}). Immediate legal intervention recommended.`;
        await caseData.save();
        console.log(`🚩 Flagged Case: ${caseData.caseNumber}`);
      }

    } catch (error) {
      console.error('❌ AI Auditor Error:', error.message);
    }
  });
};

module.exports = initCronJobs;
