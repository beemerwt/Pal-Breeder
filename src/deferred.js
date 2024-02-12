
export default class Deferred {
    constructor(callback) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            if (callback)
                callback(this);
        });
    }
}