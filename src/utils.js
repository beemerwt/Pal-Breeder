HTMLCollection.prototype.forEach = function(fn) {
    for (let i = 0; i < this.length; i++) {
        let item = this.item(i);
        if (item !== null)
            fn(item);
    }
}