# SmartDash

A dynamic and interactive dashboard application designed to monitor and visualize real-time data including temperature, humidity, voltage, and current. Built with HTML, CSS, JavaScript, and Django, this project features customizable cards, line charts for trends, and dynamic pie charts for data distribution.

## Features
- **Real-Time Data Visualization**: Line charts (`myChart1` for Temperature/Humidity, `myChart2` for Voltage/Current) to track trends over time.
- **Dynamic Pie Chart**: Displays the proportional distribution of the latest card values (e.g., temperature, humidity, voltage, current).
- **Customizable Cards**: Editable labels and values with local storage synchronization for persistence.
- **Responsive Design**: Fully functional across desktops, tablets, and mobile devices.
- **API Integration**: Fetches and updates data via RESTful endpoints.
- **Data Sampling**: Limits chart data points (max 50) for optimal performance and readability.

## Prerequisites
- **Python 3.x**
- **Django** (with `djangorestframework` for API)
- **Node.js** (optional, for frontend dependencies if expanded)
- **Git** (for version control)

## Installation

### 1. Clone the Repository
Clone the project to your local machine:

```bash
git clone https://github.com/Shreshtha03/SmartDash.git
cd SmartDash
```

### 2. Set Up Backend (Django)
Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install required Python packages:

```bash
pip install django djangorestframework
```

Set up the database (if using models):

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### 3. Set Up Frontend
Ensure all static files are in the `static` folder:
- `css/style.css` for styling
- `js/first.js` for JavaScript logic

No additional Node.js setup is required unless you add more libraries.

### 4. Run the Application
Open your browser and navigate to `http://127.0.0.1:8000/` to access the dashboard.

## Usage
- **Cards**: Click the "Edit" button on any card to modify its equipment and value. Changes are saved in the browser's local storage.
- **Charts**:
  - **Line Charts**: `myChart1` shows Temperature (°C) and Humidity (%), while `myChart2` displays Voltage (V) and Current (A).
  - **Pie Chart**: Visualizes the latest values of all cards as a percentage distribution.
- **API Endpoints**:
  - `/api/Temperature/`: Fetches temperature data.
  - `/api/Humidity/`: Fetches humidity data.
  - `/api/Voltage/`: Fetches voltage data.
  - `/api/Current/`: Fetches current data.
  - `/api/Card/`: Manages card configurations and values.

## Project Structure
```
SmartDash/
├── dashboard/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # CSS for dashboard styling
│   │   └── js/
│   │       └── first.js     # JavaScript for charts and card logic
│   ├── templates/
│   │   └── index.html       # Main HTML template
│   └── views.py            # Django views for API and pages
├── manage.py                # Django management script
└── README.md                # This file
```

## Contributing
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature or fix"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request with a clear description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE.md` file for details.

## Acknowledgements
- **Chart.js**: Powers the line and pie chart visualizations.
- **Django Community**: Provides the robust backend framework.
- **Ayush**: The developer behind this innovative dashboard!

## Screenshots
To be added once the dashboard is fully styled.
- **Dashboard Overview**: <img src="screentshot/dashboard.png
" alt="Dashboard Overview">
- **Django admin**: <img src="![admin img](https://github.com/user-attachments/assets/09d8238e-1d1f-4105-864d-28ca3c5738fb)
![admin img](https://github.com/user-attachments/assets/09d8238e-1d1f-4105-864d-28ca3c5738fb)
" alt="admin panel">

*Note*: Create a `screenshots/` folder, upload images, and update the paths above.

## Troubleshooting
- **API Not Loading**: Ensure the Django server is running and API endpoints are correctly defined in `views.py`.
- **Charts Not Displaying**: Check the browser console (F12) for errors and ensure `first.js` is loaded in `index.html`.
- **Card Updates Failing**: Verify `localStorage` is accessible and `/api/Card/` returns valid JSON.
