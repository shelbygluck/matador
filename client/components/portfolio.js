import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {purchase} from '../store'
/**
 * COMPONENT
 */

export const Portfolio = props => {
  const {email, balance, handleSubmit} = props

  return (
    <div>
      <h3>
        Portfolio for {email}, balance is {balance}
      </h3>

      <form id="stock-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ticker">
            <small>Ticker</small>
          </label>
          <input name="ticker" type="text" />
        </div>
        <div>
          <label htmlFor="quantity">
            <small>Quantity</small>
          </label>
          <input name="quantity" type="number" />
        </div>
        <div>
          <label htmlFor="email">
            <input id="invisible" name="email" type="string" value={email} />
          </label>
        </div>
        <div>
          <button type="submit">Purchase</button>
        </div>
      </form>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    balance: state.user.balance
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const email = evt.target.email.value
      const ticker = evt.target.ticker.value
      const quantity = Number(evt.target.quantity.value)
      console.log(ticker, quantity, email)
      dispatch(purchase(ticker, quantity, email))
    }
  }
}

export default connect(mapState, mapDispatch)(Portfolio)

/**
 * PROP TYPES
 */
Portfolio.propTypes = {
  email: PropTypes.string
}
