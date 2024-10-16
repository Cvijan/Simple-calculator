const binaryOperations = ['+','-','×','÷','%']
const unaryOperations = ['1/x', 'x²', '√x', '+/-']

const buttons = [
    { value: binaryOperations[4], design: 'dark'},
    { value: 'CE', design: 'dark'},
    { value: 'C', design: 'dark'},
    { value: '←', design: 'dark'},
    { value: unaryOperations[0], design: 'dark'},
    { value: unaryOperations[1], design: 'dark'},
    { value: unaryOperations[2], design: 'dark'},
    { value: binaryOperations[3], design: 'dark'},
    { value: '7', design: 'light'},
    { value: '8', design: 'light'},
    { value: '9', design: 'light'},
    { value: binaryOperations[2], design: 'dark'},
    { value: '4', design: 'light'},
    { value: '5', design: 'light'},
    { value: '6', design: 'light'},
    { value: binaryOperations[1], design: 'dark'},
    { value: '1', design: 'light'},
    { value: '2', design: 'light'},
    { value: '3', design: 'light'},
    { value: binaryOperations[0], design: 'dark'},
    { value: unaryOperations[3], design: 'dark'},
    { value: '0', design: 'light'},
    { value: ',', design: 'dark'},
    { value: '=', design: 'equals'}
]

const buttonsElement = document.querySelector('#buttons')
const displayElement = document.querySelector('#display')
const displayExpressionElement = document.querySelector('#display-formula')

let current = 0
let isUpdating = false
let isUnaryDisplay = false
let expression = []

updateDisplay()

buttons.forEach(x => {
    const tmp = document.createElement('button')
    tmp.innerText = x.value
    tmp.className = x.design

    tmp.addEventListener('click', () => {
        nextToken(x.value)
    })

    buttonsElement.appendChild(tmp)
})

function updateDisplay() {
    if(Math.abs(current) === Infinity || isNaN(current))
        current = 'ERROR'
    
    displayElement.innerText = current.toString().slice(0,10)
    displayExpressionElement.innerText = expression.join('')
}

function nextToken(next) {
    fixDisplay(next)

    if(isNumber(next))
        numberToken(next)
    else if(isBinary(next))
        binaryOperationToken(next)
    else if(isUnary(next))
        unaryOperationToken(next)
    else if(next === ',')
        dotToken()
    else if(next === '=')
        equals()
    else if(next === 'C')
        clearAll()
    else if(next === 'CE')
        clearCurrent()
    else if(next === '←')
        clearLast()

    updateDisplay()
}

function numberToken(next) {
    if(isUpdating) {
        current += next
        return
    }

    current = next
    isUpdating = true

    if(!current.includes('.'))
        current = Number(current)
}

function dotToken() {
    if(isUpdating && !current.toString().includes('.')) {
        current += '.'
    }

    if(!isUpdating) {
        current = '0.'
        isUpdating = true
    }
}

function binaryOperationToken(next) {
    if(expression.length === 3) {
        const tmp = evaluate(expression, current)
        expression = [tmp, next]
        current = tmp
        isUpdating = false
        return
    }
    if(expression.length > 1 && !isUpdating) {
        expression[expression.length - 1] = next
        return
    }

    if(expression.length == 0) {
        expression.push(Number(current))
        expression.push(next)
        isUpdating = false
        return
    }

    if(expression.length == 1) {
        expression.push(next)
        isUpdating = false
        return
    }

    if(expression.length > 0 && isUpdating) {
        const tmp = evaluate(expression, current)
        expression = [tmp, next]
        current = tmp
        isUpdating = false
        return
    }
}

function unaryOperationToken(next) {
    const [res, display] = evaluateUnary(next)

    current = res
    expression.push(display)
    isUpdating = false
    isUnaryDisplay = true
}

function equals() {
    if(!expression[0] || !expression[1] || expression.includes('='))
        return

    expression.push(current, '=')
    current = evaluate(expression, current)
    isUpdating = false
}

function evaluate(expression, current) {
    switch(expression[1]){
        case '+':
            return Number(expression[0]) + Number(current)
        case '-':
            return Number(expression[0]) - Number(current)
        case '×':
            return Number(expression[0]) * Number(current)
        case '÷':
            return Number(expression[0]) / Number(current)
        case '%':
            return Number(expression[0]) % Number(current)
    }
}

function evaluateUnary(op) {
    switch(op){
        case '1/x':
            return [1 / Number(current), `1/(${current})`]
        case 'x²':
            return [Number(current) * Number(current), `(${current})²`]
        case '√x':
            return [Math.sqrt(Number(current)), `√(${current})`]
        case '+/-':
            return [-Number(current), `-(${current})`]
    }
}

function fixDisplay(next) {
    if(isUnaryDisplay) {
        if(isBinary(next)){
            expression[expression.length - 1] = current
        }
        else {
            expression.pop()
        }

        isUnaryDisplay = false
    }
    if(expression.includes('=') && isUnary(next)){
        expression = []
        return
    }
    else if(expression.includes('=')) {
        expression = [current]
    }
}

function clearAll() {
    expression = []
    current = 0
    isUpdating = false
}

function clearCurrent() {
    current = 0
    isUpdating = false
}

function clearLast() {
    current = current.toString().slice(0, -1)
    if(current.length === 0){
        current = 0
        isUpdating = false
    }
}

function isNumber(n) {
    return !isNaN(n) && !isNaN(parseInt(n))
}

function isBinary(n) {
    return binaryOperations.includes(n)
}

function isUnary(n) {
    return unaryOperations.includes(n)
}

