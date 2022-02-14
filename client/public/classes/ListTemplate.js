export class ListTemplate {
    // can do this format if there is an access modifier
    constructor(container) {
        this.container = container;
    }
    // start|end means it could either be 'start' or 'end'
    render(item, heading, pos) {
        const li = document.createElement("li");
        const h4 = document.createElement("h4");
        h4.innerText = heading;
        li.append(h4);
        const p = document.createElement("p");
        p.innerText = item.format();
        li.append(p);
        if (pos === "start") {
            this.container.prepend(li);
        }
        else {
            this.container.append(li);
        }
    }
}
