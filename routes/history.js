const express = require('express')
const router = express.Router()
const { History, validateHistory } = require('../models/History')
const { HistoryType, validateType } = require('../models/HistoryType')
const pagination = require('../functions/pagination')

router.get('/', async (req, res) => {
  const itemCount = await History.count()
  const options = pagination(req.query, itemCount)
  const histories = await History.findAll({ ...options })
  return res.status(200).json({
    statusCode: 200,
    data: {
      histories,
      ...options
    }
  })
})

router.get('/types', async (req, res) => {
  const itemCount = await HistoryType.count()
  const options = pagination(req.query, itemCount)
  const types = await HistoryType.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options
  })
  return res.status(200).json({
    statusCode: 200,
    data: {
      types,
      ...options
    }
  })
})

router.post('/', [validateHistory], async (req, res) => {
  const history = await History.create(req.body)
  return res.status(200).json({ statusCode: 200, data: history })
})

router.post('/types', [validateType], async (req, res) => {
  const type = await HistoryType.create(req.body)
  return res.status(200).json({ statusCode: 200, data: type })
})

module.exports = router
