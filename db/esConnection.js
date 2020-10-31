var elasticsearch = require("elasticsearch");

var client = new elasticsearch.Client({
  hosts: [process.env.BONSAI_URL]
});

module.exports = client;