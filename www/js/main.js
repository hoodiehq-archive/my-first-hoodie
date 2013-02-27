window.hoodie  = new Hoodie()

$( function() {
  var editor = ace.edit("editor");
  // editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/html");

  var $preview = $('#preview')
  var code = localStorage.getItem('code')

  if (code) {
    $preview.html( code )
    editor.setValue( code )
  } else {
    code = $('#preview').html()
    code = code.replace(/(^[^\n+]*\n|\n[^\n+]*$)/g, '');
    code = code.replace(/[ ]{12}/g, '');
    code = code.replace(/<ul id="todolist">.*<\/ul>/, '<ul id="todolist"></ul>');
    localStorage.setItem('code', code)
    editor.setValue( code )
  }

  editor.getSession().on('change', function() {
    var code = editor.getValue()
    localStorage.setItem('code', code)
    hoodie.unbind()
    $preview.html( code )
  })

  $('.code-tab').on('shown', function() {
    editor.focus()
  })

  $preview.addClass('active')
})