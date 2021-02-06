/**
 * Returns current time in ISOS string
 */
module.exports = function getTime() {
    return new Date().toISOString();
}