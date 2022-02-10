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
    const page = `
        <div class="calculator" id="calculator">
            <div class="position-relative">
                <div class="calculator-top-bar" id="calculator-movement"></div>    
                <div class="calculator-content">
                    <h1>Calculator</h1>
                    <div>
                        <textarea placeholder="Calculator history" class="calculator-history"></textarea>
                        <input placeholder="Input" class="inputDisplay" id="calculator-input"></input>
                    </div>
                    <div class="keypad">
                        <div class="button-block">
                            <div class="btn btn-light" onclick="clearInput()">C</div>
                            <div class="btn btn-light" onclick="deleteCharacter()"><</div>
                            <div class="btn btn-light" onclick="insertCharacter('%')">%</div>
                            <div class="btn btn-light" onclick="insertCharacter('/')">&divide;</div>
                        </div>
                        <div class="button-block">
                            <div class="btn btn-light" onclick="insertCharacter('7')">7</div>
                            <div class="btn btn-light" onclick="insertCharacter('8')">8</div>
                            <div class="btn btn-light" onclick="insertCharacter('9')">9</div>
                            <div class="btn btn-light" onclick="insertCharacter('*')">*</div>
                        </div>
                        <div class="button-block">
                            <div class="btn btn-light" onclick="insertCharacter('4')">4</div>
                            <div class="btn btn-light" onclick="insertCharacter('5')">5</div>
                            <div class="btn btn-light" onclick="insertCharacter('6')">6</div>
                            <div class="btn btn-light" onclick="insertCharacter('-')">&mdash;</div>
                        </div>
                        <div class="button-block">
                            <div class="btn btn-light" onclick="insertCharacter('1')">1</div>
                            <div class="btn btn-light" onclick="insertCharacter('2')">2</div>
                            <div class="btn btn-light" onclick="insertCharacter('3')">3</div>
                            <div class="btn btn-light" onclick="insertCharacter('+')">+</div>
                        </div>
                        <div class="button-block">
                            <div class="btn btn-light btn-0" onclick="insertCharacter('0')">0</div>
                            <div class="btn-0 d-flex"> 
                                <div class="btn btn-light" onclick="insertCharacter('.')">&bull;</div>
                                <div class="btn btn-light" onclick="result()">&#61;</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="calculator-bottom-scale" id="calculator-bottom-scale"></div>
            </div>
        </div>
    `;
        return {page: page, setupCallback: () => {
            setupCalculatorPositionHandler()
            setupCalculatorResizeHandler()
    }}
}

let exec = false;
let numOfTimes = 1;

function setupCalculatorPositionHandler() {
    const calculatorTopBar = document.querySelector('#calculator-movement');
    const calculator = document.querySelector('#calculator');
    calculatorTopBar.onmousedown = function(event) {
        let shiftX = event.clientX - calculatorTopBar.getBoundingClientRect().left;
        let shiftY = event.clientY - calculatorTopBar.getBoundingClientRect().top;
      
        calculator.style.position = 'absolute';
        calculator.style.zIndex = 1000;
        // document.body.append(ball);
        
        moveAt(event.pageX, event.pageY);
        
        // переносит мяч на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
            calculator.style.left = pageX - shiftX + 'px';
            calculator.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить мяч, удалить ненужные обработчики
        calculatorTopBar.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          calculatorTopBar.onmouseup = null;
        };
      
      };
      
      calculatorTopBar.ondragstart = function() {
        return false;
      };
}

function setupCalculatorResizeHandler() {
    const calculatorBottomScale = document.querySelector('#calculator-bottom-scale');
    const calculator = document.querySelector('#calculator');
    calculatorBottomScale.onmousedown = function(event) {
        let initCursorX = event.clientX;
        let initCursorY = event.clientY;

        const initWidth = calculator.getBoundingClientRect().right - calculator.getBoundingClientRect().left;
        const initHeight = calculator.getBoundingClientRect().bottom - calculator.getBoundingClientRect().top;
      
        function resize(pageX, pageY) {
            calculator.style.width = initWidth + pageX - initCursorX + 'px';
            calculator.style.height = initHeight + pageY - initCursorY + 'px';
        }
      
        function onMouseMove(event) {
          resize(event.pageX, event.pageY);
        }
      
        // передвигаем мяч при событии mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // отпустить мяч, удалить ненужные обработчики
        document.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          calculatorBottomScale.onmouseup = null;
        };
      
      };
      
      calculatorBottomScale.ondragstart = function() {
        return false;
      };
}

function deleteCharacter() {
    let currentValue = $('#calculator-input').val();
	$('.inputDisplay').val(currentValue.substring(0, currentValue.length - 1));
}

function clearInput() {
    $('.inputDisplay').val('');
}

function insertCharacter(char) {
    if(exec == true) {
        $('.inputDisplay').val('');
        exec = false;
    }
    let currentValue = $('.inputDisplay').val();
    let flag = false;
    if( char == '+' || char == '-' || char == '*' || char == '/') {
        flag = true;
    }
    if(currentValue.length == 0 & flag == true) {
        return;
    }

    let lastChar = currentValue.substring(currentValue.length-1, currentValue.length);
    let sFlag = false;
    if(lastChar == '+' || lastChar == '-' || lastChar == '*' || lastChar == '/') {
        sFlag = true;
    }
    if(flag == true && sFlag == true) { 
        console.log('check');
        $('.inputDisplay').val(currentValue.substring(0, currentValue.length-1) + char);
    } else {
        $('.inputDisplay').val(currentValue + char);
    }
}

function result() {
    exec = true;
    let currentValue = $('.inputDisplay').val();
    let histVal = $('.calculator-history').val();
	let length = currentValue.length;
	let flag = false;
	let char = currentValue[length-1];
	if(char == '+' || char == '-' || char == '*' || char == '/')
	    flag = true;
	if(flag) {
		$('.inputDisplay').val("ERROR!");
    }
	else {
        $('.inputDisplay').val(currentValue + "=" + eval(currentValue));
        $('.calculator-history').val(numOfTimes + ". " + currentValue + "=" + eval(currentValue) + '\n' + histVal);
        numOfTimes = numOfTimes + 1;
    }
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
    const {page, setupCallback} = ({ 
        'clock-button': showClockPage,
        'stopwatch-button': showStpWchPage,
        'calculator-button': showCalculatorPage,
        'weather-button': showWeatherPage,
        'reload-button': reload
    })[id]();

    $("#router-view").html(page);
    setupCallback();
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