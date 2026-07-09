import {

    Bar,

    Doughnut

} from "react-chartjs-2";

import {

    Chart as ChartJS,

    CategoryScale,

    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend,

    Title

} from "chart.js";

import "../styles/chart.css";

// Register Chart.js components required for rendering charts
ChartJS.register(

    CategoryScale,

    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend,

    Title

);

function TransactionChart({ summary }) {

    // Extract transaction totals from the dashboard summary
    const values = [

        Number(summary.totalDeposit),

        Number(summary.totalWithdraw),

        Number(summary.totalTransfer)

    ];

    // Labels corresponding to each transaction type
    const labels = [

        "Deposit",

        "Withdraw",

        "Transfer"

    ];

    // Color scheme used for both bar and doughnut charts
    const colors = [

        "#22c55e",

        "#ef4444",

        "#f59e0b"

    ];

    // Shared dataset configuration for both charts
    const data = {

        labels,

        datasets: [

            {

                label: "Amount",

                data: values,

                backgroundColor: colors,

                borderColor: [

                    "#16a34a",

                    "#dc2626",

                    "#d97706"

                ],

                borderWidth: 2,

                borderRadius: 10,

                borderSkipped: false

            }

        ]

    };

    // Configuration for the bar chart
    const options = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                display: false

            }

        },

        scales: {

            y: {

                beginAtZero: true,

                grid: {

                    color: "#e5e7eb"

                },

                ticks: {

                    color: "#374151"

                }

            },

            x: {

                grid: {

                    display: false

                },

                ticks: {

                    color: "#374151",

                    font: {

                        size: 14,

                        weight: "bold"

                    }

                }

            }

        }

    };

    // Configuration for the doughnut chart
    const doughnutOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    };

    return (

        <div className="chart-wrapper">

            <div className="chart-card">

                <h2>

                    📊 Transaction Overview

                </h2>

                <div className="chart-box">

                    {/* Bar chart comparing transaction amounts */}
                    <Bar

                        data={data}

                        options={options}

                    />

                </div>

            </div>

            <div className="chart-card">

                <h2>

                    🥧 Transaction Distribution

                </h2>

                <div className="chart-box">

                    {/* Doughnut chart showing transaction distribution */}
                    <Doughnut

                        data={data}

                        options={doughnutOptions}

                    />

                </div>

            </div>

        </div>

    );

}

export default TransactionChart;