var p, q, e, n, phi, d;

function isPrime(num) {
    for (let i = 2, s = num; i * i <= s; i++)
        if (num % BigInt(i) === 0) return false;

    return num > 1;
}

function egcd(a, b) {
    var Phi = b;
    if (a < b) [a, b] = [b, a];
    let s = BigInt(0), old_s = BigInt(1);
    let t = BigInt(1), old_t = BigInt(0);
    let r = b, old_r = a;
    while (r != 0) {
        let q = old_r / r;
        [r, old_r] = [old_r - q * r, r];
        [s, old_s] = [old_s - q * s, s];
        [t, old_t] = [old_t - q * t, t];
    }

    if (old_t < BigInt(0)) {
        while (old_t < BigInt(0)) {
            old_t += Phi;
        }
    }
    return ([old_r, old_t]); // [GCD, Inv]
}

function powerMod(x, y, p) {
    // Initialize result
    let res = BigInt(1);

    // Update x if it is more
    // than or equal to p
    x = x % p;

    if (x == 0)
        return 0;

    while (y > 0) {
        // If y is odd, multiply
        // x with result
        if (y & BigInt(1))
            res = res * x % p;

        // y must be even now

        // y = $y/2
        y = y / BigInt(2);
        x = x * x % p;
    }
    return res;
}


function check1() {
    p = document.getElementById("pValue").value;
    console.log(p);
    p = BigInt(p);
    if (p < 99999999999999) {
        if (isPrime(p)) {
            console.log(p);
            document.getElementById("qValue").removeAttribute("readonly");
            console.log("now you can use the second!");
        }
        else {
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
    q = BigInt(q);

    if (q < 99999999999999) {
        if (isPrime(q)) {
            calculateValues();
            document.getElementById("eValue").removeAttribute("readonly");
            console.log("now you can use the third!");
        }
        else {
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
        phi = (p - BigInt(1)) * q;
    else
        phi = (p - BigInt(1)) * (q - BigInt(1));

    console.log("This is p:", p);
    console.log("This is q:", q);
    console.log("This is n:", n);
    console.log("This is phi:", phi);
}

function check3() {
    e = document.getElementById("eValue").value;
    e = BigInt(e);
    if (egcd(e, phi)[0] == 1 && e * BigInt(1) > 1 && e * BigInt(1) < phi) {
        console.log(e);
        document.getElementById("plaintext").removeAttribute("readonly");
        calculateD(e, phi);
    }
    else {
        alert("Invalid value of e!!\nPlease enter another number and make sure it is a coprime with phi=" + phi + " and it must be 1 < e < phi.");
        console.log("Wrong E!!");
    }
}

function calculateD(E, Phi) {
    console.log("This is E and Phi before the algo: ", E, Phi);
    d = egcd(e, phi)[1];
    console.log("This is d: ", d);
}

var Plain, plainSplit, Cipher, cipherSplit, plainAgain, plainAgainSplit, protocolList = [];

function takePlain() {
    Plain = document.getElementById("plaintext").value;
    console.log("This is the plaintext:", Plain);
    plainSplit = Plain.split("");
    for (let i = 0; i < plainSplit.length; i++) {
        plainSplit[i] = '' + plainSplit[i].charCodeAt(0);
        if ('' + plainSplit[i] < 100)
            plainSplit[i] = "0" + plainSplit[i];

    }
    console.log("Plaintext converted to ascii array: ", plainSplit);
    console.log("IN PROTOCOL!!");
    protocol();
}
var protocolNum;
function protocol() {

    var nTmp = n, len = 3, counter = 1;
    nTmp = '' + nTmp;

    if (nTmp.length > len) {
        var m = n;
        counter = 0;
        while (m > 1) {
            counter++;
            m = m / BigInt(10);
        }
        counter = Math.floor(counter / 3);
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
    else {
        plainSplit.push(st);
    }
    console.log("Plaintext converted to ascii blocks: ", plainSplit, typeof plainSplit[0]);

    if (n < 127)
        protocolList1();
    else {
        for (var i = 0; i < Plain.length; i++)
            protocolList.push(0);
    }

    lowLevelEncryption();
}

function protocolList1() {
    for (var i = 0; i < plainSplit.length; i++) {
        var div;
        div = BigInt(plainSplit[i]) / n;
        protocolList.push(div);
    }
    console.log("This is protocolList: ", protocolList);
};

function lowLevelEncryption() {
    var tmpNum;
    cipherSplit = [];
    for (var i = 0; i < plainSplit.length; i++) {
        tmpNum = BigInt(plainSplit[i]);
        tmpNum = powerMod(tmpNum, e, n);
        cipherSplit.push('' + tmpNum);
    }

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
    console.log("This is the ciphertext:", Cipher);
    lowLevelDecrypt();
}



function lowLevelDecrypt() {
    console.log("This is cipherSplit in lowleveldec:", cipherSplit);
    plainAgainSplit = [];
    tmpCipherSplit = cipherSplit;
    var tmp = 0;
    console.log(cipherSplit);
    for (var i = 0; i < tmpCipherSplit.length; i++) {
        tmp = BigInt(tmpCipherSplit[i]);
        tmp = powerMod(tmp, d, n);
        plainAgainSplit.push('' + tmp);
    }

    console.log(n);
    for (var i = 0; i < plainAgainSplit.length; i++) {
        var st = '', counter = 0, tmpNum = BigInt(plainAgainSplit[i]);

        while (tmpNum >= 1) {
            counter++;
            tmpNum = tmpNum / BigInt(10);
        }

        for (var j = 0; j < protocolNum * 3 - counter; j++)
            st += '0';

        plainAgainSplit[i] = st + plainAgainSplit[i];
    }
    console.log("This is plainAgainSplit before high-level: ", plainAgainSplit)
    highLevelDecryption()
}

function highLevelDecryption() {
    if (protocolNum != 1) {
        var tmpSplit = plainAgainSplit;
        plainAgainSplit = []
        for (var i = 0; i < tmpSplit.length; i++) {
            var newNum = tmpSplit[i][0];
            for (j = 1; j < protocolNum * 3; j++) {
                if (j % 3 == 0) {
                    if (newNum != '000')
                        plainAgainSplit.push(newNum);
                    newNum = tmpSplit[i][j];
                }
                else {
                    newNum += tmpSplit[i][j];
                }
            }
            if (newNum != '000')
                plainAgainSplit.push(newNum);
        }
    }

    console.log(plainAgainSplit);
    plainAgain = '';
    var fromProtocolList;
    for (var i = 0; i < plainAgainSplit.length; i++) {
        if (plainAgainSplit[i] == '000') {
            console.log("got you!! :D", i);
            continue;
        }
        fromProtocolList = BigInt(protocolList[i]) * n;
        fromProtocolList += BigInt(plainAgainSplit[i]);
        if (fromProtocolList != 0)
            plainAgain += String.fromCharCode(Number(fromProtocolList));
    }

    alert("n: " + (n) + "\np: " + (p) + "\nq: " + (q) + "\nphi: " + (phi) + "\ne: " + (e) + "\nPublic Key: (" + (e) + "," + (n) + ")\nPrivate Key: (" + (d) + "," + (phi) + ")");
    alert("This is Ciphertext:\n" + Cipher + "\n\nThis is Decrypted text:\n" + plainAgain);
    console.log(plainAgain);
}
