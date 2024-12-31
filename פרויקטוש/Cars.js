let allItems = [];
let selectItemList = JSON.parse(localStorage.getItem("selects")) || [];

class Car {
    constructor(data) {
        Object.assign(this, data);
        this.rentalDate = null;
        this.isRented = false;
    }
}

class ElectricCar extends Car {}

function loadItems() {
    Promise.all([
        fetch('Cars.json'),
        fetch('electricCar.json')
    ])
    .then(responses => {
        if (!responses[0].ok || !responses[1].ok) {
            throw new Error('Network response was not ok');
        }
        return Promise.all([responses[0].json(), responses[1].json()]);
    })
    .then(data => {
        const [data1, data2] = data;
        allItems = data1.map(item => new Car(item))
                    .concat(data2.map(item => new ElectricCar(item)));
        updateRentalStatus();
        createView(allItems);
    })
    .catch(error => {
        console.error('Error loading items:', error);
    });
}

function updateRentalStatus() {
    allItems.forEach(item => {
        const rentedItem = selectItemList.find(stored => stored.licensePlate === item.licensePlate);
        if (rentedItem) {
            item.isRented = true;
        }
    });
}

function createView(arr) {
    deleteAllItems();
    arr.forEach(createItemView);
}

function createItemView(t) {
    var tt = document.createElement("div");
    tt.setAttribute("class", "card");
    var parent = document.getElementsByClassName("gridcontainer")[0];
    parent.appendChild(tt);

    var im = document.createElement("img");
    im.setAttribute("src", t.img);
    im.setAttribute("style", "width:100%; transition: transform 0.3s;");
    im.addEventListener('mouseover', () => {
        im.style.transform = 'scale(1.1)';
    });
    im.addEventListener('mouseout', () => {
        im.style.transform = 'scale(1)';
    });
    tt.appendChild(im);

    var h = document.createElement("h1");
    h.innerHTML = highlightText(t.company, document.querySelector('.myInput').value.trim());
    h.setAttribute("style", "cursor: pointer; transition: text-decoration 0.3s;");
    h.addEventListener('mouseover', () => {
        h.style.textDecoration = 'underline';
    });
    h.addEventListener('mouseout', () => {
        h.style.textDecoration = 'none';
    });
    tt.appendChild(h);

    var h4 = document.createElement("h4");
    h4.innerHTML = t.model;
    tt.appendChild(h4);

    var h5 = document.createElement("h5");
    h5.innerHTML = t.licensePlate;
    tt.appendChild(h5);

    var p = document.createElement("p");
    p.innerHTML = highlightText(t.description, document.querySelector('.myInput').value.trim());
    tt.appendChild(p);

    var p2 = document.createElement("p");
    tt.appendChild(p2);

    var bt = document.createElement("button");
    if (t.isRented) {
        bt.innerHTML = "החזרה";
        bt.style.backgroundColor = "red";
    } else {
        bt.innerHTML = "השכרה";
        bt.style.backgroundColor = "black";
    }
    bt.addEventListener("click", () => {
        if (!t.isRented) {
            t.rentalDate = new Date();
            t.isRented = true;
            selectItemList.push(t);
            selectItemList.sort((a, b) => a.company.localeCompare(b.company));
            bt.innerHTML = "החזרה";
            bt.style.backgroundColor = "red";
            document.getElementById("number").innerHTML = parseInt(document.getElementById("number").innerHTML) + 1;
            document.getElementById("cars").innerHTML += `${t.company} - ${t.model} 🚗 `;
        } else {
            t.rentalDate = null;
            t.isRented = false;
            selectItemList = selectItemList.filter(item => item.licensePlate !== t.licensePlate);
            bt.innerHTML = "השכרה";
            bt.style.backgroundColor = "black";
            document.getElementById("number").innerHTML = parseInt(document.getElementById("number").innerHTML) - 1;
            document.getElementById("cars").innerHTML = document.getElementById("cars").innerHTML
                .replace(`${t.company} - ${t.model} 🚗 `, '');
        }
        localStorage.setItem("selects", JSON.stringify(selectItemList));
    });
    p2.appendChild(bt);
}

function deleteAllItems() {
    document.querySelectorAll('.card').forEach(card => card.remove());
}

function searchItem() {
    let searchValue = document.querySelector('.myInput').value.trim().toLowerCase();
    let filteredItems = allItems.filter(item => {
        return item.company.toLowerCase().includes(searchValue) || item.description.toLowerCase().includes(searchValue);
    });
    createView(filteredItems);
}

function sortItems() {
    let select = document.getElementById('sort-select');
    let value = select.options[select.selectedIndex].value;
    switch (value) {
        case 'name':
            allItems.sort((a, b) => a.company.localeCompare(b.company, 'he', { sensitivity: 'base' }));
            break;
        case 'rentalStatus':
            allItems.sort((a, b) => b.isRented - a.isRented);
            break;
    }
    createView(allItems);
}

function highlightText(text, query) {
    if (query === '') return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, "<span style='background-color: yellow;'>$1</span>");
}

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

document.getElementById("scrollToTopBtn").addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

document.querySelector(".button").addEventListener("click", loadItems);
document.querySelector('.myInput').addEventListener('input', searchItem);
document.getElementById('sort-select').addEventListener('change', sortItems);