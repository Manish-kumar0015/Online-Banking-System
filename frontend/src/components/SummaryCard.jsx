import "../styles/summaryCard.css";

// Reusable card component for displaying a banking summary value
function SummaryCard({

    title,

    amount

}) {

    return (

        <div className="summary-card">

            <h3>

                {title}

            </h3>

            <h2>

                ₹ {amount}

            </h2>

        </div>

    );

}

export default SummaryCard;