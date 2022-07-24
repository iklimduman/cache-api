const generateRandomStringValue = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let randomString = "";
    for ( let i = 0; i < length; i++ ) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomString;
}

module.exports.generateRandomStringValue = generateRandomStringValue ;