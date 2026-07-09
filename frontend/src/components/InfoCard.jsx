import "../styles/infoCard.css";

// Reusable card component for displaying a title and its corresponding value
function InfoCard({ title, value }) {

    return (

        <div className="info-card-box">

            <h3>{title}</h3>

            <p>{value}</p>

        </div>

    );

}

export default InfoCard;