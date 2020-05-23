import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {purchase} from '../store'
import {gettingTransactions} from '../store/transaction'

/**
 * COMPONENT
 */

export class Portfolio extends Component {
  constructor() {
    super()
    this.state = {
      portfolioLoaded: false
    }
  }

  async componentDidMount() {
    await this.props.getTransactions(this.props.email)
    this.setState({
      portfolioLoaded: true
    })
  }

  render() {
    return (
      <div>
        {console.log(this.props.balance)}
        <h3>
          Portfolio for {this.props.email}, balance is {this.props.balance}
        </h3>
        <div className="portfolioContainer">
          <div id="transactionTable">
            {this.state.portfolioLoaded ? (
              this.props.transactions.map(transaction => {
                return (
                  <div key="transaction.id" className="transactionSegment">
                    <div className="transactionRow">
                      <h3>{transaction.ticker}</h3>
                      <h3 className="separator">|</h3>
                      <h3>
                        {transaction.quantity} shares @ ${
                          transaction.purchasePrice
                        }
                      </h3>
                    </div>
                    <h3 className="separator">
                      __________________________________
                    </h3>
                  </div>
                )
              })
            ) : (
              <div>loading portfolio</div>
            )}
          </div>

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
    balance: state.user.balance,
    transactions: state.transaction
  }
}

const mapDispatch = dispatch => ({
  getTransactions: email => dispatch(gettingTransactions(email)),

  handleSubmit(evt) {
    evt.preventDefault()
    const email = evt.target.email.value
    const ticker = evt.target.ticker.value
    const quantity = Number(evt.target.quantity.value)
    console.log(ticker, quantity, email)
    dispatch(purchase(ticker, quantity, email))
  }
})

export default connect(mapState, mapDispatch)(Portfolio)

/**
 * PROP TYPES
 */
Portfolio.propTypes = {
  email: PropTypes.string
}
