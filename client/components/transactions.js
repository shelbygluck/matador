import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

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
