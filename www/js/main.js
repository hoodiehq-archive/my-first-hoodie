hoodie  = new Hoodie()

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
