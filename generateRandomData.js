const generateRandomStringValue = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomString = "";
    for ( let i = 0; i < length; i++ ) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    console.log(randomString) ;

    return randomString;
}

const generateRandomKey = () => {

}

module.exports.generateRandomKey = generateRandomKey ;
module.exports.generateRandomStringValue = generateRandomStringValue ;