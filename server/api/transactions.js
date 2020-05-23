const router = require('express').Router()
const {Transaction} = require('../db/models')
module.exports = router

router.post('/', async (req, res, next) => {
  console.log(req.body)
  try {
    const response = await Transaction.create({
      ticker: req.body.ticker,
      quantity: Number(req.body.quantity),
      purchasePrice: Number(req.body.purchasePrice),
      userId: req.user.id
    })
    res.send(response)
  } catch (err) {
    next(err)
  }
})
