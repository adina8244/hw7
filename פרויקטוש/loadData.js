// let allItems = [];
// let selectItemList = [];

// // פונקציה לקבלת צבע הרקע של הפס למעלה
// function getHeaderColor() {
//     const header = document.querySelector('.header-bar');
//     const color = window.getComputedStyle(header).backgroundColor;
//     return color;
// }

// function loadItems() {
//     Promise.all([
//         fetch('Cars.json'),
//         fetch('electricCar.json')
//     ])
//     .then(res => {
//         if (!res[0].ok || !res[1].ok) {
//             throw new Error('Network response was not ok');
//         }
//         return Promise.all([res[0].json(), res[1].json()]);
//     })
//     .then(data => {
//         const [data1, data2] = data;
//         const items1 = data1.map(item => new Cars(item));
//         const items2 = data2.map(item => new ElectricCar(item));
//         allItems = items1.concat(items2);
//         createView(allItems);
//     })
//     .catch(error => {
//         console.error('Error loading items:', error);
//     });
// }

// function highlightText(text, search) {
//     if (!search) return text;
//     const highlightColor = getHeaderColor();
//     const regex = new RegExp(`(${search.split(" ").join("|")})`, 'gi');
//     return text.replace(regex, `<span style="background-color: ${highlightColor}; color: black; font-weight: bold;">$1</span>`);
// }

// function createView(arr) {
//     deleteAllItems();
//     arr.forEach(element => {
//         createItemView(element);
//     });
// }

// function createItemView(t) {
//     const card = document.createElement("div");
//     card.setAttribute("class", "card");
//     const parent = document.querySelector(".gridcontainer");
//     parent.appendChild(card);

//     const img = document.createElement("img");
//     img.setAttribute("src", t.img);
//     img.setAttribute("style", "width:100%; transition: transform 0.3s;");
//     img.addEventListener('mouseover', () => {
//         img.style.transform = 'scale(1.1)';
//     });
//     img.addEventListener('mouseout', () => {
//         img.style.transform = 'scale(1)';
//     });
//     card.appendChild(img);

//     const company = document.createElement("h1");
//     company.innerHTML = highlightText(t.company, document.querySelector('.myInput').value.trim());
//     company.setAttribute("style", "cursor: pointer; transition: text-decoration 0.3s;");
//     company.addEventListener('mouseover', () => {
//         company.style.textDecoration = 'underline';
//     });
//     company.addEventListener('mouseout', () => {
//         company.style.textDecoration = 'none';
//     });
//     card.appendChild(company);

//     const description = document.createElement("p");
//     description.innerHTML = highlightText(t.description, document.querySelector('.myInput').value.trim());
//     card.appendChild(description);

//     const buttonContainer = document.createElement("p");
//     card.appendChild(buttonContainer);

//     const button = document.createElement("button");
//     button.innerHTML = t.available ? "השכרה" : "החזרה";
//     button.style.backgroundColor = t.available ? "" : "pink";
//     button.addEventListener("click", () => {
//         if (t.available) {
//             t.rentalDate = new Date();
//             selectItemList.push(t);
//             selectItemList.sort((a, b) => a.company.localeCompare(b.company, 'he', { sensitivity: 'base' }));
//             button.innerHTML = "החזרה";
//             button.style.backgroundColor = "pink";
//         } else {
//             t.rentalDate = null;
//             selectItemList.splice(selectItemList.findIndex(i => i === t), 1);
//             button.innerHTML = "השכרה";
//             button.style.backgroundColor = "";
//         }
//         localStorage.setItem("selects", JSON.stringify(selectItemList));
//     });
//     buttonContainer.appendChild(button);
// }

// function deleteAllItems() {
//     const gridContainer = document.querySelector('.gridcontainer');
//     while (gridContainer.firstChild) {
//         gridContainer.removeChild(gridContainer.firstChild);
//     }
// }

// function searchItem() {
//     const inputField = document.querySelector('.myInput');
//     const inputValue = inputField.value.trim().toLowerCase();
//     const filteredItems = allItems.filter(item => item.searchByStr(inputValue));
//     createView(filteredItems);
// }

// function sortItems() {
//     const sortBy = document.getElementById('sort-select').value;
//     let sortedItems = [...allItems];

//     if (sortBy === 'name') {
//         sortedItems.sort((a, b) => a.company.localeCompare(b.company, 'he', { sensitivity: 'base' }));
//     } else if (sortBy === 'rentalStatus') {
//         sortedItems.sort((a, b) => {
//             if (a.rentalDate && !b.rentalDate) return -1;
//             if (!a.rentalDate && b.rentalDate) return 1;
//             return 0;
//         });
//     }

//     createView(sortedItems);
// }

// document.addEventListener('DOMContentLoaded', () => {
//     loadItems();
//     document.querySelector('.myInput').addEventListener('keyup', searchItem);

//     const scrollToTopBtn = document.getElementById('scrollToTopBtn');
//     window.addEventListener('scroll', function() {
//         if (window.pageYOffset > 300) {
//             scrollToTopBtn.style.display = 'block';
//         } else {
//             scrollToTopBtn.style.display = 'none';
//         }
//     });

//     scrollToTopBtn.addEventListener('click', function() {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     });
// });