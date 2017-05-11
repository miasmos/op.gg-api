op.gg-api
=========
Serves op.gg web pages as json.
  
  
Getting Started  
==========  
```
npm install op.gg-api
```  

Example  
==========  

Using the client
```
var gg = new (require('node_modules/op.gg-api/client.js'))

gg.Live('kr')
	.then((json) => {
		console.log(json)
	})
	.catch((error) => {
		console.error(error)
	})

gg.Live('kr', function(error, data) {
	console.log(error || data)
})
```

Using the server
```
node node_modules/op.gg-api/server
```

Endpoints
==========
v2.0 documentation currently in progress. For now, refer to server.js for endpoints and tests_spec.js for models.
  
Licence  
==========  
Copyright (c) 2015 Stephen Poole

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
