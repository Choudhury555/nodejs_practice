const temp = "random variable";
const temp1 = "random variable 1"
const temp2 = "random variable 2"
export const tempFunction = function () {
    return `${Math.floor(Math.random() * 100)}%`;
}
//old way of "export"
// module.exports = temp;

//new way of "export"
export default temp;//only one export default can be possible
export { temp1, temp2 };//named export or explicit export