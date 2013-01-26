origin = location.protocol + '//' + location.hostname
defaultHostname = origin.replace(location.hostname, 'api.' + location.hostname)

baseUrl = localStorage.getItem('baseUrl')

hoodie  = new Hoodie(baseUrl)
$('#hoodieBaseUrl').text(hoodie.baseUrl)
$('#changeHoodieBaseUrl').click(function(event) {
  $el = $(event.target)

  localStorage.setItem('baseUrl', prompt("enter hoodie base URL", defaultHostname))

  reload = function() { window.setTimeout( function() {
    location.reload()
  }, 3000) };
  
  hoodie.account.signOut()
    .done( reload )
    .fail( reload )
})

$hoodieAccountModal = $('#hoodieAccountModal')
.on('shown', function() {
  $hoodieAccountModal.find('input').eq(0).focus()
})
.on('hide', function() {
  $hoodieAccountModal.find('.alert').remove()
  $hoodieAccountModal.find('input').val('')
})

// 
hoodie.account.on('signin signup passwordreset', function() {
  $hoodieAccountModal.modal('hide')
});
