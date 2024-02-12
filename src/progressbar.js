import { onPageLoaded } from "./loader";

export default class ProgressBar {
    constructor(id, hasText = false) {
        this.elem = null;
        this.progress = null;
        this.width = 0;
        this.curValue = 0;
        this.maxValue = 0;
        this.hasText = hasText;

        this.currentElem = null;
        this.maxElem = null;

        this.load = onPageLoaded(() => {
            this.elem = document.querySelector(`div#${id}.progressbar`);
            if (!this.elem)
                throw new Error("Progress bar with id " + id + " does not exist.");

            this.progress = this.elem.querySelector("div.inner");
            if (!this.progress)
                throw new Error("Couldn't find the inner progressbar element.");

            if (!this.hasText)
                return;

            this.currentElem = this.elem.querySelector(".current");
            if (!this.currentElem)
                throw new Error("Couldn't find \"current\" text element in progress bar");

            this.maxElem = this.elem.querySelector(".max");
            if (!this.maxElem)
                throw new Error("Couldn't find \"max\" text element in progress bar");
        });
    }

    /**
     * Sets the value of the progressbar
     * @param {number} val;
     */
    set value(val) {
        this.width = val;

        let strval = (val * 100).toString() + "%";
        this.load.then(() => this.progress.style.width = strval);
    }

    get value() {
        return this.width;
    }

    get current() {
        return this.curValue;
    }

    get max() {
        return this.maxValue;
    }

    /**
     * Sets the display of the current value
     * @param {number} value 
     */
    set current(value) {
        this.curValue = value;
        this.value = this.current / this.max;

        if (!this.hasText)
            return;
        
        let strval = value.toFixed(0);
        this.load.then(() => this.currentElem.textContent = strval);
    }

    /**
     * Sets the text display of the max value
     * @param {number} value
     */
    set max(value) {
        this.maxValue = value;
        this.value = this.current / this.max;

        if (!this.hasText)
            return;

        let strval = value.toFixed(0);
        this.load.then(() => this.maxElem.textContent = strval);
    }
}