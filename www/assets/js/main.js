"use strict";
// initialize Hoodie
var hoodie  = new Hoodie();

// Todos Collection/View
function Todos($element) {
  var collection = [];
  var $el = $element;

  $el.on('click', 'input[type=checkbox]', function() {
    hoodie.store.remove('todo', $(this).data('id'));
    return false;
  });

  function paint() {
    $el.html('');
    collection.sort(function(a, b) {
      return ( a.createdAt > b.createdAt ) ? 1 : -1;
    });
    for (var i = 0, len = collection.length; i<len; i++) {
      $el.append('<li><input data-id="' + collection[i].id + '" type="checkbox"> '+collection[i].title+'</li>');
    }
  }

  this.add = function(todo) {
    collection.push(todo);
    paint();
  };

  this.remove = function(todo) {
    for (var i = 0, len = collection.length; i < len; i++) {
      if (collection[i].id === todo.id) {
        collection.splice(i, 1);
        break;
      }
    }
    paint();
  };

  this.clear = function() {
    collection = [];
    paint();
  };
}

// Instantiate Todos collection & view.
var todos = new Todos($('#todolist'));

// initial load of all todo items from the store
hoodie.store.findAll('todo').then(function(allTodos) {
  allTodos.forEach(todos.add);
});

// when a new todo gets stored, add it to the UI
hoodie.store.on('add:todo', todos.add);
hoodie.store.on('remove:todo', todos.remove);
// clear todos when user logs out,
hoodie.account.on('signout', todos.clear);
// clear todos when user signsup, because post signup there's a full sync/reload
hoodie.account.on('signup', todos.clear);


// handle creating a new task
$('#todoinput').on('keypress', function(event) {
  if (event.keyCode === 13) { // ENTER
    hoodie.store.add('todo', {title: event.target.value});
    event.target.value = '';
  }
});
