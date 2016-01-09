# my-first-hoodie

> Default Hoodie app

[![Dependency Status](https://david-dm.org/hoodiehq/my-first-hoodie.svg)](https://david-dm.org/hoodiehq/my-first-hoodie)

# This is work in progress

see https://github.com/hoodiehq/my-first-hoodie/issues/83

## Local setup to work on CSS / HTML / JS

```
git clone git@github.com:hoodiehq/my-first-hoodie.git
cd my-first-hoodie
```

Edit the files in `www/` directly, open them directly in the browser. The
sign up / sign in won’t work, but the store should.

## Local setup to test new Hoodie

```
git clone git@github.com:hoodiehq/my-first-hoodie.git
cd my-first-hoodie
git checkout something-tracker
npm install --no-optional --production
```

If you want to test the password reset feature:

```
cp .hoodierc-example .hoodierc
# Edit transport config in .hoodierc, see https://www.npmjs.com/package/nodemailer
# account.notifications.notifications is passed into nodemailer.createTransport()
```

Make sure to have a CouchDB with an admin account (Password: secret).
Start the app with (replace "admin" & "secret" if you have a different
admin username or passwords).

```
npm start -- --dbUrl=http://admin:secret@localhost:5984
```

Cross fingers ✌ And if you see bugs, try to debug and fix them :)

So far, you can sign up for an account, and it will start syncing data.

For quick debugging, you can run this in your web browser console

```js
// random username
localStorage.clear()
username = 'user' + Math.random().toString(16).substr(2)

// sign up
hoodie.account.signUp({
  username: username,
  password: 'secret'
})
.then(function () {
  //sign in
  return hoodie.account.signIn({
    username: username,
    password: 'secret'
  })
})

// - a _users doc "org.couchdb.user:{hoodie.account.username}" was created
// - a database "user/{hoodie.account.id}" was created
// - all data you add gets synced now
```

## Run tests

Install devDependencies by running `npm install` without `--production`

```
npm install --no-optional
npm test
```

## What’s next?

- help us make `my-first-hoodie` a great experience! We want to keep it
  intentionally simple, so people can play / extend it. To make it as accessible
  (hackable) as possible, we want to keep the HTML / CSS / JS code to a minimum
  and not use 3rd party libraries at all if possible.
- on Hoodie itself, we prepared great starter issues: [starter issues](http://go.hood.ie/hoodie-starter-issues).
- We have harder ones, too, if you feel adventurous :) Remote the "starter" label
  from the filter
- The core team (everyone welcome!) focusses on replacing the current ducktape
  code to make this first new Hoodie app possible and to make the code as clean
  as all the other sub modules that Hoodie uses
- Next up we want to make CouchDB optional, to make it even simpler to get started
  with the new Hoodie
- Happy new Year! 🎉🐶🍾
