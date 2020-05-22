import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

// `https://cloud.iexapis.com/stable/      endpoint       ?token=${iexKey}       &query=string`

// https://cloud.iexapis.com/stable/stock/XOM/quote?token=YOUR_TOKEN_HERE
// this gets current stock price of exxon (XOM)

/**
 * COMPONENT
 */
export const Transactions = props => {
  const {email} = props

  return (
    <div>
      {console.log(props)}
      <h3>Transactions for {email}</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(Transactions)

/**
 * PROP TYPES
 */
Transactions.propTypes = {
  email: PropTypes.string
}
