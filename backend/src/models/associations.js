const User = require('./user.mysql');
const Lawyer = require('./lawyer.mysql');
const Case = require('./case.mysql');
const Hearing = require('./hearing.mysql');

const initAssociations = () => {
  // Lawyer - User
  Lawyer.belongsTo(User, { as: 'lawyerInfo', foreignKey: 'userId' });
  User.hasOne(Lawyer, { foreignKey: 'userId' });

  // Case - User (Prisoner)
  Case.belongsTo(User, { as: 'prisoner', foreignKey: 'prisonerId' });
  User.hasMany(Case, { foreignKey: 'prisonerId' });

  // Case - Lawyer
  Case.belongsTo(Lawyer, { as: 'lawyer', foreignKey: 'lawyerId' });
  Lawyer.hasMany(Case, { foreignKey: 'lawyerId' });

  // Case - Hearing
  Case.hasMany(Hearing, { as: 'hearings', foreignKey: 'caseId' });
  Hearing.belongsTo(Case, { foreignKey: 'caseId' });
};

module.exports = initAssociations;
