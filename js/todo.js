// State management todos
let todos = []

loadLS ()

// When new todo is added by button
document.querySelectorAll('.new-task-container button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    button.parentNode.querySelector('input').value = button.parentNode.querySelector('input').value.trim()
    if(button.parentNode.querySelector('input').value.length > 0){
      const todo = button.parentNode.querySelector('input').value
      button.parentNode.querySelector('input').value = ""
      createTodo(todo, false ,true)
      loadLS()
    }
  })
})

// When todo item is checked
document.querySelectorAll('.tasks-container').forEach(container => {
  container.addEventListener('click', function (e) {
    
    if (e.target.tagName == 'INPUT' ){
      const audio = new Audio("audio/todo_check.mp3");
      audio.play()
      e.target.parentNode.parentNode.classList.toggle('completed')
      updateLS(this)
      loadLS()
    }
    if (e.target.tagName == 'I') {
      const audio = new Audio("audio/todo_delete.mp3");
      audio.play()
      e.target.parentNode.parentNode.remove()
      updateLS(this)
      loadLS()
    }
  })
})

// creates a new todo given a task and status
function createTodo(todo, status = false, input = false) {
  const template = `
  <label class="checkbox">
    ${status ? '<input type="checkbox" checked>' : '<input type="checkbox">' }
    <span>${todo}</span>
  </label>
  <a>
    <i>delete</i>
  </a>`


  document.querySelectorAll('.tasks-container').forEach(taskContainer => {
    const div = document.createElement('div')
    div.innerHTML = template
    div.classList.add('task', 'small-padding', 'row', 'fill')
    if(status) {
      div.classList.add('completed')
    }
    console.log(taskContainer)
    taskContainer.appendChild(div)
    input ? updateLS(taskContainer) : ''
  })
  
  
}

// Updates todo localStorage
function updateLS (container) {
  todos = []
  container.querySelectorAll('.task').forEach(task => {
    const taskText = task.querySelector('span').innerText
    const status = task.querySelector('input').checked

    
    todos.push({todo : taskText, status: status})
  })
  saveLS()
}

// saves whole state to LS
function saveLS () {
  localStorage.setItem('list', JSON.stringify(todos) )
}

// loads all todos from localStorage
function loadLS () {
  document.querySelectorAll('.tasks-container').forEach(container => {
    container.innerHTML = ''
  })
  if (localStorage.getItem('list')) {
    todos = JSON.parse(localStorage.getItem('list'))
    todos.forEach(todo => {
      createTodo(todo.todo, todo.status)
    })
  }
}