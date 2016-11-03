var gg = new (require('./client.js'))

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
