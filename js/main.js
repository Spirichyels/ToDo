//Находим элементы на странице

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList')

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach((task) => renderTask(task));


checkEmptyList();
 


// Добавление задачи
form.addEventListener('submit', addTask);
// Удаление задачи
taskList.addEventListener('click', deleteTask);
// Отмечаем задачу завершенной
taskList.addEventListener('click', doneTask);









// Функции
function addTask(event){
	//Отменяем отправку формы
	event.preventDefault();
	//console.log('SUBMIT!!!');

	//Достаем текст задачи из поля ввода
	const taskText = taskInput.value;

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	};

	// Добавляем задачу в массив с задачами
	tasks.push(newTask);

	// Добавляем задачу в хранилище браузера localsorage
	saveToLocalStorage();
	
	// Рендерим задачу на странице
	renderTask(newTask);


	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = ""
	taskInput.focus()

	// Проверка. Если в списке задач более 1-го элемента, скрываем блок 
	// if(taskList.children.length > 1) {
	// 	emptyList.classList.add('none');
	// }

	checkEmptyList();
}

function deleteTask(event) {
	//Проверяем если клик был НЕ по кнопке "удалить задачу"
	if(event.target.dataset.action !== 'delete') return;
	// Проверяем что клик был по кнопке "удалить задачу"
	const parenNode = event.target.closest('.list-group-item');


	// Определяем ID задачи
	const id = Number(parenNode.id);
	
	// Находим индекс задачи в массиве
	const index = tasks.findIndex((task) => task.id === id);

	//Удаляем задачу из массива с задачами
	tasks.splice(index,1);
	// Удаляем задачу из разметки
	parenNode.remove();
	// Проверка. Если в списке задач 1 элемент, скрываем блок 
	// if(taskList.children.length === 1) {
	// emptyList.classList.remove('none');
	// }

	// Добавляем задачу в хранилище браузера localsorage
	saveToLocalStorage();
	checkEmptyList();
	
}

function doneTask(event) {
	// Проверяем что клик был НЕ по кнопке "Задача выполнена"
	if(event.target.dataset.action !== 'done') return;
	const parenNode = event.target.closest('.list-group-item');
	const taskTitle = parenNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');


	// Определяем id задачи
	const id = Number(parenNode.id);

	const task = tasks.find(function(task) {
		if( task.id === id) {
			return true;
		}
	})

	task.done = !task.done;

	// Добавляем задачу в хранилище браузера localsorage
	saveToLocalStorage();

}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
		<div class="empty-list__title">Список дел пуст</div>
		</li>`;

		taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Форумируем разметку для новой задачи
	const taskHTML = ` 
	<li id="${task.id}"class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18">
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18">
		</button>
	</div>
	</li>`;
	


	// Добавляем задачу на страницу
	taskList.insertAdjacentHTML('beforeend', taskHTML);
}


