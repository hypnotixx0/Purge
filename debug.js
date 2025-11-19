// debug.js - Debug utility for production/development
const DEBUG = false; // Set to false in production

const log = DEBUG ? console.log.bind(console) : () => {};
const warn = DEBUG ? console.warn.bind(console) : () => {};
const error = console.error.bind(console); // Always log errors
const info = DEBUG ? console.info.bind(console) : () => {};

window.debug = { log, warn, error, info, DEBUG };

