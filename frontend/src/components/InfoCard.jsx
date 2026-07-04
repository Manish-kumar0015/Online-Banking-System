import "../styles/infoCard.css";
function InfoCard({ title, value }) {

    return (

        <div className="info-card-box">

            <h3>{title}</h3>

            <p>{value}</p>

        </div>

    );

}

export default InfoCard;