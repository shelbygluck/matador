/* eslint-disable no-alert */
import axios from 'axios'
import history from '../history'
import {addTransaction} from './transaction'

const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATE_BALANCE = 'UPDATE_BALANCE'

const defaultUser = {}

const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updateBalance = newBalance => ({type: UPDATE_BALANCE, newBalance})

export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }
  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const purchase = (ticker, quantity, email) => async dispatch => {
  let iexRes, currentPrice, totalPrice, user, balance, userId
  try {
    iexRes = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_9fe41c3d9b9a42ddaf552dbfdfbbbff0`
    )
    currentPrice = iexRes.data.latestPrice
    totalPrice = currentPrice * quantity
  } catch (err) {
    console.log(err)
    window.alert(`${ticker} is not a valid ticker symbol`)
    return
  }

  try {
    user = await axios.get(`/api/users/${email}`)
    userId = user.data[0].id
    balance = user.data[0].balance
  } catch (err) {
    console.log(err)
  }

  if (balance < totalPrice) {
    window.alert(
      `$${balance} balance is insufficient for a $${totalPrice} purchase`
    )
    return
  }
  try {
    let newBalance = balance - totalPrice
    user = await axios.post(`/api/users/${email}`, {newBalance: newBalance})
    dispatch(updateBalance(user.data))
  } catch (err) {
    console.log(err)
  }

  let transactionInfo = {
    ticker: ticker,
    quantity: quantity,
    purchasePrice: currentPrice,
    userId: userId
  }
  dispatch(addTransaction(transactionInfo))
  window.alert(
    `Your purchase of ${quantity} shares of ${ticker} was successful! Check out your new stocks in your portfolio.`
  )
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case UPDATE_BALANCE:
      return Object.assign({}, state, {balance: action.newBalance})
    default:
      return state
  }
}
