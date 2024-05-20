"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROGRAM_ID = exports.PROGRAM_ID_CLI = void 0;
const web3_js_1 = require("@solana/web3.js");
// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
exports.PROGRAM_ID_CLI = new web3_js_1.PublicKey("LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo");
// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
exports.PROGRAM_ID = exports.PROGRAM_ID_CLI;
