class AppCalculator {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.id = (new Date()).getTime();
        this.render();
        this.setupButtonsHandler();
        this.setupCalculatorPositionHandler();
        this.setupCalculatorResizeHandler();
        this.exec = false;
        this.numOfTimes = 1;
    }

    render() {
        const page = `
            <div class="calculator" id="${this.id}">
                <div class="position-relative">
                    <div class="calculator-top-bar" id="calculator-movement">
                        <button class="btn close-icon">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </div>    
                    <div class="calculator-content">
                        <h1>Calculator</h1>
                        <div>
                            <textarea placeholder="Calculator history" class="calculator-history"></textarea>
                            <input placeholder="Input" class="inputDisplay" id="calculator-input"></input>
                        </div>
                        <div class="keypad">
                            <div class="button-block">
                                <div class="btn btn-light" data-clear>C</div>
                                <div class="btn btn-light" data-delete-char><</div>
                                <div class="btn btn-light" data-char="%">%</div>
                                <div class="btn btn-light" data-char="/">&divide;</div>
                            </div>
                            <div class="button-block">
                                <div class="btn btn-light" data-char="7">7</div>
                                <div class="btn btn-light" data-char="8">8</div>
                                <div class="btn btn-light" data-char="9">9</div>
                                <div class="btn btn-light" data-char="*">*</div>
                            </div>
                            <div class="button-block">
                                <div class="btn btn-light" data-char="4">4</div>
                                <div class="btn btn-light" data-char="5">5</div>
                                <div class="btn btn-light" data-char="6">6</div>
                                <div class="btn btn-light" data-char="-">&mdash;</div>
                            </div>
                            <div class="button-block">
                                <div class="btn btn-light" data-char="1">1</div>
                                <div class="btn btn-light" data-char="2">2</div>
                                <div class="btn btn-light" data-char="3">3</div>
                                <div class="btn btn-light" data-char="+">+</div>
                            </div>
                            <div class="button-block">
                                <div class="btn btn-light btn-0" data-char="0">0</div>
                                <div class="btn-0 d-flex"> 
                                    <div class="btn btn-light" data-char=".">&bull;</div>
                                    <div class="btn btn-light" data-result-button>&#61;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="calculator-bottom-scale" id="calculator-bottom-scale"></div>
                </div>
            </div>
        `;
        this.rootNode.insertAdjacentHTML('beforeend', page);
    }

    setupButtonsHandler() {
        console.log('setupButtonsHandler');

        const self = this;

        $(`#${this.id}.calculator div[data-clear]`).click(function() {
            self.clearInput();
        });
        
        $(`#${this.id}.calculator div[data-delete-char]`).click(function() {
            self.deleteCharacter();
        });

        $(`#${this.id}.calculator div[data-char]`).click(function() {
            const char = $(this).attr('data-char');
            self.insertCharacter(char);
        });
        
        $(`#${this.id}.calculator div[data-result-button]`).click(function() {
            self.result();
        });

        $(`#${this.id} .close-icon`).click(() => this.destroy());
    }

    setupCalculatorPositionHandler() {
        console.log('setupCalculatorPositionHandler');

        const calculatorTopBar = $(`#${this.id} .calculator-top-bar`)[0];
        const calculator = document.getElementById(this.id);
        const self = this;
        calculatorTopBar.onmousedown = function(event) {
            let shiftX = event.clientX - calculatorTopBar.getBoundingClientRect().left;
            let shiftY = event.clientY - calculatorTopBar.getBoundingClientRect().top;
        
            calculator.style.position = 'absolute';
            calculator.style.zIndex = 1000;
            
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

    setupCalculatorResizeHandler() {
        console.log('setupCalculatorResizeHandler');

        const calculatorBottomScale = $(`#${this.id} #calculator-bottom-scale`)[0];
        const calculator = document.getElementById(this.id);
        const self = this;
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

    deleteCharacter() {
        console.log('deleteCharacter');

        let currentValue = $(`#${this.id} #calculator-input`).val();
        $(`#${this.id} .inputDisplay`).val(currentValue.substring(0, currentValue.length - 1));
    }

    clearInput() {
        console.log('clearInput');

        $(`#${this.id} .inputDisplay`).val('');
    }

    insertCharacter(char) {
        console.log('insertCharacter')

        if(this.exec == true) {
            $(`#${this.id} .inputDisplay`).val('');
            this.exec = false;
        }
        let currentValue = $(`#${this.id} .inputDisplay`).val();
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
            $(`#${this.id} .inputDisplay`).val(currentValue.substring(0, currentValue.length-1) + char);
        } else {
            $(`#${this.id} .inputDisplay`).val(currentValue + char);
        }
    }

    result() {
        console.log('result');

        this.exec = true;
        let currentValue = $(`#${this.id} .inputDisplay`).val();
        let histVal = $(`#${this.id} .calculator-history`).val();
        let length = currentValue.length;
        let flag = false;
        let char = currentValue[length-1];
        if(char == '+' || char == '-' || char == '*' || char == '/')
            flag = true;
        if(flag) {
            $(`#${this.id} .inputDisplay`).val("ERROR!");
        }
        else {
            $(`#${this.id} .inputDisplay`).val(currentValue + "=" + eval(currentValue));
            $(`#${this.id} .calculator-history`).val(this.numOfTimes + ". " + currentValue + "=" + eval(currentValue) + '\n' + histVal);
            this.numOfTimes = this.numOfTimes + 1;
        }
    }

}