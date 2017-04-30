/**
 * Created by zealot on 17/4/17.
 */
const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')
const { apiPrefix } = config

module.exports = {

  [`POST ${apiPrefix}/dataOperation/upload`] (req, res) {
    res.json({ success: 'test'})
  }
}
