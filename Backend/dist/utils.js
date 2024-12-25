"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
const random = (size) => {
    const options = "qwertyuiopasdfghjklzxcvbnm123456789";
    let ans = "";
    const len = options.length;
    for (let i = 0; i < size; i++) {
        ans = ans + options[Math.floor(Math.random() * len)];
    }
    return (ans);
};
exports.random = random;
