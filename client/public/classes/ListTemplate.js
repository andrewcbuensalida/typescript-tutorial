export class ListTemplate {
    // can do this format if there is an access modifier
    constructor(container) {
        this.container = container;
    }
    // start|end means it could either be 'start' or 'end'
    render(item, heading, pos) {
        const li = document.createElement("li");
        const top = document.createElement("div");
        top.classList.add("topInvoice");
        const h4 = document.createElement("h4");
        h4.innerText = heading;
        const h4Time = document.createElement("h4");
        const timeStampArray = item.timeStamp.split('T');
        const formattedTimeStamp = timeStampArray[0] + ' ' + timeStampArray[1].slice(0, 5);
        h4Time.innerText = formattedTimeStamp;
        top.append(h4);
        top.append(h4Time);
        li.append(top);
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
