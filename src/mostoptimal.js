import { onPageLoaded } from "./loader"
import breeding from "./breeding";

onPageLoaded(() => {
    const mostOptimal = document.querySelector("div.most-optimal");
    const palSelect = mostOptimal.querySelector("select.pals");
    const traits = mostOptimal.querySelectorAll("select.traits");
    const calculate = mostOptimal.querySelector("button.calculate");

    calculate.addEventListener("click", () => {
        const desiredPal = palSelect.value;
        const desiredTraits = [];

        for (let i = 0; i < 4; i++)
            if (traits[i].value !== "none")
                desiredTraits.push(traits[i].value);

        console.log("Getting pals with " + desiredTraits.join(", "));

        const traitedPals = breeding.getSavedPals(desiredTraits);
        console.log(traitedPals);

        // get all pals with any number of any of the traits
    })
})

export default {

}