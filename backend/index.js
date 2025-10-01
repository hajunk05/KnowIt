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
	const { date } = req.query
	if (date) {
		const matchingDates = notes.filter(
			(n) => n.date === date
		)
		if (matchingDates.length < 1) {
			return res
				.status(404)
				.json({ error: 'No notes found for that date' })
		}
		return res.json(matchingDates)
	}
	return res.json(notes)
})

app.post('/api/notes', (req, res) => {
	const { date, content } = req.body
	if (!date || !content) {
		return res
			.status(400)
			.json({ Error: 'Date or content missing' })
	}
	const newNote = { date, content }
	notes = notes.concat(newNote)
	res.json(newNote)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Connected to PORT: ${PORT}`)
})
