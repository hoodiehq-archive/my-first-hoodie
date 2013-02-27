// extend Hoodie with Hoodstrap module
Hoodie.extend('hoodstrap', (function() {

  // Constructor
  function Hoodstrap(hoodie) {

    this.hoodie = hoodie

    // all about authentication and stuff
    this.hoodifyAccountBar()
  }

  Hoodstrap.prototype = {

    // 
    hoodifyAccountBar: function() {
      this.$hoodieAccountBar = $('.hoodie-accountbar')
      this.hoodie.account.authenticate().then(this.handleUserAuthenticated.bind(this), this.handleUserUnauthenticated.bind(this));

      this.hoodie.account.on('signin', this.handleUserAuthenticated.bind(this))
      this.hoodie.account.on('signout', this.handleUserUnauthenticated.bind(this))
      this.hoodie.on('account:error:unauthenticated remote:error:unauthenticated', this.handleUserAuthenticationError.bind(this))
    },

    // 
    handleUserAuthenticated: function(username) {
      $('html').attr('data-hoodie-account-status', 'signedin')
      this.$hoodieAccountBar.find('.hoodie-username').text(username)
    },

    // 
    handleUserUnauthenticated: function() {
      $('html').attr('data-hoodie-account-status', 'signedout')
    },
    handleUserAuthenticationError: function() {
      this.$hoodieAccountBar.find('.hoodie-username').text(this.hoodie.account.username)
      $('html').attr('data-hoodie-account-status', 'error')
    }
  }

  return Hoodstrap
})() );


!function ($) {

  "use strict"; // jshint ;_;

 /* Hoodie DATA-API
  * =============== */

  $(function () {

    // bind to click events
    $('body').on('click.hoodie.data-api', '[data-hoodie-action]', function(event) {
      var $element = $(event.target),
          action   = $element.data('hoodie-action');
      
      switch(action) {
        case 'account-signout':
          window.hoodie.account.signOut()
          break
        case 'account-destroy':
          if( window.confirm("you sure? Destroy account with all its data?") ) {
            window.hoodie.account.destroy()  
          }
          break
      }
    })

    // bind to form submits
    $('body').on('submit.hoodie.data-api', '[data-hoodie-action]', function(event) {
      event.preventDefault();

      var $form    = $(event.target),
          action   = $form.data('hoodie-action'),
          username = $form.find('input.username').val(),
          password = $form.find('input.password').val(),
          email    = $form.find('input.email').val(),
          magic;

      switch(action) {
        case 'account-signin':
          magic = window.hoodie.account.signIn(username, password)
          break
        case 'account-signup':
          magic = window.hoodie.account.signUp(username, password)
          break
        case 'account-changepassword':
          magic = window.hoodie.account.changePassword(null, password)
          break
        case 'account-changeusername':
          magic = window.hoodie.account.changeUsername(password, username)
          break
        case 'account-resetpassword':
          magic = window.hoodie.account.resetPassword(email)
          .done(function() {
            window.alert("send new password to " + email);
          })
          break
      }

      magic.done(function() { 
        $form.find('.alert').remove()
        $(event.currentTarget).closest('.modal').modal('hide')
      })
      magic.fail(function(error) { 
        $form.find('.alert').remove()
        $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
      })
    })

    var $modal = $('.modal')
    .on('shown', function() {
      $modal.find('input:visible').eq(0).focus()
    })
    .on('hide', function() {
      $modal.find('.alert').remove()
      $modal.find('input, textarea').val('')
    })
  })
}( window.jQuery )