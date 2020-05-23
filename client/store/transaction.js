/* eslint-disable no-alert */
import axios from 'axios'

/**
 * ACTION TYPES
 */
const ADD_TRANSACTION = 'ADD_TRANSACTION'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */
const addedTransaction = transactionInfo => ({
  type: ADD_TRANSACTION,
  transactionInfo
})
/**
 * THUNK CREATORS
 */

export const addTransaction = transactionInfo => async dispatch => {
  let newTransaction
  try {
    newTransaction = await axios.post('/api/transaction', transactionInfo)
    dispatch(addedTransaction(newTransaction.data))
  } catch (err) {
    console.log(err)
  }
}
/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return [...state, action.transactionInfo]
    default:
      return state
  }
}
