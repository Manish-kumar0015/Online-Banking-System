
import "../styles/summaryCard.css";

function SummaryCard({ title, value }) {

    return (

        <div className="summary-card">

            <h4>{title}</h4>

            <h2>{value}</h2>

        </div>

    );

}

export default SummaryCard;