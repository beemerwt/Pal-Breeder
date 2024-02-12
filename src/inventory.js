// Pal Inventory
import { onPageLoaded } from './loader';
import Pal from './pal';
import viewer from './viewer';

/** @type {HTMLDivElement} */
let inventory;

/** @type {HTMLDivElement} */
let palList;

/**
 * @param {Pal} pal 
 */
function Item(pal) {
    const item = document.createElement("div");
    item.classList.add("item");

    const info = document.createElement("div");
    info.classList.add("info");
    item.appendChild(info);

    const image = document.createElement("img");
    image.draggable = false;
    image.src = `images/pals/${pal.id}${pal.variant ? "b" : ""}.webp`;
    image.classList.add("pal");
    info.appendChild(image);

    const level = document.createElement("span");
    level.classList.add("level");
    level.textContent = pal.level;
    info.appendChild(level);

    const name = document.createElement("span");
    name.classList.add("name");
    name.textContent = pal.name;
    info.appendChild(name);

    const elements = document.createElement("div");
    elements.classList.add("elements");
    item.appendChild(elements);

    const element = document.createElement("img");
    element.src = `images/element/${pal.type}.webp`;
    element.classList.add("element");
    element.draggable = false;
    elements.appendChild(element);

    if (pal.sub) {
        const subElement = document.createElement("img");
        subElement.src = `images/element/${pal.sub}.webp`;
        subElement.classList.add("element");
        subElement.draggable = false;
        elements.appendChild(subElement);
    }

    return item;
}

const load = onPageLoaded(() => {
    inventory = document.querySelector("div.inventory");
    palList = inventory.querySelector("div.pal-list");
});

export default {
    /**
     * Adds a pal object to the inventory display
     * @param {Pal} pal 
     */
    addItem(pal) {
        load.then(() => {
            const item = Item(pal);
            item.addEventListener("click", () => {
                palList.querySelectorAll("div.item")
                    .forEach((elem) => elem.classList.remove("active"));

                item.classList.add("active");
                viewer.selectedPal = pal;
            });

            palList.appendChild(item);
        });
    },

    setSelected(i) {
        load.then(() => {
            const itemList = palList.querySelectorAll("div.item");
            itemList.forEach((elem) => elem.classList.remove("active"));

            if (!itemList[i])
                return;

            itemList[i].classList.add("active");
            itemList[i].click();
        });
    },


    // TODO: Sort by name, element, level...
    // Unfortunately we can't sort by the information inside the element
    // but we should create a Search button for specific pals
    // then we should create a new inventory list for the results
    // with a "close" button so you can return to the original list...
    sort(fn) {
        load.then(() => {
            const items = [];

        })
    }
}