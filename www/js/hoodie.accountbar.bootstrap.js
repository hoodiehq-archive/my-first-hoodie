// extend Hoodie with Hoodstrap module
Hoodie.extend('hoodstrap', (function() {

  // Constructor
  function Hoodstrap(hoodie) {

    this.hoodie = hoodie

    // all about authentication and stuff
    this._hoodifyAccountBar()

    // update store
    this._displayLocalStore()

    // update store
    this._displayShares()

    // setup logging
    this._logHoodieEvents()
  }

  Hoodstrap.prototype = {

    humanizeData: function(data) {
      switch (typeof data) {
        case 'undefined':
          return '<em>undefined</em>'
        case 'string':
        case 'number':
        case 'boolean':
          return data
        case 'object':
          if (Array.isArray(data)) {
            return data.map(this.humanizeData).join(',')
          } else {
            var rows = []
            for (var key in data) {
              rows.push('<tr><th>' + key + ':</th><td>' + this.humanizeData(data[key]) + '</td></tr>')
            }
            return '<table>' + rows.join('') +  '</table>'
          }
      }
    },
    humanizeDataForEdit: function(data, indent) {
      if (!indent) indent = ''
      switch (typeof data) {
        case 'undefined':
          return ''
        case 'string':
        case 'number':
        case 'boolean':
          return data
        case 'object':
          if (Array.isArray(data)) {
            return data.map(this.humanizeData).join(',')
          } else {
            var rows = []
            for (var key in data) {
              if (/^\$/.test(key) || key === 'id') continue
              rows.push(indent + key + ': ' + this.humanizeDataForEdit(data[key], indent + '  '))
            }
            return rows.join('\n')
          }
      }
    },

    // 
    _hoodifyAccountBar: function() {
      this.$hoodieAccountBar = $('.hoodie-accountbar')
      this.hoodie.account.authenticate().then(this._handleUserAuthenticated.bind(this), this._handleUserUnauthenticated.bind(this));

      this.hoodie.account.on('signin', this._handleUserAuthenticated.bind(this))
      this.hoodie.account.on('signout', this._handleUserUnauthenticated.bind(this))
      this.hoodie.on('account:error:unauthenticated remote:error:unauthenticated', this._handleUserAuthenticationError.bind(this))
    },

    // 
    _handleUserAuthenticated: function(username) {
      $('html').attr('data-hoodie-account-status', 'signedin')
      this.$hoodieAccountBar.find('.hoodie-username').text(username)
    },

    // 
    _handleUserUnauthenticated: function() {
      $('html').attr('data-hoodie-account-status', 'signedout')
    },
    _handleUserAuthenticationError: function() {
      alert("Authentication Error. Please Sign In again.")
      this.$hoodieAccountBar.find('.hoodie-username').text(this.hoodie.account.username)
      $('html').attr('data-hoodie-account-status', 'error')
    },

    // 
    _logHoodieEvents: function() {
      this.$hoodieLogBody = $('.hoodie-log tbody')

      var remotePrefix = this.hoodie.remote.name + ':',
          events = [
            'account:signin',
            'account:signup',
            'account:signout',
            'account:error:unauthenticated',
            'account:passwordreset',

            'remote:error:server',
            'remote:remove',
            'remote:update',
            'remote:add',
            'remote:error:unauthenticated',

            'store:remove',
            'store:update',
            'store:add',
            'store:clear',
            'store:idle'
          ]

      for (var i = 0; i < events.length; i++) {
        this.hoodie.on(events[i], this._log(events[i]))
      }

      $('.hoodie-log').on('click', '.clear', function() {
        this.$hoodieLogBody.html('')
      }.bind(this))
    },

    // 
    _log: function(event) {
      return function(data, options) {
        var _ref, module, eventName, time, dataString;

        _ref       = event.split(/:/)
        module     = _ref[0]
        eventName  = [].slice.call(_ref, 1).join(':')
        time       = new Date().toTimeString().substring(0,8)
        dataString = this.humanizeData(data);
        optionsTag = options ? '<td>' + this.humanizeData(options) + '</td>' : ''

        this.$hoodieLogBody.prepend('<tr><td>'+time+'</td><td>'+module+'</td><td>'+eventName+'</td><td class="data">'+dataString+'</td></tr>') 
      }.bind(this)
    },

    // 
    _displayLocalStore: function() {
      new Store('store', this.hoodie.store, $('.hoodie-stores'))

      $('.hoodie-stores .add-share').click(function() {
        var shareId = prompt("share ID")
        if (! shareId) return
        new Store('share("'+shareId+'")', this.hoodie.share(shareId, {sync: true}).store, $('.hoodie-stores'))
      }.bind(this));
    },

    // 
    _displayShares: function() {
      this.$shareBody = $('.hoodie-shares tbody')

      this.hoodie.share.findAll()
      .done(function(shares) {
        var html = '';
        for (var i = 0; i < shares.length; i++) {
          html += this._shareToHtml(shares[i])
        }
        this.$shareBody.append(html)
      }.bind(this))
      .fail(function(error) {
        alert('Could not load shares, because: ' + error)
      })

      this.hoodie.store.on('add:$share', function(object) {
        console.log("add:$share", this.$shareBody)
        this.$shareBody.append(this._shareToHtml(object))
        console.log('add')
      }.bind(this))
      this.hoodie.store.on('update:$share', function(object) {
        this._getElementFor(object).replaceWith(this._shareToHtml(object))
      }.bind(this))
      this.hoodie.store.on('remove:$share', function(object) {
        this._getElementFor(object).remove()
      }.bind(this))
      this.hoodie.store.on('clear', function(object) {
        this.$shareBody.html('')
      }.bind(this))
    },

    _getElementFor: function(object) {
      return $('[data-hoodie-store-key="'+object.$type+'/'+object.id+'"]')
    },

    _shareToHtml: function(share) {
      var type        = '$share'
        , id          = share.id
        , rev         = share._rev || '-'
        , createdAt   = share.$createdAt
        , updatedAt   = share.$updatedAt
        , syncedAt    = share._$syncedAt
        , access      = share.access || '-' 
        , password    =share.password || '-'
           
      if (typeof access === 'object')
        access = JSON.stringify(access, '', 2)

      // stringify dates
      createdAt   = createdAt ? createdAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      updatedAt   = updatedAt ? updatedAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      syncedAt    =  syncedAt ?  syncedAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      
      return'<tr data-hoodie-store-key="'+type+'/'+id+'"><td>'+id+'</td><td>'+rev+'</td><td>'+createdAt+'</td><td>'+updatedAt+'</td><td>'+syncedAt+'</td><td class="data">'+access+'</td><td>'+password+'</td><td class="actions">'+actions+'</td></tr>'  
    }
  }

  // Store module
  function Store(name, store, $container) {
    this.name       = name
    this.nameId     = 'Store' + name.replace(/[^a-z0-9]/g, '')
    this.store      = store
    this.$container = $container

    this.store.findAll()
    .done(this._bootstrap.bind(this))
    .fail(function (error) {
      alert("Sorry, but " + name + "could not be loaded")
      alert(JSON.stringify(error, '', 2))
    })
  }

  Store.prototype = {

    // 
    _bootstrap: function(objects) {
      // add tab
      this.$container.find('.stores.nav li:last-child').before('<li><a id="'+this.nameId+'Tab" href="#'+this.nameId+'" data-toggle="tab">'+this.name+' <span class="badge count">0</span></a></li>')

      // add table
      this.$container.find('.stores.tab-content').append(
        '<div class="tab-pane" id="'+this.nameId+'">' +
        ' <table class="table table-condensed"> ' +
        '   <thead> ' +
        '     <tr> ' +
        '       <th>type</th> ' +
        '       <th>#</th> ' +
        '       <th>rev</th> ' +
        '       <th>created at</th> ' +
        '       <th>updated at</th> ' +
        '       <th>synced at</th> ' +
        '       <th class="data">data</th> ' +
        '     </tr> ' +
        '   </thead> ' +
        '   <tbody> ' +
        '   </tbody> ' +
        ' </table> ' +
        ' <p> ' +
        '   <button class="btn btn-primary" data-hoodie-action="store-add"><span class="icon-plus icon-white"></span> add</button> ' +
        '   <button class="btn" data-hoodie-action="store-clear"><span class="icon-trash"></span> clear</button> ' +
        ' </p> ' +
        '</div>')

      
      this.$container.find('#'+this.nameId).data('store', this.store)
      this.$storeBody = this.$container.find('tbody')
      var html = ''
      for (var i = 0; i < objects.length; i++) {
        html += this._objectToHtml(objects[i])
      }
      this.$storeBody.append(html)
      this.$container.find('#'+this.nameId+'Tab').tab('show')
      this._updateCount()
      this._bindToStoreEvents()
    },

    // 
    _bindToStoreEvents: function() {
      this.store.on('add', function(object) {
        this.$storeBody.append(this._objectToHtml(object))
        console.log('add')
      }.bind(this))
      this.store.on('update', function(object) {
        this._getElementFor(object).replaceWith(this._objectToHtml(object))
      }.bind(this))
      this.store.on('remove', function(object) {
        this._getElementFor(object).remove()
      }.bind(this))
      this.store.on('change', this._updateCount.bind(this))
      this.store.on('clear', function(object) {
        this.$storeBody.html('')
      }.bind(this))
    },

    _updateCount: function() {
      this.$container.find('.count').text( '?' )
    },

    // 
    _getElementFor: function(object) {
      return $('[data-hoodie-store-key="'+object.$type+'/'+object.id+'"]')
    },

    // 
    _objectToHtml: function(object) {
      var properties, type, id, rev, createdAt, updatedAt, data;

      properties  = $.extend({}, object)
      type        = properties.$type
      id          = properties.id
      rev         = properties._rev || '-'
      createdAt   = properties.$createdAt
      updatedAt   = properties.$updatedAt
      syncedAt    = properties._$syncedAt

      delete properties.$type
      delete properties.id
      delete properties._rev
      delete properties.$createdAt
      delete properties.$updatedAt
      delete properties._$syncedAt
      // delete properties.$createdBy

      createdAt = createdAt ? createdAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      updatedAt = updatedAt ? updatedAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      syncedAt  =  syncedAt ?  syncedAt.toISOString().substring(0,19).replace('T', ' ') : '-'
      data      = Hoodstrap.prototype.humanizeData(properties)
      editData  = Hoodstrap.prototype.humanizeDataForEdit(properties)
      actions   = '<a href="#" data-hoodie-action="store-edit" class="icon-pencil"></a><br><a href="#" data-hoodie-action="store-remove" class="icon-trash"></a>'
      return '<tr data-hoodie-store-key="'+type+'/'+id+'"><td>'+type+'</td><td>'+id+'</td><td>'+rev+'</td><td>'+createdAt+'</td><td>'+updatedAt+'</td><td>'+syncedAt+'</td><td class="data">'+data+'</td><td class="actions">'+actions+'</td></tr>'  
    }
  }

  return Hoodstrap
})() )


!function ($) {

  "use strict"; // jshint ;_;

 /* Hoodie DATA-API
  * =============== */

  $(function () {

    // bind to click events
    $('body').on('click.hoodie.data-api', '[data-hoodie-action]', function(event) {
      var $element = $(event.target)
        , action   = $element.data('hoodie-action')
        , key
        , modal
        , data
      
      switch(action) {
        case 'account-signout':
          window.hoodie.account.signOut()
          .fail(function(error) { 
            alert("Ooops, something went wrong");
          })
          break
        case 'account-destroy':
          if(! confirm("you sure? Destroy account with all its data?")) return;

          window.hoodie.account.destroy()
          .fail(function(error) { 
            alert("Ooops, something went wrong");
          })
          break
        case 'store-clear':
          if(confirm('you sure?')) hoodie.store.clear()
          break
        case 'store-remove':
          key   = $element.closest('[data-hoodie-store-key]').data('hoodie-store-key').split('/')
          hoodie.store.remove(key[0], key[1])
          break
        case 'store-add':
        case 'store-edit':
          modal = $('#hoodieStoreModal')
          modal.data('store', $element.closest('.tab-pane').data('store'))
          
          if (action === 'store-add') {
            modal.find('.store-add').show()
            modal.find('input[type=text], textarea').val('')
            modal.modal('show')
            return
          }

          modal.find('.store-add').hide()
          key   = $element.closest('[data-hoodie-store-key]').data('hoodie-store-key').split('/')
          hoodie.store.find(key[0], key[1])
          .done( function(object) {
            data = hoodie.hoodstrap.humanizeDataForEdit(object)

            modal.find('.data').attr('rows', data.split(/\n/).length + 3).val(data)
            modal.find('.type').val(object.$type)
            modal.find('.id').val(object.id)
            modal.modal('show')
          });
          
          break
        case 'share-add':
          hoodie.share.add()
          break
        case 'share-clear':
          if (! confirm('Are you sure?')) return

          hoodie.share.removeAll()
      }

      // event.preventDefault()
    })

    // bind to form submits
    $('body').on('submit.hoodie.data-api', '[data-hoodie-action]', function(event) {
      var $form = $(event.target)
        , action   = $form.data('hoodie-action')
        , username = $form.find('input.username').val()
        , password = $form.find('input.password').val()
        , email    = $form.find('input.email').val()
        , type     = $form.find('input.type').val()
        , id       = $form.find('input.id').val()
        , data     = $form.find('textarea.data').val()
        , attributes
        , store
        , update   = {}

      switch(action) {
        case 'account-signin':
          hoodie.account.signIn(username, password)
          .done(function() { 
            $form.find('.alert').remove()
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          break
        case 'account-signup':
          hoodie.account.signUp(username, password)
          .done(function() { 
            $form.find('.alert').remove()
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          break
        case 'account-changepassword':
          hoodie.account.changePassword(null, password)
          .done(function() { 
            $form.find('.alert').remove()
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          break
        case 'account-changeusername':
          hoodie.account.changeUsername(password, username)
          .done(function() { 
            $form.find('.alert').remove()
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          //
          break
        case 'account-resetpassword':
          hoodie.account.resetPassword(email)
          .done(function() {
            alert("send new password to " + email)
            $form.find('.alert').remove()
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          break
        case 'store-update':
          store = $form.closest('.modal').data('store')
          attributes = data.split(/\n/)

          for (var i = 0, key, value; i < attributes.length; i++) {
            key   = attributes[i].split(/\s*:\s*/)[0]
            value = attributes[i].split(/\s*:\s*/)[1]
            if(value === 'true') value = true
            if(value === 'false') value = false
            if(value == parseFloat(value)) value = parseFloat(value)
            update[key] = value
          }
          store.update(type, id, update)
          .done(function() { 
            $form.find('.alert').remove()
            $(event.currentTarget).closest('.modal').modal('hide')
          })
          .fail(function(error) { 
            $form.prepend('<div class="alert alert-error"><strong>'+error.error+':</strong> '+error.reason+'</div>')
          })
          
          break
      }

      event.preventDefault();
    })
  })

}(window.jQuery);