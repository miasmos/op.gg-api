var gg = new (require('./client.js'))

// gg.Live('kr')
// 	.then((json) => {
// 		console.log(json)
// 	})
// 	.catch((error) => {
// 		console.error(error)
// 	})

gg.Renew('na', 47548873)
	.then((json) => {
		console.log(json)
	})
	.error((error) => {
		console.error(error)
	})