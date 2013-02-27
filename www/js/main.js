window.hoodie  = new Hoodie()

$( function() {
  var $preview = $('#preview')
  var $code = $('#code textarea')

  var magic = hoodie.store.find('example', 'default')
  magic.done( function(object) {
    $preview.html( object.code )
    $code.val( object.code )
  })
  magic.fail( function() {
    var code = $('#preview').html()
    code = code.replace(/(^[^\n+]*\n|\n[^\n+]*$)/g, '');
    code = code.replace(/[ ]{12}/g, '');
    window.code = code
    console.log('code', code)
    hoodie.store.save('example', 'default', {code: code})
    $code.val( code )
  })

  $code.on('change', function() {
    var code = $code.val()
    hoodie.store.update('example', 'default', {code: code})
    $preview.html( code )
  })
})