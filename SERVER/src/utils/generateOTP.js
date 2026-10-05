import crypto from "crypto";

const generateOTP = () => {
    return crypto
        .randomInt(100000, 1000000)
        .toString();
};

export default generateOTP;