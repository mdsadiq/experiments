const postgres = require('postgres');
const sql = postgres("postgresql://postgres:Blue%40123@localhost:5432/experiments")

module.exports = { sql };