# Creating a new Hoodie App

Install with:

    $ npm install -g local-tld
    $ brew install https://raw.github.com/janl/homebrew/1696ae6e52d4dc3f8d4c9967f037750e52de0d6d/Library/Formula/hoodie.rb --without-npm
    $ hoodie new myappname

That created a folder "myappname". You are done. Start the app:

    $ cd myappname
    $ npm start

Now follow instructions, your browser should automatically open http://myappname.dev

Once your app is running, you can access your app's couch at `http://couch.myapp.dev`
and your app's admin backend at `http://admin.myapp.dev`


## Troubleshooting

You need to have CouchDB run locally. Open http://localhost:5984 to confirm. 
Every hoodie app has its own sandboxed CouchDB configuration & databases, but we need the couchdb process to be running.

Make sure that local-tld got installed correctly

    $ open $NODE_PATH/local-tld

Make sure, that paths have been set corretly

    $ echo $NODE_PATH
    $ cat ~/Library/LaunchAgents/ie.hood.local-tld-service.plist

You should see `<string>/usr/local/lib/node_modules/local-tld/bin/local-tld-service</string>`,
`/usr/local/lib/node_modules` being what `$ echo $NODE_PATH` returns.

If things do not work, try:

    $ launchctl unload ~/Library/LaunchAgents/ie.hood.local-tld-service.plist
    $ launchctl load -Fw ~/Library/LaunchAgents/ie.hood.local-tld-service.plist"

If things STILL don't work, try that (but don't tell Jan)

    $ sudo $NODE_PATH/local-tld/bin/local-tld-troubleshoot


## No-Mac

`local-tld` is mac-only for now. If you are on another system, you can fake things until `local-tld` gains multi-platform support.

For your app `myapp` add this to your `/etc/hosts` file:

````
127.0.0.1 myapp.dev api.myapp.dev couch.myapp.dev

```

Note: there is still some stuff missing for `npm start` on non-mac.


## Deploy to Nodejitsu

You need a Nodejitsu account and the `jitsu` tool installed.

Create a new hoodie app:

    $ hoodie new myapp

Start app locally:

    $ cd myapp
    $ npm start

Create a database:

    $ jitsu database create couch myapp

This prints out the URL for your database, something like:

    http://nodejitsudb123456789.iriscouch.com:5984

Remember that.

Create the Nodejitsu app.

    $ jitsu apps create create

Set your database URL as an environment variable:

    $ jitsu env set COUCH_URL http://nodejitsudb123456789.iriscouch.com:5984

Deploy!

    $ jitsu deploy

(wait a minute)

Go to: `http://myapp.jit.su`

Boom.


## Deploy dreamcode tl;dr

    $ hoodie new myapp
    $ cd myapp
    $ npm start

    $ hoodie remote add nodejitsu
     - jitsu login
     - jitsu database create couch myapp
         - setup couchdb admin
     - jitsu apps create
     - jitsu env set COUCH_URL http://...
     - jitsu env set COUCH_PASS <secret>

    $ hoodie deploy
     - jitsu deploy
