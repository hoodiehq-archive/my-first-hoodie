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
npm install
```

Make sure to have a CouchDB with an admin account. Start the app with

```
npm start -- --dbUrl=http://admin:secret@localhost:5984
```

Cross fingers ✌ And if you see bugs, try to debug and fix them :)
