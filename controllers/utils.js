const crypto = require("crypto");

exports.gernateRandonString = (length) => {
    try {
        const otp = crypto.randomInt(100000, 1000000).toString();
        return otp;
    }
    catch (err) {
        console.error("Error generating random string:", err);
        throw err;
    }
};




