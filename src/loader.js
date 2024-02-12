

export function onPageLoaded(callback) {
    let qResolve, qReject;
    const promise = new Promise(function (resolve, reject) {
        qResolve = resolve;
        qReject = reject;
    });

    const onLoad = () => {
        if (document.readyState !== "loading") {
            try {
                callback();
                qResolve();
            } catch (e) {
                qReject(e);
            }
        } else
            setTimeout(onLoad, 50);
    }

    setTimeout(onLoad, 50);
    return promise;
}