function isInArray(arr, item) {
    var len = arr.length,
        i = 0;

    while(i < len) {
        if(arr[i++] == item) {
            return true;
        }

    }

    return false;
}

module.exports = isInArray;
