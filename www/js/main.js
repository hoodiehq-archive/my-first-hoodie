window.hoodie  = new Hoodie()

$( function() {
  var editor = ace.edit("editor");
  // editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/html");
  editor.setValue( 'wtf?' )

  var $preview = $('#preview')

  var magic = hoodie.store.find('example', 'default')
  magic.done( function(object) {
    $preview.html( object.code )
    editor.setValue( object.code )
  })
  magic.fail( function() {
    var code = $('#preview').html()

    // clean up code a bit
    code = code.replace(/(^[^\n+]*\n|\n[^\n+]*$)/g, '');
    code = code.replace(/[ ]{12}/g, '');

    hoodie.store.save('example', 'default', {code: code})
    editor.setValue( code )
  })

  editor.getSession().on('change', function() {
    var code = editor.getValue()
    hoodie.store.update('example', 'default', {code: code})
    $preview.html( code )
  })
})