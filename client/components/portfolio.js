import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {purchase} from '../store'
import {gettingTransactions} from '../store/transaction'
import axios from 'axios'

/**
 * COMPONENT
 */

export class Portfolio extends Component {
  constructor() {
    super()
    this.state = {
      portfolioLoaded: false,
      portfolio: []
    }
    this.fillLatestStockValue = this.fillLatestStockValue.bind(this)
  }

  async componentDidMount() {
    await this.props.getTransactions(this.props.email)

    let transactions = this.props.transactions
    let noRepeatTickers = {}
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i]
      if (noRepeatTickers[transaction.ticker]) {
        let newQuantity =
          noRepeatTickers[transaction.ticker][0] + transaction.quantity
        let latestValue = await this.fillLatestStockValue(transaction.ticker)
        noRepeatTickers[transaction.ticker] = [newQuantity, latestValue]
      } else {
        let latestValue = await this.fillLatestStockValue(transaction.ticker)
        noRepeatTickers[transaction.ticker] = [
          transaction.quantity,
          latestValue
        ]
      }
    }

    let arrayForm = Object.entries(noRepeatTickers)

    // let arrayFilledValue = arrayForm.map(async stock => {
    //   let ticker = stock[0]
    //   let quantity = stock[1][0]
    //   let latestValue = await this.fillLatestStockValue(ticker)
    //   console.log(latestValue, 'after func call')
    //   let totalValue = quantity * latestValue
    //    return [ticker, [quantity, totalValue]]
    // })
    this.setState({
      portfolioLoaded: true,
      portfolio: arrayForm
    })
  }

  async fillLatestStockValue(ticker) {
    let iexRes
    try {
      iexRes = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=pk_9fe41c3d9b9a42ddaf552dbfdfbbbff0`
      )
      return iexRes.data.latestPrice
    } catch (err) {
      console.log('NOT FINDING LATEST PRICE')
    }
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
              this.state.portfolio.map(transaction => {
                let ticker = transaction[0]
                let quantity = transaction[1][0]
                let value = transaction[1][1]
                return (
                  <div key="transaction.id" className="transactionSegment">
                    <div className="transactionRow">
                      <h3>{ticker}</h3>
                      <h3 className="separator">|</h3>
                      <h3>
                        {quantity} shares, total value of ${quantity * value}
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

//showing non flattened transactions, good job!
//now you need to flatten share count, and get api call to current price * quantity owned
