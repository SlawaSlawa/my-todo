'use strict';

const tasksListElem = document.getElementById('taskList'),
    tasksListDoneElem = document.getElementById('taskListDone'),
    addBtn = document.getElementById('addBtn'),
    inputElem = document.getElementById('input'),
    defaultTasksTextElem = document.getElementById('defaultTasksTextElem'),
    defaultTasksDoneTextElem = document.getElementById('defaultTasksDoneTextElem'),
    infoElems = document.querySelectorAll('.alert'),
    closeBtn = document.getElementById('closeBtn'),
    formWrap = document.getElementById('formWrap'),
    cancelBtn = document.getElementById('cancelBtn'),
    errorMsg = document.querySelector('.error-msg'),
    replaceInput = document.getElementById('replaceInput'),
    replaceBtn = document.getElementById('replaceBtn'),
    replaceErrorText = document.getElementById('replaceErrorText');

const alertAdd = 'alertAdd';
const alertDone = 'alertDone';
const alertDelete = 'alertDelete';

let todoList = [];
const todoListDone = [];

const regExp = /[А-Яа-яЁёA-Za-z]{3,}/;


function renderTasks() {
    tasksListElem.textContent = '';
    tasksListDoneElem.textContent = '';

    todoList.forEach(task => {
        if (task.isDone) {
            const html = `
        <li class="item list-group-item list-group-item-success d-flex justify-content-between">
        <span class="desc">${task.text}</span>
        <button type="button" class="btn btn-secondary deleteBntInSucces">Удалить</button>
        </li>
`;
            tasksListDoneElem.insertAdjacentHTML('afterbegin', html);
        } else {
            const html = `
            <li data-task-id="${task.id}" class="item list-group-item d-flex justify-content-between">
                <span class="desc">
                    ${task.text}
                </span>
                <div class="button-wrapper">
                    <button type="button" class="btn btn-success">Готово</button>
                    <button type="button" class="btn btn-danger">Удалить</button>
                    <button type="button" class="btn btn-warning">Изменить</button>
                </div>
            </li>
            `;
            tasksListElem.insertAdjacentHTML('afterbegin', html);
        }
    });
    toggleDefaultText();
}

function updateLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function addTaskInList(text) {
    const taskItem = { id: todoList.length, text: text, isDone: false };
    todoList.push(taskItem);
    updateLocalStorage();
    renderTasks();
}

function toggleDoneFlag(id) {
    todoList.forEach(task => {
        if (task.id == id) {
            task.isDone = true;
        }
    });
    tasksListElem.textContent = '';
    updateLocalStorage();
    renderTasks();
}

function deleteTask(id) {
    todoList.splice(id, 1);
    todoList.forEach((task, index) => {
        task.id = index;
    });
    tasksListElem.textContent = '';
    updateLocalStorage();
    toggleDefaultText();
    renderTasks();
}

function toggleDefaultText() {
    let flag = true;
    let tasksLength = 0;

    todoList.forEach(item => {
        if (item.isDone) {
            flag = false;
            ++tasksLength;
        }
    });

    if (flag) {
        defaultTasksDoneTextElem.textContent = 'На данный момент нет выполненных задач';
    } else {
        defaultTasksDoneTextElem.textContent = '';
    }

    if (todoList.length == 0 || tasksLength == todoList.length) {
    	console.log();
        defaultTasksTextElem.textContent = 'На данный момент нет задач';
    } else {
        defaultTasksTextElem.textContent = '';
    }
}

function showInfo(type) {
    infoElems.forEach(alert => {
        if (alert.id == type) {
            alert.style.display = 'block';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 1500);
        }
    });
}

function defaultInput(id) {
    todoList.forEach(task => {
        if (task.id == id) {
            replaceInput.value = task.text;
        }
    });

    updateLocalStorage();
}

function replaceTask(id) {
    todoList.forEach(task => {
        if (task.id == id) {
            task.text = replaceInput.value;
        }
    });
    if (regExp.test(replaceInput.value)) {
        replaceInput.value = '';
        replaceErrorText.style.display = 'none';
        formWrap.style.display = 'none';
        renderTasks();
        updateLocalStorage();
    } else {
        replaceErrorText.style.display = 'block';
    }
}

// ----------------------Обработчики------------------------

addBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const inputValue = inputElem.value;
    if (regExp.test(inputValue)) {
        errorMsg.style.display = 'none';
        inputElem.value = '';
        formWrap.style.display = 'none';
        addTaskInList(inputValue);
        showInfo(alertAdd);
    } else {
        errorMsg.style.display = 'block';
        inputElem.value = '';
    }
        toggleDefaultText();
});

tasksListElem.addEventListener('click', event => {
    const target = event.target;

    if (target.closest('.btn-success')) {
        const elem = target.closest('.item');
        const id = elem.dataset.taskId;
        toggleDoneFlag(id);
        showInfo(alertDone);
        toggleDefaultText();
    }

    if (target.closest('.btn-danger')) {
        const elem = target.closest('.item');
        const id = elem.dataset.taskId;
        deleteTask(id);
        showInfo(alertDelete);
        toggleDefaultText();
    }

    if (target.closest('.btn-warning')) {
        const elem = target.closest('.item');
        const id = elem.dataset.taskId;
        formWrap.style.display = 'flex';
        replaceInput.dataset.taskId = id;
        defaultInput(id);
        toggleDefaultText();
    }

});

tasksListDoneElem.addEventListener('click', event => {
    const target = event.target;

    if (target.classList == 'btn btn-secondary deleteBntInSucces') {
        const elem = target.closest('.item');
        const id = elem.dataset.taskId;
        deleteTask(id);
        showInfo(alertDelete);
        toggleDefaultText();
    }
});

closeBtn.addEventListener('click', () => {
    formWrap.style.display = 'none';
});

cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    formWrap.style.display = 'none';
});

formWrap.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList == 'form-wrap') {
        formWrap.style.display = 'none';
    }
});

replaceBtn.addEventListener('click', event => {
    event.preventDefault();
    const id = replaceInput.dataset.taskId;
    replaceTask(id);
});

function init() {
	if (localStorage.getItem('todoList')) {
    todoList = JSON.parse(localStorage.getItem('todoList'));
} else {
    JSON.stringify(localStorage.setItem('todoList', todoList));

}
	toggleDefaultText();
	renderTasks();
}

init();










