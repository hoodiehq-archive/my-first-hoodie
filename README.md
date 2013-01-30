# Creating a new Hoodie App

Prerequisits:

Node.JS

Either hit the big green “Install” button on http://nodejs.org

Or, if you are using Homebrew:

    $ brew install node

CouchDB

    $ brew install couchdb


Install with:

    $ npm install -g local-tld
    $ brew install https://raw.github.com/janl/homebrew/77400bc8fc5e8a19de88536cf20f31c32f4b74c2/Library/Formula/hoodie.rb

Create your first Hoodie app:

    $ hoodie new myappname

That created a folder "myappname". You are done. Start the app:

    $ cd myappname
    $ npm start

Now follow instructions, your browser should automatically open http://myappname.dev

Once your app is running, you can access your app's couch at `http://couch.myapp.dev`
and your app's admin backend at `http://admin.myapp.dev`


## Troubleshooting

Make sure that local-tld got installed correctly

    $ NODE_PATH=`npm root -g`
    $ open $NODE_PATH/local-tld

Make sure, that paths have been set corretly

    $ echo $NODE_PATH
    $ cat ~/Library/LaunchAgents/ie.hood.local-tld-service.plist

You should see `<string>/usr/local/lib/node_modules/local-tld/bin/local-tld-service</string>`,
`/usr/local/lib/node_modules` being what `$ npm root -g` returns.

If things do not work, try:

    $ launchctl unload ~/Library/LaunchAgents/ie.hood.local-tld-service.plist
    $ launchctl load -Fw ~/Library/LaunchAgents/ie.hood.local-tld-service.plist

If things STILL don't work, try that (but don't tell Jan) ((I saw this! — Jan))

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

Go to:

    http://nodejitsudb123456789.iriscouch.com:5984/_utils

In the bottom right, click on "Fix This". Create a new user with the username `admin` and a password of your choice. Remember the password.

Create the Nodejitsu app.

    $ jitsu apps create

Set your database URL as an environment variable:

    $ jitsu env set COUCH_URL http://nodejitsudb1234567890.iriscouch.com:5984
    $ jitsu env set HOODIE_ADMIN_PASS <yourpassword>

`<yourpassword>` is the one you set up two steps ago.

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
