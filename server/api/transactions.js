const router = require('express').Router()
const {User, Transaction} = require('../db/models')
module.exports = router

router.get('/:email', async (req, res, next) => {
  try {
    let user = await User.findAll({
      where: {
        email: req.params.email
      }
    })
    let userId = user[0].dataValues.id
    let transactions = await Transaction.findAll({
      where: {
        userId: userId
      }
    })
    console.log(transactions)
    res.send(transactions)
  } catch (err) {
    console.log(err)
  }
})

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
