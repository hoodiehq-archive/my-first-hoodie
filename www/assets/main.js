// initialize Hoodie
var hoodie  = new Hoodie()

// initial load of all todo items from the store
hoodie.store.findAll('todo').then( function(todos) {
  todos.sort( sortByCreatedAt ).forEach( addTodo )
})

// when a new todo gets stored, add it to the UI
hoodie.store.on('add:todo', addTodo)
// clear todo list when the get wiped from store
hoodie.account.on('signout', clearTodos)

// handle creating a new task
$('#todoinput').on('keypress', function(event) {
  if (event.keyCode == 13) { // ENTER
    hoodie.store.add('todo', {title: event.target.value});
    event.target.value = '';
  }
})

function addTodo( todo ) { 
  $('#todolist').append('<li>'+todo.title+'</li>');
}
function clearTodos() {
  $('#todolist').html('');
}
function sortByCreatedAt(a, b) { 
  return a.createdAt > b.createdAt
}