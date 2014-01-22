# Hoodie Deployment Guide

Note that this is a incomplete draft. It should get you going with production system, but there is no guarantee that there isn’t anything wrong with the setup form a performance or security perspective. Please check with your local sysadmin to make sure and please let us know if we can improve anything :)

This guide is for Linux only at this point. Other UNIXes should be covered too, with slight modifications.

## Install Dependencies:

 - Install CouchDB 1.2.0 or later, 1.4.0 or later recommended for performance.
 - Install NodeJS 0.10.0 or later.
 - Install nginx, any recent version will do.
 - Install Monit, any recent version will do.
 - Install git.


## Set Up

### CouchDB:

Hoodie is in development mode by default and there it starts its own CouchDB instance to manage. For production deployments, we recommend running CouchDB in a separate instance for various reasons like operational simplicity and security.

We assume you set up CouchDB with your package manager or manually following the installation procedure documented in the CouchDB source tree in the INSTALL.Unix file.

If you are already using CouchDB for other things, recommend starting a second instance of CouchDB that is completely separate from your original one. See below* for instructions.

For now we assume, your CouchDB is available at http://127.0.0.1:5984/

Create a CouchDB admin user called “admin” with a strong password of your choice at http://127.0.0.1:5984/_utils/ by clicking on the “Fix this” link in the lower right corner. Remember that password.

Next we want to change CouchDB’s default configuration on a few points. The easiest thing is to go to http://127.0.0.1:5984/_utils/config.html and edit the following fields (double click the value to get into the editing mode):

couchdb -> delayed_commits: false
couchdb -> max_dbs_open: 1024
couch_httpd_auth -> timeout: 1209600 ; that’s two weeks

### System

Add this to /etc/security/limits.conf:

```
hoodie    soft    nofile    768
hoodie    hard    nofile    1024
```

### Hoodie

Create a new system user:

```
useradd --system \
       --home /home/hoodie \
       --shell /bin/bash \
       --no-user-group \
       -c "Hoodie Administrator" hoodie
```

This will create a new user and its home directory `/home/hoodie`.

`cd` in to that directory.

As user Hoodie, install your application, either with Hoodie’s application template function:

```
[sudo -u hoodie] hoodie new appname githubname/reponame # think https://github.com/githubname/reponame
```

Or via a git checkout and manual setup

```
[sudo -u hoodie] git clone appname repourl
# make sure package.json has a valid `name` property.
[sudo -u hoodie] npm install
```

To start, copy over the script from this gist: https://gist.github.com/janl/b097f7a578ec07e4101c

```
wget https://gist.github.com/janl/b097f7a578ec07e4101c/raw/60d60bfe48506bbf5fb79b564c132ea8fc626f00/hoodie-daemon.sh
chmod +x hoodie-daemon.sh
```

It is meant to be run as `root`. It is also an early version of what should eventually be an `init.d` script should be, but we are not there yet, so bear with us :)

To launch Hoodie now, do this, as `root`:

```
HOODIE_ADMIN_PASS=yourcouchdbadminpasswordfromearlier ./hoodie-daemon.sh
```

That’s it! You can check if the setup was correct by checking the log files:

```
tail -f /home/hoodie/log/*
```

If you see any errors, check if you missed any steps from above. Let us know if you get stuck.

Your Hoodie app should now be running on http://127.0.0.1:6001/


## WWW

You likely want your Hoodie app to be listening on port 80 and maybe even have it available under a regular domain. The domain mapping is out of scope for this setup, but listening to port 80 can be done. On UNIX, non-admin users can’t run programs that bind to ports under 1024. But instead of running Hoodie as `root`, which we’d consider a security hazard. DO NOT RUN HOODIE AS `root`.

Instead we use some software that is battle tested and gives us a bonus feature that we think you are going to like.

We will be using nginx as an HTTP proxy. Other HTTP proxy software should be equally suitable, Apache 2, HAProxy are just two that came to mind. We are going with nginx because our hosting provider offers support for it, so we are going with that :)

We add a new file `/etc/nginx/vhosts.d/appname.conf` with the contents of https://gist.github.com/janl/2a8e6ebc80a25817dca0

You will need to adjust the domain name and paths to log files and SSL certificates and keys.

Once this is all set up, you can reload the nginx configuration:

```
[sudo] nginx reload
```

Now your app should be available on the public IP for that machine and from any domains that point to that domain. All requests should be automatically forwarded to HTTPS for security. DO NOT RUN HOODIE WITHOUT HTTPS.

### The Bonus Feature

Now all your app’s request will be served over HTTPS. nginx terminates the HTTPS and proxies to Hoodie over HTTP. We also told nginx to server `/` from your app’s `/www` directory and proxy only `/_api` to Hoodie instead of letting Hoodie serve the static files and the dynamic backend.

This has the advantage that in case of an issue with Hoodie, your clients will still be able to request all the static assets and should largely still be able to use your application. This is a big benefit of an offline-first architecture: Your users can keep using your app, even if the backend is down. While the design is meant for users to be offline, it also allows backends to be offline :)


## logrotate

We’ve set up a bunch of log files, you will want to make sure you don’t run out of space. Let’s set up log rotation in `/etc/logrotate.d/hoodie`:

```
/var/log/hoodie.std* {
       weekly
       rotate 10
       copytruncate
       delaycompress
       compress
       notifempty
       missingok
}
```

## Monit

Finally, we want to make sure that Hoodie stays up in healthy even if the main node process terminates for whatever reason. We are using Monit to watch and restart Hoodie on demand.

Create `/etc/monit.d/hoodie` with:
```
check process hoodie with pidfile /home/hoodie/log/hoodie.pid
  start program = "/home/hoodie/hoodie-daemon.sh start"
  stop program  = "/home/hoodie/hoodie-daemon.sh stop"
  if failed URL https://yourapp.com/_api then restart
```

Again, adjust with your app’s domain. This will restart if the `/_api` endpoints (Hoodie’s main API) is not available.

While we are here, we set up the same thing for nginx:

`/etc/monit.d/nginx`
check process nginx with pidfile /var/run/nginx.pid
  start program = "/etc/init.d/nginx start"
  stop program  = "/etc/init.d/nginx stop"
  if failed host 127.0.0.1 port 80 then restart
  if failed host 127.0.0.1 port 443 then restart


### *Set up a secondary CouchDB instance

TBD
