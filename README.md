Creating a new Hoodie App
============================

before installing, make sure $NODE_PATH is set (path might eventually differ for you)

    $ echo $NODE_PATH 
    /usr/local/share/npm/lib/node_modules

then install with:

    $ npm install -g local-tld
    $ brew install https://raw.github.com/janl/homebrew/1696ae6e52d4dc3f8d4c9967f037750e52de0d6d/Library/Formula/hoodie.rb --without-npm
    $ hoodie new myappname

That created a folder "myappname". You are done. Start the app:

    $ cd myappname
    $ npm start

Now follow instructions, your browser should automatically open http://myappname.dev

Once your app is running, you can access your app's couch at `http://couch.myapp.dev`
and your app's admin backend at `http://admin.myapp.dev`


Troubleshooting
-----------------

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

