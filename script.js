function showClockPage() {
    const page = `
        <div>
            <h1>Clock</h1>
            <p>Clock page</p>
        </div>
    `;
    return {page: page, setupCallback: () => {}}
}

function showStpWchPage() {
    const page = `
        <div>
            <h1>Stopwatch</h1>
            <p>Stopwatch page</p>
        </div>
    `;
    return {page: page, setupCallback: () => {}}
}
function showCalculatorPage() {
    const calculator = new AppCalculator(document.getElementById('router-view'));
    const closeHandler = function(event) {
        document.removeEventListener(closeHandler);
        delete calculator;
    }
    document.addEventListener("destroy", closeHandler);
}

function showWeatherPage() {
    const page = `
        <div>
            <h1>Weather</h1>
            <p>Weather page</p>
        </div>
    `;
    return {page: page, setupCallback: () => {}}
}

function reload() {     // Reload page function
    return {
        page: '',
        setupCallback: () => {
            location.reload();
            console.log('reload!');
        }
    }
}

function onMenuItemClick(id) {
    ({ 
        'clock-button': showClockPage,
        'stopwatch-button': showStpWchPage,
        'calculator-button': showCalculatorPage,
        'weather-button': showWeatherPage,
        'reload-button': reload
    })[id]();
}

$( document ).ready(function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $('.aside-menu-item').on("click", function() {
        onMenuItemClick($(this).attr('id'))
    });
} );