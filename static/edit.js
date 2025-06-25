document.addEventListener('DOMContentLoaded', async function() {
    // Check if form exists
    const form = document.getElementById('equipmentForm');
    if (!form) {
        console.error('Form with ID "equipmentForm" not found!');
        return;
    }

    // URL se card ID aur equipment padho
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('card');
    const equipment = urlParams.get('equipment');

    // Validate URL params
    if (!cardId || !equipment) {
        console.error('Missing card or equipment in URL params:', { cardId, equipment });
        alert('Invalid URL. Please use the edit button from the dashboard.');
        return;
    }

    // Dropdown mein pre-select karo aur localStorage se data fetch karo
    const selectElement = document.getElementById('equipment');
    if (!selectElement) {
        console.error('Select element with ID "equipment" not found!');
        return;
    }
    selectElement.value = equipment;

    const valueInput = document.getElementById('value');
    if (!valueInput) {
        console.error('Input element with ID "value" not found!');
        return;
    }

    // LocalStorage se card data lo
    const cardMappings = JSON.parse(localStorage.getItem('cardMappings') || '{}');
    const cardData = cardMappings[cardId];

    if (cardData && cardData.value && typeof cardData.value === 'string') {
        valueInput.value = cardData.value.replace(/[^0-9.]/g, '');
    } else {
        console.warn(`No valid value found in localStorage for card ${cardId}`);
    }

    // API se data fetch karo for consistency
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/Card/${cardId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const apiCardData = await response.json();
            valueInput.value = apiCardData.card_value; // Float value (e.g., 25.0)
        } else {
            console.error('Card not found for ID:', cardId, 'Status:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error fetching card data from API:', error);
    }

    // Card ID ko form mein store karo
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'cardId';
    hiddenInput.value = cardId;
    form.appendChild(hiddenInput);
});

// Form submit ka function
async function handleFormSubmit(event) {
    event.preventDefault();

    const selectElement = document.getElementById('equipment');
    const valueInput = document.getElementById('value');
    const cardIdInput = document.querySelector('input[name="cardId"]');

    if (!selectElement || !valueInput || !cardIdInput) {
        alert('Form elements not found!');
        console.error('Missing form elements:', { selectElement, valueInput, cardIdInput });
        return;
    }

    const selectedEquipment = selectElement.value;
    const rawValue = valueInput.value.trim();
    const cardId = cardIdInput.value;

    // Validation
    if (!cardId) {
        alert('Invalid card ID!');
        return;
    }
    if (!selectedEquipment) {
        alert('Please select an equipment!');
        return;
    }
    if (!rawValue || isNaN(rawValue)) {
        alert('Please enter a valid numeric value!');
        return;
    }

    // Equipment ke hisaab se unit add karo
    let formattedValue;
    switch (selectedEquipment) {
        case 'temperature':
            formattedValue = `${rawValue}°C`;
            break;
        case 'humidity':
            formattedValue = `${rawValue}%`;
            break;
        case 'voltage':
            formattedValue = `${rawValue}V`;
            break;
        case 'current':
            formattedValue = `${rawValue}A`;
            break;
        case 'pressure':
            formattedValue = `${rawValue}Pa`;
            break;
        case 'ph':
            formattedValue = `${rawValue} pH`;
            break;
        case 'air_quality':
            formattedValue = `${rawValue} AQI`;
            break;
        case 'frequency':
            formattedValue = `${rawValue} Hz`;
            break;
        case 'battery_voltage':
            formattedValue = `${rawValue} V`;
            break;
        default:
            formattedValue = rawValue;
    }

    // Equipment naam ko capitalize karke label banao
    const equipmentLabel = selectedEquipment.charAt(0).toUpperCase() + selectedEquipment.slice(1);

    // LocalStorage mein save karo
    let cardMappings = JSON.parse(localStorage.getItem('cardMappings') || '{}');
    cardMappings[cardId] = {
        equipment: selectedEquipment,
        label: equipmentLabel,
        value: formattedValue
    };
    localStorage.setItem('cardMappings', JSON.stringify(cardMappings));

    // API ke through database update karo
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/Card/${cardId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                card_id: cardId,
                card_name: selectedEquipment,
                card_value: parseFloat(rawValue)
            })
        });

        if (response.ok) {
            alert(`Card updated! Showing ${equipmentLabel} with value ${formattedValue}`);
            window.location.href = '/dashboard/';
        } else {
            const errorData = await response.text();
            console.error('Failed to update card:', response.status, errorData);
            alert(`Failed to update card: ${errorData}`);
        }
    } catch (error) {
        console.error('Error updating card:', error);
        alert('Error updating card. Please try again.');
    }
}