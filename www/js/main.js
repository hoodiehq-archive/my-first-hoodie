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
    localStorage.setItem('code', code)
    editor.setValue( code )
  }

  editor.getSession().on('change', function() {
    var code = editor.getValue()
    localStorage.setItem('code', code)
    hoodie.unbind()
    $preview.html( code )
  })
})