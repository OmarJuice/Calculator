$(document).ready(function () {

    let makingNumber; //boolean indicates if number is allowed to be written
    let allowSign; //+ or - sign, boolean
    let allowDecimal; // boolean true allows decimal placement
    let makingOp = false; //boolean if operation is being written
    let currentPhrase = 0; //indicates the current length of the expression -1,  a phrase can be a number OR am operator
    let lengthMax = false; //whether the current number has reached the calculator's limit of 14 digits
    let currentExp = ''; //the current phrase
    let reuse = false; //whether the value from the equation will be used for another calculation


    function clear() {
        $('#Expression').text('0')
        $('#Sign').text('')
        currentExp = '';
        lengthMax = false;
        if(makingOp){makingNumber = true}
        if (currentPhrase === 0) {
            $('#phrase0').text('0');
        }
        else if (currentPhrase > 0) {
            $(`#phrase${currentPhrase}`).remove();
            currentPhrase--;

        }
        if(reuse){reuse = false, clear()}
    }

    function clearAll(e,val = 0, bool = false) {
        e.preventDefault();
        $('#Expression').text('0');
        $('#Full').html('');
        $('#Sign').text('');
        currentExp = '';
        //reset phrase count
        currentPhrase = 0;
        makingOp = false;
        lengthMax = false;
        currentExp = '';
        $('.num').off();
        $('#sign').off();
        $('#decimal').off()
        $('.operator').off()
        makeExpression(bool, val);
    }

    $('#CE').on('click', clear);
    $('#AC').on('click', clearAll);
    
    function currentSpan(value = '') {//makes the next phrase as a new empty span by default.
        let currentType;
        if (makingNumber) { currentType = 'NUM' }
        else if (makingOp) { currentType = 'OP' }
        return `<span id="phrase${currentPhrase}" class="Phrase ${currentType}">${value}</span>`
    }
    function makeExpression(bool, value = 0) {
        
        $('#Equals').on('click', equals)
        makingNumber = true;
        allowDecimal = true;
        allowSign = false;
        $('#Full').html(currentSpan(value));
        if (bool) {
            currentPhrase++;
            $('#Full').append(currentSpan());
        }
        else if(!bool && value !== 0){
            currentExp = value;
            $('#Expression').text(currentExp);
            makingOp = true;
        }
        $('.num').on('click', makeNum);
        $('#sign').on('click', addSign);
        $('#decimal').on('click', addDecimal)
        $('.operator').on('click', operation)
    }
    makeExpression(false);

    function makeNum() {
        if (makingOp && !makingNumber && !lengthMax) {
            currentPhrase++;
            makingOp = false;
            makingNumber = true;

            $('#Full').append(currentSpan());
            currentExp = '';
            allowDecimal = true;
            allowSign = true;
            $('#Expression').text('0');
        }
        if (makingNumber) {
            allowSign = true;
            if ($('#Expression').text() === '0') {
                $('#Expression').text('');
            }
            let num = this.id[1];
            currentExp = currentExp + num;
            $('#Expression').text(currentExp);
            $(`#phrase${currentPhrase}`).text(val.textContent)
            makingOp = true;    //an operator is only allowed after at least one number
        }
        if ($('#Expression').text().length > 14) {
            makingNumber = false;
            lengthMax = true;
        }
    }
    function addSign() {
        if (allowSign) {    //prevent sign from being written with an operator
            if ($('#Sign').text() === '') {
                $('#Sign').text('-');  
            }
            else if ($('#Sign').text() === '-') {
                $('#Sign').text('');
            };
            if (makingNumber) {
                $(`#phrase${currentPhrase}`).text(val.textContent)
            }
        }
    }
    function addDecimal() {
        if (allowDecimal) { //prevent decimal from being written twice or with an operator
            currentExp = currentExp + '.';
            $('#Expression').text(currentExp);
            $(`#phrase${currentPhrase}`).text(val.textContent)
            allowDecimal = false;

        }
    }

    function operation() {
        if ((makingNumber || lengthMax) && makingOp) {
            makingNumber = false;
            currentPhrase++;
            currentExp = '';
            $('#Full').append(currentSpan());
            $('#Sign').text('')
            allowSign = false;
            currentExp = '';
            makingOp = true;
            lengthMax = false;
            allowDecimal = false;
            allowSign = false;
            currentExp = this.id[1];
            $('#Expression').text(currentExp);
            $(`#phrase${currentPhrase}`).text(currentExp)
        }

    }
    
    function equals() {
        let text = $('#Full').text();
        text = text.replace(/[+*/-]$/, '')//clears operator from the end of the expression if any
        let result = eval(text);
        let resultSpan = `<span id="finalVal">=${result}</span>`
        $('#Full').append(resultSpan);
        $('#Expression').text(result)
        $('#Sign').text('');
        currentPhrase = 0
        makingNumber = false;
        allowSign= false
        allowDecimal=false
        makingOp = false;
        currentPhrase = '';
        lengthMax = false;
        currentExp = '';
        $('#Equals').off(); //prevents multiple invocations of this function 
        $('.operator').on('click', function (e) {
            clearAll(e, `${result}${$(this).attr('id')[1]}`, true)  //passes the result if an operator is clicked
            reuse = true;
        });
        $('.num').on('click', function (e) {
            clearAll(e, `${$(this).attr('id')[1]}`, false)  //clears the result if a number is clicked
        })
    };



});
