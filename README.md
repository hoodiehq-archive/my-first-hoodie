# Creating a New Hoodie App

## Install on Mac

Prerequisites:

* Node.JS
  Either hit the big green “Install” button on http://nodejs.org
  Or, if you are using Homebrew:

  `$ brew install node`

* CouchDB
  
  `$ brew install couchdb`

(If any of these fail, run `brew update` to make sure your Homebrew version is up to date.)

Install with:

    $ npm install -g local-tld
    $ brew tap hoodiehq/homebrew-hoodie
    $ brew install hoodie

Create your first Hoodie app:

    $ hoodie new myappname

That created a folder "myappname". You are done. Start the app:

    $ cd myappname
    $ hoodie start

Now follow instructions, your browser should automatically open
http://myappname.dev

Once your app is running, you can access your app's couch at
http://couch.myapp.dev (Futon, CouchDB's web-based administration
at http://couch.myapp.dev/_utils) and your app's admin backend at
http://admin.myapp.dev

If you want to access your local hoodie installation from
other computers or mobile devices on the same local network,
you can use http://myapp.10.0.0.1.xip.io (assuming `10.0.0.1`)
is your machines local ip address.

## Install on Ubuntu/Linux

* Install Node.JS:
  Either hit the big green “Install” button on http://nodejs.org or via package manager [here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

* Install CouchDB: Follow the directions for your OS http://wiki.apache.org/couchdb/Installation

* Now clone this repo to a directory where you want to make a Hoodie app:

    `$ git clone https://github.com/hoodiehq/hoodie-cmd dirname`
    
* Run the 'hoodie' file:

    `$ bash hoodie new myappname`

That created a folder "myappname". Start the app:

    $ cd myappname
    $ npm start

You will be asked for a password for CouchDB. After which you can access your site at http://127.0.0.1:8080
and the admin backend at http://127.0.0.1:8090 with the password you just created.


## Modules

To install a specific module, run (in your app's directory):

    $ hoodie module install <name>

where `<name>` is one of the Hoodie Modules.

To uninstall use:

    $ hoodie module uninstall <name>

### List of Hoodie Modules

 * users (installed by default)
  - user sign up
  - user sign in
  - passwort forget
  - change username
  - change password

 * shares
  - make private objects public
  - share private objects with other users or groups

  ...


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

**Vhosts**

If you find Hoodie interfering with your vhosts, here's a temporary workaround:

To get your vhosts back: `$ sudo ipfw flush`

To get local-tld back: `$ npm install -g local-tld`

To find out which state you're in: `$ sudo ipfw list`
If this includes something like "00100 fwd 127.0.0.1,5999 tcp from any to me dst-port 80 in", local-tld is currently running and might be blocking your vhosts.

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
