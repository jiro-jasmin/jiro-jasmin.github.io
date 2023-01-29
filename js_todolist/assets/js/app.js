const titleInput = document.getElementById("titleInput");
const yearInput = document.getElementById("yearInput");
const authorInput = document.getElementById("authorInput");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const saveBtn = document.getElementById("saveBtn");
const sortOutSelect = document.getElementById("sortOutSelect");
const form = document.getElementById("form");
const tbody = document.getElementById("tbody");

var films = [
    { title: "Deadpool", year: 2016, author: "Tim Miller" },
    { title: "Spiderman", year: 2002, author: "Sam Raimi" },
    { title: "Scream", year: 1996, author: "Wes Craven" },
    { title: "It: chapter 1", year: 2019, author: "Andy Muschietti" }
];

// 1. Display form
btnAdd.addEventListener('click', function () {
    form.style.display = "block";
    form.classList.add('fade');
    form.offsetHeight; // make a pause for the transition
    form.classList.add('in');
    btnAdd.style.display = "none";
    btnCancel.style.display = "block";
});

// Hide form
btnCancel.addEventListener('click', function () {
    btnCancel.style.display = "none";
    form.classList.add('fade');
    form.classList.remove('in');
    form.style.display = "none";
    btnAdd.style.display = "block";
});

// 2. Input validation
function controlInput() {
    let errorMsg = document.getElementById('errorMsg');
    errorMsg.innerHTML = ""; // reinit
    let score = 0;
    let today = new Date();
    let maxYear = today.getFullYear(); // return current year 

    if ((titleInput.value).length < 2) {
        score--;
        titleInput.classList.add('is-invalid');
        errorMsg.innerHTML += `Please enter a title of at least 2 characters.<br>`;
        setTimeout(function () {
            errorMsg.innerHTML = "";
            titleInput.classList.remove('is-invalid');
        }, 3000);

    } else {
        score++;
    }

    if (yearInput.value < 1900 || yearInput.value > maxYear) {
        score--;
        yearInput.classList.add('is-invalid');
        errorMsg.innerHTML += `Please enter a valid year.<br>`;
        setTimeout(function () {
            errorMsg.innerHTML = "";
            yearInput.classList.remove('is-invalid');
        }, 3000);
    } else {
        score++;
    }

    if ((authorInput.value).length < 5) {
        score--;
        authorInput.classList.add('is-invalid');
        errorMsg.innerHTML += `Please enter film maker name of at least 5 characters.<br>`;
        setTimeout(function () {
            errorMsg.innerHTML = "";
            authorInput.classList.remove('is-invalid');
        }, 3000);

    } else {
        score++;
    }

    if (score >= 3) {
        addElement(); // add element only if the 3 inputs are valid
    }
};

// 3. Add in array
function addElement() {

    let capitalTitle = titleInput.value[0].toUpperCase() + titleInput.value.slice(1);
    let capitalAuthor = authorInput.value[0].toUpperCase() + authorInput.value.slice(1);

    let successMsg = document.getElementById('successMsg');
    successMsg.innerHTML = ""; // reinit div
    successMsg.innerHTML += `Film added successfully!`;
    setTimeout(function () { successMsg.innerHTML = "<br>"; }, 3000); // Add <br> so that the the table don't move when error msg disappears

    let newFilm = films.push({
        title: capitalTitle,
        year: yearInput.value,
        author: capitalAuthor
    });

    titleInput.value = null; // reinit 3 inputs
    yearInput.value = null;
    authorInput.value = null;
    sortOut();
    printElement();
}

// 4. Display element in html
function printElement() {
    tbody.innerHTML = "";
    films.forEach(function (film) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        tr.innerHTML = `<td>` + film.title + `</td> <td>` + film.year + `</td> <td>` + film.author + `</td> 
        <td><button type="button" class="btn btn-outline-danger m-1 btnDelete">×</button></td>`;

        tr.style.display = 'table-row';
        tr.classList.add('fade');
        tr.offsetHeight; // make a pause for the transition
        tr.classList.add('in');
    });

    deleteElement(); // activate function after each new film
}

// 5. Delete a film (in array + in html table)
function deleteElement() {

    // Link the delete btn (in html table) with the objects in array 
    let btnDelete = document.querySelectorAll(".btnDelete"); // Create a NodeList with these btn
    let btnDeleteArray = Array.from(btnDelete); // Convert Nodelist into Array

    for (let i = 0; i < btnDelete.length; i++) {
        let thisBtn = btnDelete[i];

        thisBtn.addEventListener('click', function () {
            let getConfirmation = confirm('Are you sure to delete this item ?');

            if (getConfirmation) {
                // Delete film in js array
                let thisIndex = btnDeleteArray.indexOf(thisBtn); // get index of the btn
                films.splice(thisIndex, 1); // delete object which has the same index of the btn

                btnDeleteArray.splice(thisIndex, 1); // delete btn from btn array

                // Delete film in html table
                thisBtn.closest("tr").remove();
            }
        });
    }
}

// 6. Sort out data
function sortOutTitle() {
    films.sort(function (a, b) {
        var titleA = a.title.toUpperCase(); // ignore upper and lowercase
        var titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }

        // titles must be equal
        return 0;
    });
    printElement();
}

function sortOutYear() {
    films.sort(function (a, b) {
        return a.year - b.year;
    });
    printElement();
}

function sortOut() {
    if (sortOutSelect.value == "default") {
        console.log('unsorted');
    } else if (sortOutSelect.value == "byTitle") {
        sortOutTitle();
    } else if (sortOutSelect.value == "byYear") {
        sortOutYear();
    }
}

// Sort according to the selected input
sortOutSelect.addEventListener('change', function () {
    sortOut();
});

// Submit form to add new element
form.addEventListener('submit', function (e) {
    e.preventDefault();
    controlInput();
});

sortOut();
printElement();

