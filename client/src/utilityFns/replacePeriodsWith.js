export default function replacePeriodsWith(str) {
    return function(mainStr) {
        return mainStr.replace(/\./g, str);
    }
}