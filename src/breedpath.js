import { onPageLoaded } from "./loader";
import breeding from "./breeding";


onPageLoaded(() => {
    const breedPath = document.querySelector("div.breed-path");
    const pathElem = breedPath.querySelector("div#path");
    const [ startSelect, resultSelect ] = breedPath.querySelectorAll("select.pals");
    const calculate = document.querySelector("button#calc");
    
    function outputMessage(message) {
        const p = document.createElement("p");
        p.textContent = message;
        pathElem.appendChild(p);
    }
    
    calculate.onclick = () => {
        pathElem.innerHTML = "";
        const startName = startSelect.item(startSelect.selectedIndex).value;
        const resultName = resultSelect.item(resultSelect.selectedIndex).value;

        const uniqueCombos = breeding.getUniqueCombos();
        if (uniqueCombos.includes(resultName)) {
            outputMessage(`Only two ${resultName} can produce a ${resultName}.`);
            return;
        }

        const breedSet = breeding.findResultFromName(startName, resultName);
        if (breedSet.length == 0) {
            outputMessage(`You cannot make a ${resultName} from a ${startName}.`);
            return;
        }

        let fullPath = [];
        let last = startName;
        for (let i in breedSet) {
            const { mate, result } = breedSet[i];
            fullPath.push(`${last} + ${mate} = ${result}`);
            last = result;
        }

        fullPath.forEach((str) => {
            const p = document.createElement("p");
            p.textContent = str;
            pathElem.appendChild(p);
        })
    }

});