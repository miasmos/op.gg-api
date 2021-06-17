# op.gg-api

[![npm version](https://badge.fury.io/js/op.gg-api.svg)](https://badge.fury.io/js/op.gg-api)
[![Known Vulnerabilities](https://snyk.io/test/github/stephenpoole/op.gg-api/badge.svg)](https://snyk.io/test/github/stephenpoole/op.gg-api)
[![Build Status](https://travis-ci.com/stephenpoole/op.gg-api.svg?branch=master)](https://travis-ci.com/stephenpoole/op.gg-api)
[![codecov](https://codecov.io/gh/stephenpoole/op.gg-api/branch/master/graph/badge.svg?token=vlj5CxCF2a)](https://codecov.io/gh/stephenpoole/op.gg-api)

Serves op.gg web pages as json.

Getting Started  
==========  
`npm install op.gg-api`
or
`yarn add op.gg-api`

# Example

Initialize

```
import opgg, { Region } from 'op.gg-api';

const data = await opgg.live(Region.Korea)
console.log(data);
```

License  
==========  
Copyright (c) 2021 Stephen Poole

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
