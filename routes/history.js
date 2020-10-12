const express = require('express')
const router = express.Router()
const { History, validateHistory } = require('../models/History')
const { HistoryType, validateType } = require('../models/HistoryType')

router.get('/', async (req, res) => {
  const histories = await History.findAll()
  return res.json({
    statusCode: 200,
    data: histories
  })
})

router.get('/types', async (req, res) => {
  const types = await HistoryType.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({
    statusCode: 200,
    data: types
  })
})

router.post('/', [validateHistory], async (req, res) => {
  const history = await History.create(req.body)
  return res.json({ statusCode: 200, data: history })
})

router.post('/types', [validateType], async (req, res) => {
  const type = await HistoryType.create(req.body)
  return res.json({ statusCode: 200, data: type })
})

module.exports = router