require("dotenv").config();

exports.host = process.env.DATA_HOST;
exports.port = process.env.DATA_PORT;
exports.user = process.env.DATA_USER;
exports.password = process.env.DATA_PASSWORD;
