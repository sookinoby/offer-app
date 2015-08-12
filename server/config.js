module.exports = {
  db: process.env.db || 'localhost',
  db_name: "test_offers",
  tokenSecret: process.env.tokenSecret || 'pick a hard to guess string'

};