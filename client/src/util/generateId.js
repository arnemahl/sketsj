const leftPad = (str, char, length) => Array(Math.max(0, length - str.length)).fill(char).join('') + str;

export default function generateId() {
    const length = 6;
    const secret = Number(String(Math.random()).slice(2)).toString(36).slice(0, length).toUpperCase();
    return leftPad(secret, '0', length);
}
