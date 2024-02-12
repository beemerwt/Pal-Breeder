import { onPageLoaded } from './loader';
let enterCallback, leaveCallback, overCallback, dropCallback;
let errorHandler;

onPageLoaded(async () => {
    const dragText = document.querySelector("div.drag-enter");
    const content = document.querySelector("div.content");
    const errorElem = document.querySelector("div.error");
    const errorText = document.querySelector("p.error-text");

    errorElem.addEventListener("transitionend", (e) => {
        if (errorElem.classList.contains("hide"))
            errorElem.style.opacity = "0";
    })

    errorElem.addEventListener("transitionstart", (e) => {
        if (errorElem.classList.contains("show"))
            errorElem.style.opacity = "1";
    })

    const onDragEnter = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.add("show");
        content.classList.add("drag");

        if (enterCallback)
            enterCallback(e);
    }

    const onDragLeave = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.remove("show");
        content.classList.remove("drag");

        if (leaveCallback)
            leaveCallback(e);
    }

    const onDragOver = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.add("show");
        content.classList.add("drag");

        if (overCallback)
            overCallback(e);
    }

    const onDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.remove("show");
        content.classList.remove("drag");

        if (dropCallback)
            dropCallback(e);
    }

    errorHandler = function(err) {
        errorText.textContent = err;
        errorElem.classList.replace("hide", "show");
        setTimeout(() => {
            errorElem.classList.replace("show", "hide");
        }, 10000);
    }

    document.body.addEventListener("dragenter", onDragEnter, false);
    document.body.addEventListener("dragleave", onDragLeave, false);
    document.body.addEventListener("dragover", onDragOver, false);
    document.body.addEventListener("drop", onDrop, false);
});

export default {
    /**
     * @param {(ev: DragEvent)} value Callback for drop event
     */
    set onDrop(value) { dropCallback = value; },

    /**
     * @param {(ev: DragEvent)} value Callback for dragenter event
     */
    set onDragEnter(value) { enterCallback = value; },

    /**
     * @param {(ev: DragEvent)} value Callback for dragleave event
     */
    set onDragLeave(value) { leaveCallback = value; },
    
    /**
     * @param {(ev: DragEvent)} value Callback for dragover event
     */
    set onDragOver(value) { overCallback = value; },

    error(err) {
        if (!errorHandler)
            return;

        errorHandler(err);
    }
};