const {SHA256} = require('crypto-js');
const JWT = require('jsonwebtoken');
const BCRYPT = require('bcryptjs');

let password = '123abc!';

// BCRYPT.genSalt(10, (err, salt) => {
//     BCRYPT.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     } )
// });

var hashedPw = '$2a$10$aViYIpPtIk12bJ6kuF9g0eXPgy/p6Adn9mBK.bvwp3/dgFNb0yvuq'

BCRYPT.compare(password, hashedPw, (err, res) => {
    console.log(res);
})

// let data = {
//     id: 10
// };

// let token = 
// console.log(token);
// let decoded = JWT.verify(token, '123abc');

// console.log('decoded', decoded);

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