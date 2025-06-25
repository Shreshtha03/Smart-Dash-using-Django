document.addEventListener('DOMContentLoaded', () => {
    // localStorage se card mappings padho
    const cardMappings = JSON.parse(localStorage.getItem('cardMappings') || '{}');
    console.log('cardMappings:', cardMappings); // Debug log

    // Equipment aur unke colors
    const equipmentColors = {
        temperature: '#FF6384', // Red
        humidity: '#36A2EB',    // Blue
        voltage: '#FFCE56',     // Yellow
        current: '#4BC0C0',     // Teal
        pressure: '#9966FF',    // Purple
        flow_rate: '#FF9F40'    // Orange
    };

    // Fallback colors for any unexpected equipment
    const fallbackColors = [
        '#FF5733', // Bright Red
        '#33FF57', // Bright Green
        '#3357FF', // Bright Blue
        '#FF33A1', // Pink
        '#57FFFF', // Cyan
        '#FFA833'  // Amber
    ];

    // Labels mapping for pie chart (short names)
    const labelMapping = {
        temperature: 'Temp',
        humidity: 'Humid',
        voltage: 'Volt',
        current: 'Curr',
        pressure: 'Press',
        flow_rate: 'Flow'
    };

    // Pie chart data
    const pieData = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    };

    // cardMappings se data bharo
    let colorIndex = 0;
    Object.values(cardMappings).forEach(mapping => {
        const equipment = mapping.equipment.toLowerCase(); // Ensure case consistency
        const label = labelMapping[equipment] || mapping.label;
        console.log(`Processing equipment: ${equipment}, Label: ${label}`); // Debug log
        pieData.labels.push(label);
        const numericValue = parseFloat(mapping.value.replace(/[^\d.]/g, '')) || 0;
        pieData.datasets[0].data.push(numericValue);
        const color = equipmentColors[equipment] || fallbackColors[colorIndex % fallbackColors.length];
        pieData.datasets[0].backgroundColor.push(color);
        colorIndex++;
    });

    // Default data agar cardMappings empty hai
    if (pieData.labels.length === 0) {
        console.log('Using default data'); // Debug log
        pieData.labels = ['Temp', 'Humid', 'Volt', 'Curr', 'Press', 'Flow'];
        pieData.datasets[0].data = [25, 60, 220, 5, 5.2, 120];
        pieData.datasets[0].backgroundColor = [
            equipmentColors.temperature,
            equipmentColors.humidity,
            equipmentColors.voltage,
            equipmentColors.current,
            equipmentColors.pressure,
            equipmentColors.flow_rate
        ];
    }

    // Custom legend create karne ka function
    function createCustomLegend(labels, colors) {
        const legendContainer = document.getElementById('legendYearly');
        if (!legendContainer) {
            console.error('Legend container not found');
            return;
        }
        legendContainer.innerHTML = ''; // Clear previous legend
        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${colors[index]}"></span>
                <span class="legend-label">${label}</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }

    // Pie charts create karo
    const charts = [
        { id: 'Daily', ctx: document.getElementById('pieDaily'), title: 'Daily' },
        { id: 'Weekly', ctx: document.getElementById('pieWeekly'), title: 'Weekly' },
        { id: 'Monthly', ctx: document.getElementById('pieMonthly'), title: 'Monthly' },
        { id: 'Yearly', ctx: document.getElementById('pieYearly'), title: 'Yearly' }
    ];

    charts.forEach(chart => {
        if (chart.ctx) {
            new Chart(chart.ctx, {
                type: 'pie',
                data: pieData,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 1,
                    title: {
                        display: true,
                        text: chart.title,
                        fontSize: 20,
                        fontColor: 'white'
                    },
                    legend: {
                        display: false
                    }
                }
            });

            // Sirf Yearly chart ke liye legend create karo
            if (chart.id === 'Yearly') {
                createCustomLegend(pieData.labels, pieData.datasets[0].backgroundColor);
            }
        } else {
            console.error(`Canvas element with id "pie${chart.id}" not found.`);
        }
    });
});









// document.addEventListener('DOMContentLoaded', () => {
//     // Daily Pie Chart
//     const dailyCtx = document.getElementById('pieDaily');
//     if (dailyCtx) {
//         new Chart(dailyCtx, {
//             type: 'pie',
//             data: {
//                 labels: ['Temp', 'Humid', 'Volt', 'Curr'],
//                 datasets: [{
//                     data: [215, 60, 90, 25],
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: true, // Enforce aspect ratio for circular shape
//                 aspectRatio: 1, // Ensures a 1:1 ratio for a circle
//                 title: {
//                     display: true, // Enabled title to test visibility
//                     text: 'Daily',
//                     fontSize: 20,
//                     fontColor: 'white' // Set text color to white
//                 },
//                 legend: {
//                     display: false // Keep legend disabled
//                 }
//             }
//         });
//     } else {
//         console.error('Canvas element with id "pieDaily" not found.');
//     }

//     // Weekly Pie Chart
//     const weeklyCtx = document.getElementById('pieWeekly');
//     if (weeklyCtx) {
//         new Chart(weeklyCtx, {
//             type: 'pie',
//             data: {
//                 labels: ['Temp', 'Humid', 'Volt', 'Curr'],
//                 datasets: [{
//                     data: [226, 16, 21, 6],
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: true,
//                 aspectRatio: 1,
//                 title: {
//                     display: true,
//                     text: 'Weekly',
//                     fontSize: 20,
//                     fontColor: 'white' // Set text color to white
//                 },
//                 legend: {
//                     display: false
//                 }
//             }
//         });
//     }

//     // Monthly Pie Chart
//     const monthlyCtx = document.getElementById('pieMonthly');
//     if (monthlyCtx) {
//         new Chart(monthlyCtx, {
//             type: 'pie',
//             data: {
//                 labels: ['Temp', 'Humid', 'Volt', 'Curr'],
//                 datasets: [{
//                     data: [24, 61, 46, 155.5],
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: true,
//                 aspectRatio: 1,
//                 title: {
//                     display: true,
//                     text: 'Monthly',
//                     fontSize: 20,
//                     fontColor: 'white' // Set text color to white
//                 },
//                 legend: {
//                     display: false
//                 }
//             }
//         });
//     }

//     // Yearly Pie Chart
//     const yearlyCtx = document.getElementById('pieYearly');
//     if (yearlyCtx) {
//         new Chart(yearlyCtx, {
//             type: 'pie',
//             data: {
//                 labels: ['Temp', 'Humid', 'Volt', 'Curr'],
//                 datasets: [{
//                     data: [25.5, 60.5, 2, 5.8],
//                     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: true,
//                 aspectRatio: 1,
//                 title: {
//                     display: true,
//                     text: 'Yearly',
//                     fontSize: 20,
//                     fontColor: 'white' // Set text color to white
//                 },
//                 legend: {
//                     display: false
//                 }
//             }
//         });
//     }
// });

