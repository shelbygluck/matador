const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
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
  let newBalance = Number(req.body.newBalance)
  try {
    let [numberOfAffectedRows, affectedRows] = await User.update(
      {
        balance: newBalance
      },
      {
        where: {email: req.params.email},
        returning: true,
        plain: true
      }
    )

    console.log(numberOfAffectedRows)
    console.log(affectedRows)
  } catch (err) {
    next(err)
  }
  res.send('went through post route!!!')
})
