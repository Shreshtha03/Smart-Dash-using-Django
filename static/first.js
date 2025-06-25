document.addEventListener('DOMContentLoaded', async function() {
    // LocalStorage se card mappings lo
    const cardMappings = JSON.parse(localStorage.getItem('cardMappings') || '{}');
    const allCards = document.querySelectorAll('.dashboard .card');

    // Pehle localStorage se cards update karo
    if (Object.keys(cardMappings).length > 0) {
        allCards.forEach(card => {
            const cardId = card.getAttribute('data-card-id');
            const mapping = cardMappings[cardId];

            if (mapping) {
                card.classList.remove('hidden');
                card.setAttribute('data-equipment', mapping.equipment);

                const editButton = card.querySelector('.edit');
                editButton.setAttribute('onclick', `window.location.href='/dashboard/edit?card=${cardId}&equipment=${mapping.equipment}'`);

                const labelDiv = card.querySelector('.label');
                if (labelDiv && mapping.label) {
                    labelDiv.textContent = mapping.label;
                }

                const valueDiv = card.querySelector('.value');
                if (valueDiv && mapping.value) {
                    valueDiv.textContent = mapping.value;
                } else if (valueDiv) {
                    console.warn(`No specific value found for card ${cardId}. Displaying default.`);
                }
            } else {
                card.classList.add('hidden');
            }
        });
    } else {
        allCards.forEach(card => {
            card.classList.remove('hidden');
        });
        console.log("No card mappings in localStorage. Showing default cards.");
    }

    // API se data fetch karo for sync
    try {
        const response = await fetch('http://127.0.0.1:8000/api/Card/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const apiCards = await response.json();
            allCards.forEach(card => {
                const cardId = card.getAttribute('data-card-id');
                const apiCard = apiCards.find(c => c.card_id === cardId);

                if (apiCard) {
                    card.classList.remove('hidden');
                    card.setAttribute('data-equipment', apiCard.card_name);

                    const editButton = card.querySelector('.edit');
                    editButton.setAttribute('onclick', `window.location.href='/dashboard/edit?card=${cardId}&equipment=${apiCard.card_name}'`);

                    const labelDiv = card.querySelector('.label');
                    if (labelDiv) {
                        labelDiv.textContent = apiCard.card_name.charAt(0).toUpperCase() + apiCard.card_name.slice(1);
                    }

                    const valueDiv = card.querySelector('.value');
                    if (valueDiv) {
                        // Add unit based on equipment
                        let formattedValue;
                        switch (apiCard.card_name) {
                            case 'temperature':
                                formattedValue = `${apiCard.card_value}°C`;
                                break;
                            case 'humidity':
                                formattedValue = `${apiCard.card_value}%`;
                                break;
                            case 'voltage':
                                formattedValue = `${apiCard.card_value}V`;
                                break;
                            case 'current':
                                formattedValue = `${apiCard.card_value}A`;
                                break;
                            case 'pressure':
                                formattedValue = `${apiCard.card_value}Pa`;
                                break;
                            case 'ph':
                                formattedValue = `${apiCard.card_value} pH`;
                                break;
                            case 'air_quality':
                                formattedValue = `${apiCard.card_value} AQI`;
                                break;
                            case 'frequency':
                                formattedValue = `${apiCard.card_value} Hz`;
                                break;
                            case 'battery_voltage':
                                formattedValue = `${apiCard.card_value} V`;
                                break;
                            default:
                                formattedValue = apiCard.card_value;
                        }
                        valueDiv.textContent = formattedValue;

                        // Update localStorage to sync
                        cardMappings[cardId] = {
                            equipment: apiCard.card_name,
                            label: apiCard.card_name.charAt(0).toUpperCase() + apiCard.card_name.slice(1),
                            value: formattedValue
                        };
                        localStorage.setItem('cardMappings', JSON.stringify(cardMappings));
                    }
                }
            });
        } else {
            console.error('Failed to fetch cards from API:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error fetching cards from API:', error);
    }
});




















// Fetch Temperature Data
async function fetchTemperatureData() {
    const response = await fetch('/api/Temperature/');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Temperature Data:', data);
    return data.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0], // Date only
        temperature: item.temperature
    }));
}

// Fetch Humidity Data
async function fetchHumidityData() {
    const response = await fetch('/api/Humidity/');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Humidity Data:', data);
    return data.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0], // Date only
        humidity: item.humidity
    }));
}

// Fetch Voltage Data
async function fetchVoltageData() {
    const response = await fetch('/api/Voltage/');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Voltage Data:', data);
    return data.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0], // Date only
        voltage: item.voltage
    }));
}

// Fetch Current Data
async function fetchCurrentData() {
    const response = await fetch('/api/Current/');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Current Data:', data);
    return data.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0], // Date only
        current: item.current
    }));
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [tempData, humData, voltData, currData] = await Promise.all([
            fetchTemperatureData(),
            fetchHumidityData(),
            fetchVoltageData(),
            fetchCurrentData()
        ]);

        console.log('Processed Temp Data:', tempData);
        console.log('Processed Hum Data:', humData);
        console.log('Processed Volt Data:', voltData);
        console.log('Processed Curr Data:', currData);

        // Check if canvas exists
        const tempHumCanvas = document.getElementById('myChart1');
        const voltCurrCanvas = document.getElementById('myChart2');
        if (!tempHumCanvas || !voltCurrCanvas) {
            console.error('Canvas not found:', { tempHumCanvas, voltCurrCanvas });
            return;
        }
        console.log('Canvas found:', { tempHumCanvas, voltCurrCanvas });

        // Sample data if too large
        const maxPoints = 50; // Max points to display for clear visualization
        let tempHumLabels = tempData.map(item => item.date);
        let tempValues = tempData.map(item => item.temperature);
        let humValues = humData.map(item => item.humidity);
        if (tempHumLabels.length > maxPoints) {
            const step = Math.ceil(tempHumLabels.length / maxPoints);
            tempHumLabels = tempHumLabels.filter((_, i) => i % step === 0);
            tempValues = tempValues.filter((_, i) => i % step === 0);
            humValues = humValues.filter((_, i) => i % step === 0);
        }

        let voltCurrLabels = voltData.map(item => item.date);
        let voltValues = voltData.map(item => item.voltage);
        let currValues = currData.map(item => item.current);
        if (voltCurrLabels.length > maxPoints) {
            const step = Math.ceil(voltCurrLabels.length / maxPoints);
            voltCurrLabels = voltCurrLabels.filter((_, i) => i % step === 0);
            voltValues = voltValues.filter((_, i) => i % step === 0);
            currValues = currValues.filter((_, i) => i % step === 0);
        }

        // Temperature and Humidity Chart (myChart1)
        new Chart(tempHumCanvas.getContext('2d'), {
            type: "line",
            data: {
                labels: tempHumLabels,
                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: tempValues,
                        fill: false,
                        tension: 0.3,
                        borderColor: "blue",
                        backgroundColor: "rgba(0, 0, 255, 0.2)",
                        pointBackgroundColor: "blue",
                        pointRadius: 2
                    },
                    {
                        label: "Humidity (%)",
                        data: humValues,
                        fill: false,
                        tension: 0.3,
                        borderColor: "red",
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                        pointBackgroundColor: "red",
                        pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, labels: { font: { size: 14, weight: 'bold' }, color: 'black' } } },
                scales: {
                    x: {
                        title: { display: true, text: 'Date', font: { size: 16, weight: 'bold' }, color: 'black' },
                        ticks: { color: 'black', maxTicksLimit: 10 } // Limit labels for better gap
                    },
                    y: {
                        title: { display: true, text: 'Temperature (°C)', font: { size: 16, weight: 'bold' }, color: 'black' },
                        ticks: { color: 'black', beginAtZero: true }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: { display: true, text: 'Humidity (%)', font: { size: 16, weight: 'bold' }, color: 'black' },
                        ticks: { color: 'black', beginAtZero: true },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });

        // Voltage and Current Chart (myChart2)
        new Chart(voltCurrCanvas.getContext('2d'), {
            type: "line",
            data: {
                labels: voltCurrLabels,
                datasets: [
                    {
                        label: "Voltage (V)",
                        data: voltValues,
                        fill: false,
                        tension: 0.3,
                        borderColor: "green",
                        backgroundColor: "rgba(0, 255, 0, 0.2)",
                        pointBackgroundColor: "green",
                        pointRadius: 2
                    },
                    {
                        label: "Current (A)",
                        data: currValues,
                        fill: false,
                        tension: 0.3,
                        borderColor: "orange",
                        backgroundColor: "rgba(255, 165, 0, 0.2)",
                        pointBackgroundColor: "orange",
                        pointRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, labels: { font: { size: 14, weight: 'bold' }, color: 'black' } } },
                scales: {
                    x: {
                        title: { display: true, text: 'Date', font: { size: 16, weight: 'bold' }, color: 'black' },
                        ticks: { color: 'black', maxTicksLimit: 10 } // Limit labels for better gap
                    },
                    y: {
                        title: { display: true, text: 'Value', font: { size: 16, weight: 'bold' }, color: 'black' },
                        ticks: { color: 'black', beginAtZero: true }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});









































// // Card Update Logic
// document.addEventListener('DOMContentLoaded', async function() {
//     // LocalStorage se card mappings lo
//     const cardMappings = JSON.parse(localStorage.getItem('cardMappings') || '{}');
//     const allCards = document.querySelectorAll('.dashboard .card');

//     // Pehle localStorage se cards update karo
//     if (Object.keys(cardMappings).length > 0) {
//         allCards.forEach(card => {
//             const cardId = card.getAttribute('data-card-id');
//             const mapping = cardMappings[cardId];

//             if (mapping) {
//                 card.classList.remove('hidden');
//                 card.setAttribute('data-equipment', mapping.equipment);

//                 const editButton = card.querySelector('.edit');
//                 editButton.setAttribute('onclick', `window.location.href='/dashboard/edit?card=${cardId}&equipment=${mapping.equipment}'`);

//                 const labelDiv = card.querySelector('.label');
//                 if (labelDiv && mapping.label) {
//                     labelDiv.textContent = mapping.label;
//                 }

//                 const valueDiv = card.querySelector('.value');
//                 if (valueDiv && mapping.value) {
//                     valueDiv.textContent = mapping.value;
//                 } else if (valueDiv) {
//                     console.warn(`No specific value found for card ${cardId}. Displaying default.`);
//                     valueDiv.textContent = 'N/A';
//                 }
//             } else {
//                 card.classList.add('hidden');
//             }
//         });
//     } else {
//         allCards.forEach(card => {
//             card.classList.remove('hidden');
//         });
//         console.log("No card mappings in localStorage. Showing default cards.");
//     }

//     // API se data fetch karo for sync
//     try {
//         const response = await fetch('http://127.0.0.1:8000/api/Card/', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (response.ok) {
//             const apiCards = await response.json();
//             console.log('API Cards:', apiCards); // Debug log
//             allCards.forEach(card => {
//                 const cardId = card.getAttribute('data-card-id');
//                 const apiCard = apiCards.find(c => c.card_id === cardId);

//                 if (apiCard) {
//                     card.classList.remove('hidden');
//                     card.setAttribute('data-equipment', apiCard.card_name);

//                     const editButton = card.querySelector('.edit');
//                     editButton.setAttribute('onclick', `window.location.href='/dashboard/edit?card=${cardId}&equipment=${apiCard.card_name}'`);

//                     const labelDiv = card.querySelector('.label');
//                     if (labelDiv) {
//                         labelDiv.textContent = apiCard.card_name.charAt(0).toUpperCase() + apiCard.card_name.slice(1);
//                     }

//                     const valueDiv = card.querySelector('.value');
//                     if (valueDiv) {
//                         let formattedValue;
//                         if (apiCard.card_value !== undefined && apiCard.card_value !== null) {
//                             switch (apiCard.card_name) {
//                                 case 'temperature':
//                                     formattedValue = `${apiCard.card_value}°C`;
//                                     break;
//                                 case 'humidity':
//                                     formattedValue = `${apiCard.card_value}%`;
//                                     break;
//                                 case 'voltage':
//                                     formattedValue = `${apiCard.card_value}V`;
//                                     break;
//                                 case 'current':
//                                     formattedValue = `${apiCard.card_value}A`;
//                                     break;
//                                 case 'pressure':
//                                     formattedValue = `${apiCard.card_value}Pa`;
//                                     break;
//                                 case 'ph':
//                                     formattedValue = `${apiCard.card_value} pH`;
//                                     break;
//                                 case 'air_quality':
//                                     formattedValue = `${apiCard.card_value} AQI`;
//                                     break;
//                                 case 'frequency':
//                                     formattedValue = `${apiCard.card_value} Hz`;
//                                     break;
//                                 case 'battery_voltage':
//                                     formattedValue = `${apiCard.card_value} V`;
//                                     break;
//                                 default:
//                                     formattedValue = apiCard.card_value;
//                             }
//                             valueDiv.textContent = formattedValue;
//                         } else {
//                             valueDiv.textContent = 'N/A';
//                             console.warn(`No value for card ${cardId}, setting to N/A`);
//                         }
//                         // Update localStorage
//                         cardMappings[cardId] = {
//                             equipment: apiCard.card_name,
//                             label: apiCard.card_name.charAt(0).toUpperCase() + apiCard.card_name.slice(1),
//                             value: formattedValue || 'N/A'
//                         };
//                         localStorage.setItem('cardMappings', JSON.stringify(cardMappings));
//                     }
//                 }
//             });
//         } else {
//             console.error('Failed to fetch cards from API:', response.status, await response.text());
//         }
//     } catch (error) {
//         console.error('Error fetching cards from API:', error);
//     }
// });

// // Fetch Temperature Data
// async function fetchTemperatureData() {
//     const response = await fetch('/api/Temperature/');
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     console.log('Temperature Data:', data);
//     return data.map(item => ({
//         date: new Date(item.date).toISOString().split('T')[0], // Date only
//         temperature: item.temperature
//     }));
// }

// // Fetch Humidity Data
// async function fetchHumidityData() {
//     const response = await fetch('/api/Humidity/');
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     console.log('Humidity Data:', data);
//     return data.map(item => ({
//         date: new Date(item.date).toISOString().split('T')[0], // Date only
//         humidity: item.humidity
//     }));
// }

// // Fetch Voltage Data
// async function fetchVoltageData() {
//     const response = await fetch('/api/Voltage/');
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     console.log('Voltage Data:', data);
//     return data.map(item => ({
//         date: new Date(item.date).toISOString().split('T')[0], // Date only
//         voltage: item.voltage
//     }));
// }

// // Fetch Current Data
// async function fetchCurrentData() {
//     const response = await fetch('/api/Current/');
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const data = await response.json();
//     console.log('Current Data:', data);
//     return data.map(item => ({
//         date: new Date(item.date).toISOString().split('T')[0], // Date only
//         current: item.current
//     }));
// }

// // Chart Logic
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const [tempData, humData, voltData, currData] = await Promise.all([
//             fetchTemperatureData(),
//             fetchHumidityData(),
//             fetchVoltageData(),
//             fetchCurrentData()
//         ]);

//         console.log('Processed Temp Data:', tempData);
//         console.log('Processed Hum Data:', humData);
//         console.log('Processed Volt Data:', voltData);
//         console.log('Processed Curr Data:', currData);

//         // Check if canvas exists
//         const tempHumCanvas = document.getElementById('myChart1');
//         const voltCurrCanvas = document.getElementById('myChart2');
//         if (!tempHumCanvas || !voltCurrCanvas) {
//             console.error('Canvas not found:', { tempHumCanvas, voltCurrCanvas });
//             return;
//         }
//         console.log('Canvas found:', { tempHumCanvas, voltCurrCanvas });

//         // Sample data if too large
//         const maxPoints = 50; // Max points to display for clear visualization
//         let tempHumLabels = tempData.map(item => item.date);
//         let tempValues = tempData.map(item => item.temperature);
//         let humValues = humData.map(item => item.humidity);
//         if (tempHumLabels.length > maxPoints) {
//             const step = Math.ceil(tempHumLabels.length / maxPoints);
//             tempHumLabels = tempHumLabels.filter((_, i) => i % step === 0);
//             tempValues = tempValues.filter((_, i) => i % step === 0);
//             humValues = humValues.filter((_, i) => i % step === 0);
//         }

//         let voltCurrLabels = voltData.map(item => item.date);
//         let voltValues = voltData.map(item => item.voltage);
//         let currValues = currData.map(item => item.current);
//         if (voltCurrLabels.length > maxPoints) {
//             const step = Math.ceil(voltCurrLabels.length / maxPoints);
//             voltCurrLabels = voltCurrLabels.filter((_, i) => i % step === 0);
//             voltValues = voltValues.filter((_, i) => i % step === 0);
//             currValues = currValues.filter((_, i) => i % step === 0);
//         }

//         // Temperature and Humidity Chart (myChart1)
//         new Chart(tempHumCanvas.getContext('2d'), {
//             type: "line",
//             data: {
//                 labels: tempHumLabels,
//                 datasets: [
//                     {
//                         label: "Temperature (°C)",
//                         data: tempValues,
//                         fill: false,
//                         tension: 0.3,
//                         borderColor: "blue",
//                         backgroundColor: "rgba(0, 0, 255, 0.2)",
//                         pointBackgroundColor: "blue",
//                         pointRadius: 2
//                     },
//                     {
//                         label: "Humidity (%)",
//                         data: humValues,
//                         fill: false,
//                         tension: 0.3,
//                         borderColor: "red",
//                         backgroundColor: "rgba(255, 0, 0, 0.2)",
//                         pointBackgroundColor: "red",
//                         pointRadius: 2
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: { legend: { display: true, labels: { font: { size: 14, weight: 'bold' }, color: 'black' } } },
//                 scales: {
//                     x: {
//                         title: { display: true, text: 'Date', font: { size: 16, weight: 'bold' }, color: 'black' },
//                         ticks: { color: 'black', maxTicksLimit: 10 } // Limit labels for better gap
//                     },
//                     y: {
//                         title: { display: true, text: 'Temperature (°C)', font: { size: 16, weight: 'bold' }, color: 'black' },
//                         ticks: { color: 'black', beginAtZero: true }
//                     },
//                     y1: {
//                         type: 'linear',
//                         position: 'right',
//                         title: { display: true, text: 'Humidity (%)', font: { size: 16, weight: 'bold' }, color: 'black' },
//                         ticks: { color: 'black', beginAtZero: true },
//                         grid: { drawOnChartArea: false }
//                     }
//                 }
//             }
//         });

//         // Voltage and Current Chart (myChart2)
//         new Chart(voltCurrCanvas.getContext('2d'), {
//             type: "line",
//             data: {
//                 labels: voltCurrLabels,
//                 datasets: [
//                     {
//                         label: "Voltage (V)",
//                         data: voltValues,
//                         fill: false,
//                         tension: 0.3,
//                         borderColor: "green",
//                         backgroundColor: "rgba(0, 255, 0, 0.2)",
//                         pointBackgroundColor: "green",
//                         pointRadius: 2
//                     },
//                     {
//                         label: "Current (A)",
//                         data: currValues,
//                         fill: false,
//                         tension: 0.3,
//                         borderColor: "orange",
//                         backgroundColor: "rgba(255, 165, 0, 0.2)",
//                         pointBackgroundColor: "orange",
//                         pointRadius: 2
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: { legend: { display: true, labels: { font: { size: 14, weight: 'bold' }, color: 'black' } } },
//                 scales: {
//                     x: {
//                         title: { display: true, text: 'Date', font: { size: 16, weight: 'bold' }, color: 'black' },
//                         ticks: { color: 'black', maxTicksLimit: 10 } // Limit labels for better gap
//                     },
//                     y: {
//                         title: { display: true, text: 'Value', font: { size: 16, weight: 'bold' }, color: 'black' },
//                         ticks: { color: 'black', beginAtZero: true }
//                     }
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// });