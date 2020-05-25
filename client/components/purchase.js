/* eslint-disable react/no-access-state-in-setstate */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {purchase} from '../store'

/**
 * COMPONENT
 */

export class Purchase extends Component {
  render() {
    return (
      <div>
        <h3>Balance is {this.props.balance}</h3>
        <form id="stock-form" onSubmit={this.props.handleSubmit}>
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
              <input
                id="invisible"
                name="email"
                type="string"
                value={this.props.email}
              />
            </label>
          </div>
          <div>
            <button type="submit">Purchase</button>
          </div>
        </form>
      </div>
    )
  }
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

const mapDispatch = dispatch => ({
  handleSubmit(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    let ticker = evt.target.ticker.value
    const quantity = Number(evt.target.quantity.value)
    dispatch(purchase(ticker, quantity, email))
    ticker = ticker.toUpperCase()
    // eslint-disable-next-line no-alert
    window.alert(
      `Your purchase of ${quantity} shares of ${ticker} was successful! Check out your new stocks in your portfolio.`
    )
  }
})

export default connect(mapState, mapDispatch)(Purchase)
