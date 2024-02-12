import ProgressBar from "./progressbar";
import Passive from "./passive";
import { onPageLoaded } from "./loader";
import { PalNames, XPThresholds } from "./dictionary";
import pals from "./palstats";
import Pal from "./pal";

/**
 * @type {(pal: Pal)} callback for setting pal
 */
let onPalSelected;

const load = onPageLoaded(() => {
    const palviewer = document.querySelector("div.palviewer");
    const listingInfo = palviewer.querySelector(".listing-info");
    const statsInfo = palviewer.querySelector(".stats-info");
    const suitability = palviewer.querySelector(".suitability");
    const passiveList = palviewer.querySelector(".passives");
    
    const levelElem = listingInfo.querySelector(".level");

    const exp = new ProgressBar("exp");
    const expLeft = listingInfo.querySelector(".exp #left");

    const name = listingInfo.querySelector(".name");
    const gender = listingInfo.querySelector("#gender");
    const element = listingInfo.querySelector(".element");
    const subelement = listingInfo.querySelector(".subelement");

    const portrait = statsInfo.querySelector("#portrait");
    const stars = statsInfo.querySelector(".condenser").querySelectorAll(".dark");
    const rank = statsInfo.querySelector(".rank");

    const health = new ProgressBar("health", true);
    const satiety = new ProgressBar("satiety", true);
    const sanity = statsInfo.querySelector("span#sanity");
    const attack = statsInfo.querySelector("span#attack");
    const defense = statsInfo.querySelector("span#defense");
    const workSpeed = statsInfo.querySelector("span#workspeed");

    const kindling = suitability.querySelector("span.kindling");
    const watering = suitability.querySelector("span.watering");
    const planting = suitability.querySelector("span.planting");
    const electric = suitability.querySelector("span.electric");
    const handiwork = suitability.querySelector("span.handiwork");
    const gathering = suitability.querySelector("span.gathering");
    const logging = suitability.querySelector("span.logging");
    const mining = suitability.querySelector("span.mining");
    const medicine = suitability.querySelector("span.medicine");
    const cooling = suitability.querySelector("span.cooling");
    const transport = suitability.querySelector("span.transport");
    const farming = suitability.querySelector("span.farming");

    const passives = [];
    passiveList.querySelectorAll(".passive").forEach(passive => {
        passives.push(new Passive(passive));
    });

    console.log(passives);

    onPalSelected = (pal) => {
        name.textContent = pal.name;
        gender.textContent = pal.gender;
        element.src = `images/element/${pal.type}.webp`;
        if (pal.sub) {
            subelement.src = `images/element/${pal.sub}.webp`;
            subelement.style.display = "block";
        } else {
            subelement.style.display = "none";
        }

        portrait.src = `images/pals/${pal.id}${pal.variant ? "b" : ""}.webp`;
        rank.textContent = `+${pal.rankTotal}`;
        for (let i = 0; i < 4; i++) {
            if (pal.rank - 1 > i) {
                stars[i].classList.remove("dark");
            } else {
                stars[i].classList.add("dark");
            }
        }

        levelElem.textContent = pal.level.toString();
        expLeft.textContent = pal.remainingExp.toFixed(0);
        exp.current = pal.exp;
        exp.max = pal.exp + pal.remainingExp;

        // Stats Info...
        health.current = pal.health;
        health.max = pal.maxHealth;
        satiety.current = pal.satiety;
        satiety.max = pal.maxSatiety;
        sanity.textContent = pal.sanity;

        // TODO: Figure out how these equate to ingame numbers
        attack.textContent = pal.attack;
        defense.textContent = pal.defense;
        workSpeed.textContent = pal.workSpeed; // TODO: Implement the passives

        // Suitability Info...
        // We use the suits from the savedata because it will have increased
        // if the pal has been upgraded all the way
        const suits = pal.suitabilities;
        kindling.textContent  = suits.kindling > 0 ? suits.kindling : "";
        watering.textContent  = suits.watering > 0 ? suits.watering : "";
        planting.textContent  = suits.planting > 0 ? suits.planting : "";
        electric.textContent  = suits.electric > 0 ? suits.electric : "";
        handiwork.textContent = suits.handiwork > 0 ? suits.handiwork : "";
        gathering.textContent = suits.gathering > 0 ? suits.gathering : "";
        logging.textContent   = suits.logging > 0 ? suits.logging : "";
        mining.textContent    = suits.mining > 0 ? suits.mining : "";
        medicine.textContent  = suits.medicine > 0 ? suits.medicine : "";
        cooling.textContent   = suits.cooling > 0 ? suits.cooling : "";
        transport.textContent = suits.transport > 0 ? suits.transport : "";
        farming.textContent   = suits.farming > 0 ? suits.farming : "";

        passives.forEach((passive, i) => {
            if (pal.passives[i]) {
                passive.setPassive(pal.passives[i]);
            } else {
                passive.setPassive(null);
            }
        });
    };
});

export default {

    /**
     * @param {Pal} pal
     */
    set selectedPal(pal) {
        load.then(() => onPalSelected?.call(null, pal));
    }
}