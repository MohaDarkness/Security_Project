var p, q, e, n, phi, d;

function check1() {
    p = document.getElementById("pValue").value;
    console.log(p);
    p = math.bignumber(p);
    if (p < 99999999999999999999) {
        if (math.isPrime(p)) {
            console.log(p);
            document.getElementById("qValue").removeAttribute("readonly");
            console.log("now you can use the second!");
        }
        else{
            alert("Not a prime number!!\nPlease enter another number and it must be prime.");
        }
    }
    else {
        console.log(p);
        document.getElementById("qValue").removeAttribute("readonly");
        console.log("now you can use the second!");
    }
}

function check2() {
    q = document.getElementById("qValue").value;
    q = math.bignumber(q);

    if (q < 99999999999999999999) {
        if (math.isPrime(q)) {
            calculateValues();
            document.getElementById("eValue").removeAttribute("readonly");
            console.log("now you can use the third!");
        }
        else{
            alert("Not a prime number!!\nPlease enter another number and it must be prime.");
        }
    }
    else {
        calculateValues();
        document.getElementById("eValue").removeAttribute("readonly");
        console.log("now you can use the third!");
    }
}

function calculateValues() {
    n = p * q;
    if (p == q)
        phi = (p - 1) * q;
    else
        phi = (p - 1) * (q - 1);

    n = math.bignumber(n);
    phi = math.bignumber(phi);
    console.log("This is p:", p * 1);
    console.log("This is q:", q * 1);
    console.log("This is n:", n * 1);
    console.log("This is phi:", phi * 1);
}

function check3() {
    e = document.getElementById("eValue").value;
    e = math.bignumber(e);
    if (math.gcd(e, phi) == 1 && e*1 > 1 && e*1 < phi) {
        console.log(e);
        document.getElementById("plaintext").removeAttribute("readonly");
        calculateD(e, phi);
    }
    else {
        alert("Invalid value of e!!\nPlease enter another number and make sure it is a coprime with phi="+phi+" and it must be 1 < e < phi.");
        console.log("Wrong E!!");
    }
}

function calculateD(E, Phi) {
    console.log("This is E and Phi before the algo: ", E, Phi);
    var a, b, c;
    [a, b, c] = math.xgcd(e, phi);
    d = b["value"];
    if (d < 0) {
        while (d < 0) {
            d = math.add(d, phi);
        }
    }
    console.log("This is d: ", d * 1);
}

var Plain, plainSplit, Cipher, cipherSplit, plainAgain, plainAgainSplit;

function takePlain() {
    Plain = document.getElementById("plaintext").value;
    console.log("This is the plaintext:",Plain);
    plainSplit = Plain.split("");
    for (let i = 0; i < plainSplit.length; i++) {
        plainSplit[i] = '' + plainSplit[i].charCodeAt(0);
        if ('' + plainSplit[i] < 100) 
            plainSplit[i] = "0" + plainSplit[i];
        
    }
    console.log("Plaintext converted to ascii array: ", plainSplit);
    
    protocol();
}
var protocolNum;
function protocol() {
    var nTmp = n * 1, len = 3, counter = 1;
    nTmp = '' + nTmp;

    if (nTmp.length > len) {
        while (len * (counter + 1) <= nTmp.length)
            counter++;
    }
    protocolNum = counter;
    console.log("This is protocolNum: ", protocolNum);
    prepare();
}

function prepare() {
    var tmpSplit = plainSplit;
    plainSplit = [];
    var st = '' + tmpSplit[0];
    for (var i = 1; i < tmpSplit.length; i++) {
        if (i % protocolNum == 0) {
            plainSplit.push(st);
            st = tmpSplit[i];
        }
        else {
            st += tmpSplit[i];
        }
    }
    if (st != tmpSplit[tmpSplit.length - 1]) {
        while (st.length < protocolNum * 3) {
            st += '0';
        }
        plainSplit.push(st);
    }
    else{
        plainSplit.push(st);
    }
    console.log("Plaintext converted to ascii blocks: ", plainSplit);

    lowLevelEncryption();
}


function powerMod(x, y, p)
{
    // Initialize result
    let res = 1;
 
    // Update x if it is more
    // than or equal to p
    x = x % p;
 
    if (x == 0)
        return 0;
 
    while (y > 0)
    {
        // If y is odd, multiply
        // x with result
        if (y & 1)
            res = (res * x) % p;
 
        // y must be even now
         
        // y = $y/2
        y = y >> 1;
        x = (x * x) % p;
    }
    return res;
}

function lowLevelEncryption() {
    var tmpNum;
    cipherSplit = [];
    // console.log("This is n, n*1:", n, n * 1);
    for (var i = 0; i < plainSplit.length; i++) {
        tmpNum = math.bignumber(plainSplit[i]);
        tmpNum = powerMod(tmpNum, e, n);
        cipherSplit.push('' + tmpNum);
    }
    // console.log("This is cipherSplit: ", cipherSplit);

    highLevelEncryption();
}

function highLevelEncryption() {
    Cipher = '';
    for (var i = 0; i < cipherSplit.length; i++) {
        var tmpConv = cipherSplit[i][0];
        for (var j = 1; j < 3 * protocolNum; j++) {
            if (j % 3 == 0) {
                tmpConv = parseInt(tmpConv);
                if (tmpConv > 126)
                    tmpConv %= 126;
                if (tmpConv < 32)
                    tmpConv += 32;
                Cipher += String.fromCharCode(tmpConv);
                tmpConv = cipherSplit[i][j];
            }
            else {
                tmpConv += cipherSplit[i][j];
            }
        }
        tmpConv = parseInt(tmpConv);
        if (tmpConv > 126)
            tmpConv %= 126;
        if (tmpConv < 32)
            tmpConv += 32;
        Cipher += String.fromCharCode(tmpConv);
    }
    console.log("This is the ciphertext:",Cipher);
    lowLevelDecrypt();
}



function lowLevelDecrypt(){
    plainAgainSplit = [];
    tmpCipherSplit = cipherSplit;
    var tmp = 0;
    console.log(cipherSplit);
    for(var i = 0; i < tmpCipherSplit.length; i++){
        tmp = math.bignumber(tmpCipherSplit[i]);
        // console.log("This is tmp before pow:",tmp*1);
        // tmp = math.pow(tmp, d);
        // console.log("This is tmp before mod:",tmp*1);
        // tmp = math.mod(tmp, n);
        // console.log("This is tmp before push:",tmp*1);
        // plainAgainSplit.push(''+tmp);
        tmp = powerMod(tmp, d, n);
        console.log("This is tmp:",tmp);
        plainAgainSplit.push(''+tmp);
    }
    for(var i = 0; i < plainAgainSplit.length; i++){
        var st = '';
        for(var j = 0; j < protocolNum*3 - plainAgainSplit[i].length; j++)
            st += '0';
        
        plainAgainSplit[i] = st + plainAgainSplit[i];
    }
    highLevelDecryption()
}

function highLevelDecryption(){
    if(protocolNum != 1){
        var tmpSplit = plainAgainSplit;
        plainAgainSplit = []
        for(var i = 0; i < tmpSplit.length; i++){
            var newNum = tmpSplit[i][0];
            for(j = 1; j < protocolNum*3; j++){
                if(j % 3 == 0){
                    plainAgainSplit.push(newNum);
                    newNum = tmpSplit[i][j];
                }   
                else{
                    newNum += tmpSplit[i][j];
                }
            }
            plainAgainSplit.push(newNum);
        }
    }

    // console.log(plainAgainSplit);
    plainAgain = '';
    for(var i = 0; i < plainAgainSplit.length; i++){
        plainAgain += String.fromCharCode(parseInt(plainAgainSplit[i]));
    }
    console.log("This is plainSplit:",plainSplit)
    console.log("This is cipherSplit:",cipherSplit)
    console.log("This is plainAgainSplit:",plainAgainSplit);
    console.log("This is the plain Again:",plainAgain);
    alert("n: "+(n*1)+"\np: "+(p*1)+"\nq: "+(q*1)+"\nphi: "+(1*phi)+"\ne: "+(e*1)+ "\nPublic Key: ("+(e*1)+","+(n*1)+")\nPrivate Key: ("+(d*1)+","+(1*phi)+") \nCipher Text-> "+Cipher+"\nDecrypted Text-> "+plainAgain);
}
