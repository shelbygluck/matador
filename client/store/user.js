/* eslint-disable no-alert */
import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const PURCHASE = 'PURCHASE'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */
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
  let iexRes, currentPrice, totalPrice, user, balance
  try {
    iexRes = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_9fe41c3d9b9a42ddaf552dbfdfbbbff0`
    )
    currentPrice = iexRes.data.latestPrice
    totalPrice = currentPrice * quantity
  } catch (err) {
    console.log(err)
  }

  try {
    user = await axios.get(`/api/users/${email}`)
    balance = user.data[0].balance
    console.log(balance)
  } catch (err) {
    console.log(err)
  }

  if (balance < totalPrice) {
    window.alert('balance insufficient')
  } else {
    try {
      let newBalance = balance - totalPrice
      user = await axios.post(`/api/users/${email}`, {newBalance: newBalance})
      console.log(user.data)
    } catch (err) {
      console.log(err)
    }
  }
}

//if enough, add new transaction, delete total amount from balance
//if not enough, send back "Balance insufficient"

//create empty transactions table tied to user (ticker, quantity, purchasePrice)
//portfolio page will simply flatten transactions to combine repeats

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
