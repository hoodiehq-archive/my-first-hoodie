# Hoodie Deployment Guide

Note that this is an incomplete draft. It should get you going with a production system, but there is no guarantee that there is not anything wrong with this setup form a performance or security perspective. Please check with your local sysadmin to make sure and please let us know if we can improve anything. :)

This guide is for Linux only at this point. Other UNIXes should be covered too, with slight modifications.

## Install Dependencies:

 - Install CouchDB 1.2.0 or later (1.4.0 or later recommended for performance)
 - Install NodeJS 0.10.0 or later
 - Install a recent version of nginx
 - Install a recent version of Monit
 - Install git

## Set Up

### CouchDB:

Hoodie is in development mode by default and there it starts its own CouchDB instance to manage. For production deployments, we recommend running CouchDB in a separate instance for various reasons like operational simplicity and security.

We assume you set up CouchDB with your package manager or manually following the installation procedure documented in the CouchDB source tree in the INSTALL.Unix file.

If you are already using CouchDB for other things, we recommend starting a second instance of CouchDB that is completely separate from your original one. See the *Set up a secondary CouchDB instance* section for details.

For now we assume that your CouchDB is available at http://127.0.0.1:5984/

Create a CouchDB admin user called "admin" with a strong password of your choice at http://127.0.0.1:5984/_utils/ by clicking on the **Fix this** link in the lower right corner. Remember that password.

Next, we want to change the default CouchDB configuration. The easiest way to do so is to visit http://127.0.0.1:5984/_utils/config.html and edit the following fields (double click the value to edit):

```
couchdb -> delayed_commits: false
couchdb -> max_dbs_open: 1024
couch_httpd_auth -> timeout: 1209600 ; that's two weeks
```

### System

Increase the number of available open files for the Hoodie user by adding this to `/etc/security/limits.conf`:

```
hoodie    soft    nofile    768
hoodie    hard    nofile    1024
```

### Hoodie

Create the hoodie user system account:

```
useradd --system \
       -m \
       --home /home/hoodie \
       --shell /bin/bash \
       --no-user-group \
       -c "Hoodie Administrator" hoodie
```

This will create a new user with the home directory `/home/hoodie`.

Change into that directory:

```
cd /home/hoodie
```

Install the Hoodie command line interpreter:

```
npm install -g hoodie-cli
```

As the *hoodie* user, install your application, either with Hoodie's application template function:

```
[sudo -u hoodie] hoodie new appname githubname/reponame # think https://github.com/githubname/reponame
```

or via a git checkout and manual setup:

```
[sudo -u hoodie] git clone repourl appname
# make sure package.json has a valid `name` property.
[sudo -u hoodie] npm install
```

To start, copy over the script from this gist: https://gist.github.com/janl/b097f7a578ec07e4101c

```
wget https://gist.githubusercontent.com/janl/b097f7a578ec07e4101c/raw/01ab9816f64660075e6fe9e5a787545097f22da8/hoodie-daemon.sh
chmod +x hoodie-daemon.sh
```

This script is meant to be run as the `root` user. It is also an early version of what an `init.d` script could be, but we are not there yet, so bear with us. :)

To launch Hoodie, run the following as the `root` user:

```
HOODIE_ADMIN_PASS=yourcouchdbadminpasswordfromearlier ./hoodie-daemon.sh start
```

That's it!

You can check if the setup was correct by checking the log files:

```
tail -f /home/hoodie/log/*
```

If you see any errors, check if you missed any steps from above. Let us know if you get stuck.

Your Hoodie app should now be running on http://127.0.0.1:6001/


## WWW

You likely want your Hoodie app to be listening on port 80 and maybe even have it available under a regular domain. The domain mapping is out of scope for this guide, but listening on port 80 can be done.

On a Unix-like operating system, non-administrator users cannot run programs that bind to privileged ports (those ports numbered less than 1024).

**However, DO NOT RUN HOODIE AS THE `root` USER**.

Instead of running Hoodie as the `root` user, which we'd consider a security hazard,  we use some software that is battle tested and gives us a bonus feature that we think you are going to like.

We will be using nginx as an HTTP proxy. Other HTTP proxy software should be equally suitable, Apache 2 and HAProxy are just two that come to mind. We are going with nginx because our hosting provider offers support for it. :)

Add a new virtual host file at `/etc/nginx/vhosts.d/appname.conf` with the contents of https://gist.github.com/janl/2a8e6ebc80a25817dca0

You will need to adjust the domain name and paths to log files and SSL certificates and keys for your particular setup.

**NOTE**: Due to an [issue](https://www.ruby-forum.com/topic/4412004) with SSL session termination, we recommend using HAProxy to do the SSL termination in front of nginx. Example configuration will be added later.

Once this is all set up, you can reload the nginx configuration:

```
[sudo] nginx reload
```

Now your app should be available on the public IP for that machine and from any domains that point to that domain. All requests should be automatically forwarded to HTTPS for security. **DO NOT RUN HOODIE WITHOUT HTTPS**.

### The Bonus Feature

Now all your app's requests will be served over HTTPS. nginx terminates the HTTPS and proxies to Hoodie over HTTP. We also told nginx to serve `/` from your app's `/www` directory and proxy only `/_api` to Hoodie instead of letting Hoodie serve the static files and the dynamic backend.

This has the advantage that in case of an issue with Hoodie, your clients will still be able to request all the static assets and should largely still be able to use your application. This is a big benefit of an offline-first architecture: Your users can keep using your app, even if the backend is down. While the design is meant for users to be offline, it also allows backends to be offline. :)

## logrotate

We've set up a bunch of log files, you will want to make sure you don't run out of space. Let's set up log rotation by creating `/etc/logrotate.d/hoodie` with the following content:

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

Create `/etc/monit.d/hoodie` with the following content:
```
check process hoodie with pidfile /home/hoodie/log/hoodie.pid
  start program = "/home/hoodie/hoodie-daemon.sh start"
  stop program  = "/home/hoodie/hoodie-daemon.sh stop"
  if failed URL https://yourapp.com/_api then restart
```

Again, adjust with your app's domain. This will restart if the `/_api` endpoints (Hoodie's main API) is not available.

While we are here, go ahead and set up the same thing for nginx by creating `/etc/monit.d/nginx` with the following content:

```
check process nginx with pidfile /var/run/nginx.pid
  start program = "/etc/init.d/nginx start"
  stop program  = "/etc/init.d/nginx stop"
  if failed host 127.0.0.1 port 80 then restart
  if failed host 127.0.0.1 port 443 then restart
```

### Set Up Secondary CouchDB Instance

TBD
