# School Project
## A secure login

* Login and register encrypt with md5 passwd + email b4 sending to server.
* Server uses bcrypt with a secret to generate salt and hash the passwd received.
* Stores in a mlab mongo db.
* mlab USER and PASSWD set in env vars.
* deployed to heroku: http://istecsecureloginserver.herokuapp.com/
