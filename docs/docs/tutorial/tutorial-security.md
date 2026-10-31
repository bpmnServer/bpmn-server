# Enabling Security
## Edit .env file
Default installation, disables `User Authentication` and `Security Rules`
To enable them, edit the .env file 

```
# -- Security Setting
# if true, would direct users to login page, requires registration
# valid values:	true	flase
# set to false if you just want to run in DEV environment
REQUIRE_AUTHENTICATION=false
ENFORCE_SECURITY=false
```
To:
```
REQUIRE_AUTHENTICATION=true
ENFORCE_SECURITY=true
```

## start the app
```
npm run start
```


Console will display:
```
bpmn-server WebApp.ts version 1.4.0
MongoDB URL mongodb://0.0.0.0:27017/bpmn
db connection open

App is running at http://localhost:3000 in development mode
  Press CTRL-C to stop

```