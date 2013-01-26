# Creating a new Hoodie App

    $ npm install -g local-tld
    $ git clone https://github.com/hoodiehq/hoodie-app-skeleton.git myapp
    $ cd myapp
    $ npm install
    $ npm start

Now you can go to `http://myapp.dev` to visit your app.

You also can your app's couch at `http://couch.myapp.dev`
and your app's admin backend at `http://admin.myapp.dev`

## Deplying to Nodejitsu

(NOTE: this is not wokring yet)

This assumes you have a nodejitsu account set up.

Configuration:

    $ jitsu config set port 8080
    # the other config vars from above
    ...

Deploy

    $ jitsu deploy
    ...
    ok.

You can now go to `http://yourapp.jit.su`. Boom