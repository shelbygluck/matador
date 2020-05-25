/* eslint-disable react/no-access-state-in-setstate */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {gettingTransactions} from '../store/transaction'

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
        let [latestValue, dayOpenValue] = await this.fillLatestStockValue(
          transaction.ticker
        )
        noRepeatTickers[transaction.ticker] = [
          newQuantity,
          latestValue,
          dayOpenValue
        ]
      } else {
        let [latestValue, dayOpenValue] = await this.fillLatestStockValue(
          transaction.ticker
        )
        noRepeatTickers[transaction.ticker] = [
          transaction.quantity,
          latestValue,
          dayOpenValue
        ]
      }
    }
    let arrayForm = Object.entries(noRepeatTickers)
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
      let latestPrice = iexRes.data.latestPrice
      let openPrice = iexRes.data.openTime
      let colorCode
      if (openPrice === null || latestPrice === openPrice) {
        colorCode = 'gray'
      } else if (latestPrice < openPrice) {
        colorCode = 'red'
      } else {
        colorCode = 'green'
      }
      return [iexRes.data.latestPrice, colorCode]
    } catch (err) {
      console.log('NOT FINDING LATEST PRICE')
    }
  }

  render() {
    return (
      <div>
        <h3>Portfolio for {this.props.email}</h3>
        <div className="portfolioContainer">
          <div id="transactionTable">
            {this.state.portfolioLoaded ? (
              this.state.portfolio.map(transaction => {
                let ticker = transaction[0]
                let quantity = transaction[1][0]
                let value = transaction[1][1]
                let colorCode = transaction[1][2]
                return (
                  <div key="transaction.id" className="transactionSegment">
                    <div className="transactionRow">
                      <h3 className={colorCode}>{ticker}</h3>
                      <h3 className="separator">|</h3>
                      <h3 className={colorCode}>
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
    transactions: state.transaction
  }
}

const mapDispatch = dispatch => ({
  getTransactions: email => dispatch(gettingTransactions(email))
})

export default connect(mapState, mapDispatch)(Portfolio)
