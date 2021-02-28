import { getDataFromApi, addTaskToApi, deleteTaskToApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$taskAddButton = this.$taskForm.querySelector('button');
  }

  toggleDisable() {
    this.$taskAddButton.innerText =
      this.$taskAddButton.innerText == 'Add Task' ? 'Loading...' : 'Add Task';
    this.$taskAddButton.disabled = this.$taskAddButton.disabled ? false : true;
  }

  addTask(task) {
    this.toggleDisable();
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.toggleDisable();
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.setAttribute('data-id', task.id);
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><td><button type="button" data-id="${task.id}" class="delete btn btn-danger"><i data-id="${task.id}" class="fa fa-trash delete"></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  handleDeleteTask() {
    document
      .getElementById('table-tbody')
      .addEventListener('click', (event) => {
        if (event.target.className.includes('delete')) {
          let dataID = event.target.getAttribute('data-id');
          console.log(dataID);
          deleteTaskToApi(dataID).then(
            event.currentTarget
              .querySelector(`tr[data-id='${dataID}']`)
              .remove()
          );
        }
      });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleDeleteTask();
  }
}

export default PomodoroApp;
