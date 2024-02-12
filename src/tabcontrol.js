import { onPageLoaded } from "./loader";
let ontabchanged;

onPageLoaded(async () => {
    const pages = document.querySelectorAll("div.tabbed-content");
    const tabs = document.querySelector("div.tabs");

    // show the first page
    pages[0].classList.add("active");

    for (let i = 0; i < tabs.children.length; i++) {
        let tab = tabs.children[i];
        tab.addEventListener("click", () => {
            pages.forEach((page) => page.classList.remove("active"));
            tabs.children.forEach((tab) => tab.classList.remove("active"));

            pages[i].classList.add("active");
            tab.classList.add("active");

            if (ontabchanged) {
                ontabchanged(tab, pages[i]);
            }
        });
    }
});

export default {
    /**
     * @param {(tab: HTMLButtonElement, page: HTMLDivElement)} value Callback for when tab changes
     */
    set onTabChanged(value) {
        ontabchanged = value;
    },
}