Creating a new Hoodie App
============================

    # this will take a while
    $ npm install -g local-tld
    $ brew install https://raw.github.com/janl/homebrew/1696ae6e52d4dc3f8d4c9967f037750e52de0d6d/Library/Formula/hoodie.rb
    $ hoodie new myappname
    $ cd myappname
    $ npm start
    # follow instructions, then open http://myappname.dev

Once your app is running, you can access your app's couch at `http://couch.myapp.dev`
and your app's admin backend at `http://admin.myapp.dev`


Troubleshooting
-----------------

make sure $NODE_PATH is set (path might eventually differ for you)

    $ echo $NODE_PATH 
    /usr/local/lib/node_modules

If things still do not work, try:

    & launchctl unload ~/Library/LaunchAgents/ie.hood.local-tld-service.plist
    $ launchctl load -Fw ~/Library/LaunchAgents/ie.hood.local-tld-service.plist"

If things STILL don't work, try that (but don't tell Jan)

    $ sudo $NODE_PATH/local-tld/bin/local-tld-troubleshoot
