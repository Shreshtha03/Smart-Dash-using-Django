document.addEventListener('DOMContentLoaded', () => {
    const xValues = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

    new Chart("myChart1", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                label: "Temperature Data",
                data: yValues,
                fill: false,
                tension: 0.3,
                borderColor: "blue",
                backgroundColor: "blue",
                pointBackgroundColor: "blue",
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (Seconds)', // ✅ X-axis Label
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: 'black'
                    },
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)', // ✅ Y-axis Label
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: 'black'
                    },
                    min: 6,
                    max: 16,
                    ticks: {
                        color: 'black'
                    }
                }
            }
        }
    });
});