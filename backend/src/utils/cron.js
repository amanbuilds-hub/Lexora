const cron = require('node-cron');
const Case = require('../models/case.mongo');

const initCronJobs = () => {
  // Run every 24 hours at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🤖 Running AI Case Auditor...');
    
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Find cases pending for > 6 months
      const delayedCases = await Case.find({
        arrestDate: { $lt: sixMonthsAgo },
        currentStatus: { $nin: ['Bail Granted', 'Acquitted', 'Convicted', 'Closed'] },
        isPendingFlagged: false
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
