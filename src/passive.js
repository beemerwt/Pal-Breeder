import { PassiveSkills } from "./dictionary";

export default class Passive {
    /**
     * @param {HTMLDivElement} elem 
     */
    constructor(elem) {
        this.elem = elem;
        this.nameElem = this.elem.querySelector(".name");
        this.symbolElem = this.elem.querySelector("#symbol");
    }

    setPassive(passive) {
        this.elem.classList.remove("passive-good", "passive-bad", "t1", "t2", "t3");
        this.symbolElem.textContent = "";
        this.nameElem.textContent = "";

        if (passive === null)
            return;

        const { name, good, tier } = passive;

        this.elem.classList.add(good ? "passive-good" : "passive-bad", `t${tier}`);
        this.nameElem.textContent = name;

        if (tier === 3)
            this.symbolElem.textContent = "stat_3";
        else if (tier === 2)
            this.symbolElem.textContent = "stat_2";
        else
            this.symbolElem.textContent = "stat_1";
    }
}