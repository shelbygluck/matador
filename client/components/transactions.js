import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {gettingTransactions} from '../store/transaction'
import {Loading} from './loading'

export class Transactions extends Component {
  constructor() {
    super()
    this.state = {
      transactionsLoaded: false
    }
  }

  async componentDidMount() {
    await this.props.getTransactions(this.props.email)
    this.setState({
      transactionsLoaded: true
    })
  }

  render() {
    return (
      <div>
        <div id="transactionTable">
          {this.state.transactionsLoaded ? (
            this.props.transactions.map(transaction => {
              return (
                <div key="transaction.id" className="transactionSegment">
                  <div className="transactionRow">
                    <h3>PURCHASED {transaction.ticker}</h3>
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
            <div className="loadingContainer">
              <h3>Matador is loading your transactions</h3>
              <Loading type="bars" />
            </div>
          )}
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
  getTransactions: email => dispatch(gettingTransactions(email))
})

export default connect(mapState, mapDispatch)(Transactions)

/**
 * PROP TYPES
 */
Transactions.propTypes = {
  email: PropTypes.string
}
