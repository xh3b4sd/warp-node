[![Build Status](https://travis-ci.org/zyndiecate/warp-node.png)](https://travis-ci.org/zyndiecate/warp-node)

#Warp

Integration-Test-Framework to simply request a server


## Install

    npm install warp-node


## Tests

    npm test


## Usage

```coffeescript
Warp = require "warp-node"


describe "topic", ->
  [ warp ] = []
  
  
  
  beforeEach ->
    warp = Warp.create()
    warp.request.url = "GET http://localhost:3000/ping"
    warp.request.repeat = 1
    warp.request.delay = 200
    warp.request.headers = { "x-forwarded-for": "127.0.0.1" }

    # Doing some asynchronous things, like starting a server and than call `warp.activate()`.
    warp.activate()


  
  it "should respond without errors", ->
    warp.execute (err, res, data) -> expect(err).toBeUndefined()


  
  it "should respond with status code 200", ->
    warp.execute (err, res, data) -> expect(res.statusCode).toEqual(200)


  
  it "should respond with 'pong'", ->
    warp.execute (err, res, data) -> expect(data).toEqual("pong")
```


## Reference


### Warp.create([options])

Creating a new `warp` instance. Options is optionally an object with the following properties.

```coffeescript
url: "GET http://localhost:3000/ping"   # Defining url for GET or POST requests including port and path
data: "foo"                             # Data to be send using POST requests
encoding: "UTF8"                        # Encoding of given data
resEncoding: "UTF8"                     # Encoding of receiving response
repeat: 5                               # Number of times the request have to be repeated
delay: 200                              # Number of milliseconds the request call have to be delayed
```

### warp.activate()

Activating the warp to get ready to test. This is usefull to starting a server what is mostly asynchonous.


### warp.request.url

Getter/Setter, defining url for GET or POST requests including port and path.


### warp.request.data

Getter/Setter, data to be send using POST requests.


### warp.request.encoding

Getter/Setter, encoding of given data.


### warp.request.resEncoding

Getter/Setter, encoding of receiving response.


### warp.request.repeat

Getter/Setter, number of times the request have to be repeated. `repeat`
defaults to 1. If it is set to something higher the response data format
changes from single values to lists of values for each call. See
[warp.execute](https://github.com/zyndiecate/warp-node#warpexecute-err-res-data).


### warp.request.delay

Getter/Setter, number of milliseconds the request call have to be delayed.


### warp.execute (err|errForCalls, res|resForCalls, data|dataForCalls)

Executing the test. Given callback provides the following information as single
items. If `warp.request.repeat` is set to something higher than 1, the provided
information are lists containing the data for each repeated request.

* `err`, error object if something went wrong, else `undefined`
* `res`, http response object
* `data`, string containing received payload
