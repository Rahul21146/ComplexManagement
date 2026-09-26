// Central export so the rest of the app can do:
//   const { User, Complex, Tenant, ... } = require('./models');
module.exports = {
  User: require('./User'),
  Complex: require('./Complex'),
  Floor: require('./Floor'),
  Room: require('./Room'),
  Tenant: require('./Tenant'),
  Tenancy: require('./Tenancy'),
  RentPayment: require('./RentPayment'),
  MeterReading: require('./MeterReading'),
  ElectricityReading: require('./MeterReading'),
  MaintenanceCharge: require('./MaintenanceCharge'),
  Expense: require('./Expense'),
  Notice: require('./Notice'),
  Complaint: require('./Complaint'),
  Visitor: require('./Visitor'),
  Document: require('./Document'),
};
