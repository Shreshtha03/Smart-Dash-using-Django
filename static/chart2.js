document.addEventListener('DOMContentLoaded', () => {
    const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    const yValues = [60, 62, 58, 61, 63, 65, 64, 66, 68, 67, 69];

    new Chart("myChart2", {
        type: "line",
        data: {
            labels: xValues, // Fixed: Labels moved outside datasets
            datasets: [{
                label: "Humidity", // Label for legend
                data: yValues,
                fill: false,
                tension: 0.3, // Modern syntax for line tension
                borderColor: "red",
                backgroundColor: "red",
                pointBackgroundColor: "red",
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true, // Show legend
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: 'black'
                    }
                }
            },
            scales: {
                x: {
                    scaleLabel: {
                        display: true,
                        labelString: "Time (Seconds)",
                        fontColor: "black",
                        fontSize: 16
                    },
                    title: {
                        display: true,
                        text: 'Time', 
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: 'black'
                    },
                    ticks: {
                        color: "black"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Humidity (%)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: 'black'
                    },
                    min: 50,
                    max: 70,
                    ticks: {
                        color: 'black'
                    }
                }
            }
        }
    });
});