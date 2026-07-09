import "../styles/recentTransactions.css";

// Displays the user's most recent banking transactions
function RecentTransactions({ transactions }) {

    return (

        <div className="recent-box">

            <h2>Recent Transactions</h2>

            <table>

                <thead>

                    <tr>

                        <th>Type</th>

                        <th>Amount</th>

                        <th>Description</th>

                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        // Show a message when no transactions are available
                        transactions.length === 0 ?

                        (

                            <tr>

                                <td colSpan="4">

                                    No Transactions Found

                                </td>

                            </tr>

                        )

                        :

                        (

                            // Render each transaction as a table row
                            transactions.map((transaction) => (

                                <tr key={transaction.id}>

                                    <td>{transaction.type}</td>

                                    <td>₹ {transaction.amount}</td>

                                    <td>{transaction.description}</td>

                                    <td>

                                        {/* Format transaction date into a readable format */}
                                        {

                                            new Date(

                                                transaction.created_at

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default RecentTransactions;