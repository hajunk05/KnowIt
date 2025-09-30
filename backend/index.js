const express = require('express')
const app = express()
app.use(express.json())

// Example notes before any MongoDB
let notes = [
	{
		date: '2025-09-30',
		content: 'Today I learn many tings',
	},
	{
		date: '2025-09-30',
		content: 'Tomorrow I will learn many things',
	},
]

app.get('/api/notes', (req, res) => {
	res.json(notes)
})

PORT = 3001
app.listen(PORT, () => {
	console.log(`Connected to PORT: ${PORT}`)
})
