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
  
  var updatePreview = function() {
    var code = editor.getValue()
    localStorage.setItem('code', code)
    $preview.html( code )
  };

  hoodie.account.on('signout signin', updatePreview)

  $('.code-tab').on('shown', function() {
    editor.focus()
  })
  $('.preview-tab').on('shown', function() {
    updatePreview()
  })

  $preview.addClass('active')
})