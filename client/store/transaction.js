/* eslint-disable no-alert */
import axios from 'axios'

const ADD_TRANSACTION = 'ADD_TRANSACTION'
const GET_TRANSACTIONS = 'GET_TRANSACTIONS'

const initialState = []

const addedTransaction = transactionInfo => ({
  type: ADD_TRANSACTION,
  transactionInfo
})

const getMyTransactions = transactions => ({
  type: GET_TRANSACTIONS,
  transactions
})

export const addTransaction = transactionInfo => async dispatch => {
  let newTransaction
  try {
    newTransaction = await axios.post('/api/transaction', transactionInfo)
    dispatch(addedTransaction(newTransaction.data))
  } catch (err) {
    console.log(err)
  }
}

export const gettingTransactions = email => async dispatch => {
  try {
    let res = await axios.get(`/api/transaction/${email}`)
    dispatch(getMyTransactions(res.data))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return [...state, action.transactionInfo]
    case GET_TRANSACTIONS:
      return action.transactions
    default:
      return state
  }
}
