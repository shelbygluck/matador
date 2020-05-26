/* eslint-disable no-unused-vars */
const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:email', async (req, res, next) => {
  try {
    let user = await User.findAll({
      where: {
        email: req.params.email
      }
    })
    res.send(user)
  } catch (err) {
    next(err)
  }
})

router.post('/:email', async (req, res, next) => {
  let numberOfAffectedRows, affectedRows
  let newBalance = Number(req.body.newBalance)
  try {
    ;[numberOfAffectedRows, affectedRows] = await User.update(
      {
        balance: newBalance
      },
      {
        where: {email: req.params.email},
        returning: true,
        plain: true
      }
    )
    res.send(affectedRows.dataValues.balance)
  } catch (err) {
    next(err)
  }
})
