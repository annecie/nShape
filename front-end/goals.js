// Rendering Goals
fetch(`http://localhost:8085/goals`)
    .then(response => response.json())
    .then(data => {
        data.forEach(data => {
            renderListItem(data)
        })
    })

const goalsList = document.querySelector('#myUL')

function renderListItem(data) {
    // Destructing the api data into individual varibales 
    const { goals_id, description, completed } = data;

    // Rendering Goal to the website
    const listItem = document.createElement('li');
    listItem.id = goals_id;
    listItem.innerText = `${description}`
    // Check if goal is marked as completed
    if (completed === true) {
        listItem.classList.add("checked")
    }
    // Trash Icon
    const trashIcon = document.createElement('i');
    trashIcon.setAttribute("class", "fa-solid fa-trash")
    trashIcon.style.marginLeft = "15px";
    trashIcon.id = goals_id;
    trashIcon.onclick = deleteGoal
    listItem.appendChild(trashIcon)
    // Pencil (Edit Icon)
    const editIcon = document.createElement('i');
    editIcon.setAttribute("class", "fa-solid fa-pencil")
    editIcon.style.marginLeft = "15px";
    editIcon.id = goals_id;
    editIcon.onclick = editGoal
    listItem.appendChild(editIcon)
    // Adding a function to the goal
    listItem.onclick = markGoalAsComplete
    goalsList.append(listItem)
}

// Creating New Goals
const addButton = document.querySelector('#addBtn')
const descriptionInputBox = document.querySelector('#myDescInput')


addButton.addEventListener('click', createNewGoal)

function createNewGoal(event) {
    // Getting the value of the input field
    const newDescription = descriptionInputBox.value;

    // If either the description is missing
    // the user will be notfied with an alert
    if (newDescription === "") {
        alert("Please enter a goal description")
        return
    }

    fetch('http://localhost:8085/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Gets the input data, converts into JSON, and sends into the server
        body: JSON.stringify({ description: newDescription })
    })
        .then(res => res.json())
        .then(data => {
            renderListItem(data)
        })
}

// Marking Goals as Completed
function markGoalAsComplete(event) {
    // console.log(event.target)
    const currentTask = event.target;
    const currentTaskId = Number(event.target.id)
    // console.log(currentTaskId)

    fetch(`http://localhost:8085/goals/${currentTaskId}/complete`, {
        method: 'PATCH'
    })
        .then(res => res.json())
        .then(data => {
            data.forEach(data => {
                if (data.completed === true) {
                    currentTask.classList.add("checked")
                }
            })
        })
}



// Delete a goal
function deleteGoal(event) {
    // console.log(event.target)
    const currentTask = event.target;
    const currentTaskId = Number(event.target.id)
    const parentEle = currentTask.parentElement;

    fetch(`http://localhost:8085/goals/${currentTaskId}/`, {
        method: 'DELETE'
    })
    parentEle.remove();
}

// Edit a goal
function editGoal(event) {
    const currentTask = event.target;
    const currentTaskId = Number(event.target.id)
    const parentEle = currentTask.parentElement;

    // Pops a windows' icon to edit the goal
    const editPrompt = prompt(`Update Task Description`, `${parentEle.innerText}`)

    fetch(`http://localhost:8085/goals/${currentTaskId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({description: editPrompt})
    })
    // Update current description with new inputted description
    parentEle.innerText = editPrompt

}
// 
// 
