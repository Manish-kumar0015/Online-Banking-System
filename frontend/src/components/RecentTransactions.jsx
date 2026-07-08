
import "../styles/recentTransactions.css";

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

                            transactions.map((transaction) => (

                                <tr key={transaction.id}>

                                    <td>{transaction.type}</td>

                                    <td>₹ {transaction.amount}</td>

                                    <td>{transaction.description}</td>

                                    <td>

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