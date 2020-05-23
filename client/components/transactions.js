import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {gettingTransactions} from '../store/transaction'
/**
 * COMPONENT
 */
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
        {console.log(this.state.transactionsLoaded)}
        <h3>Transactions for {this.props.email}</h3>
        {this.state.transactionsLoaded ? (
          this.props.transactions.map(transaction => {
            return <h3 key="transaction.id">{transaction.ticker}</h3>
          })
        ) : (
          <div>loading transactions</div>
        )}
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
