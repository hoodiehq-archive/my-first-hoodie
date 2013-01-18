# Creating a new Hoodie App

    $ npm install -g local-tld
    $ git clone https://github.com/hoodiehq/hoodie-app-skeleton.git myapp
    $ cd myapp
    $ npm install
    $ port=8080 \
      couchdb_url=nodejitsudb12345.iriscouch.com \
      HOODIE_SERVER=http://nodejitsudb12345.iriscouch.com \
      HOODIE_ADMIN_USER=admin \
      HOODIE_ADMIN_PASS=party \
      node node_modules/hoodie-app/lib/hoodie-app.js  
      ...
      Your app is ready now.

Now you can go to `http://localhost:8080` to visit your app.
(TBD: that currently doesn’t actually work, you need to pudeploysh to nodejitsu)

## Deplying to Nodejitsu

This assumes you have a nodejitsu account set up.

Configuration:

    $ jitsu config set port 8080
    # the other config vars from above
    ...

Deploy

    $ jitsu deploy
    ...
    ok.

You can now go to `http://yourapp.jit.so`. Boom


## Installing the email confirmation worker

    $ npm install --save https://github.com/hoodiehq/worker-email-signup-confirmation.git

Starting the app now requires a few extra config variables:

    HOODIE_EMAIL_HOST=mail.gmail.com \
    HOODIE_EMAIL_USER=gmailusername \
    HOODIE_EMAIL_PASS=gamailpassword


