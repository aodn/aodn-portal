
Array.prototype.last = function() {
    if (this.length > 0) {
        return this[this.length - 1]
    }
};

//http://stackoverflow.com/questions/19655975/check-if-an-array-contains-duplicate-values
Array.prototype.hasDuplicates = function() {
    this.sort();
    for (var i = 1; i < this.length; i++) {
        if (this[i - 1] == this[i]) {
            return true;
        }
    }
    return false;
};
