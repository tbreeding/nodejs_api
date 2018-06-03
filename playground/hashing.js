const {SHA256} = require('crypto-js');
const JWT = require('jsonwebtoken');

let data = {
    id: 10
};

let token = 
console.log(token);
let decoded = JWT.verify(token, '123abc');

console.log('decoded', decoded);

// let message = 'I am user number 3';

// let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was change do not trust');
// }