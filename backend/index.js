const express = require('express')
const app = express()
app.use(express.json())

// Example notes before any MongoDB
let notes = [
	{
		id: 1,
		date: '2025-09-30',
		content: 'Today I learn many tings',
	},
	{
		id: 2,
		date: '2025-09-30',
		content: 'Tomorrow I will learn many things',
	},
]

// Find all notes OR Find all notes of specific date
app.get('/api/notes', (req, res) => {
	const { date } = req.query
	if (date) {
		const dateMatches = notes.filter((n) => n.date === date)
		if (dateMatches.length < 1) {
			return res.status(200).json([])
		}
		return res.json(dateMatches)
	}
	return res.json(notes)
})

// Find a note of a specific ID
app.get('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find((n) => n.id === id)
	if (!note) {
		return res
			.status(404)
			.json({ error: `Missing note of the ID ${id}` })
	}
	return res.json(note)
})

app.post('/api/notes', (req, res) => {
	const { date, content } = req.body
	if (!date || !content) {
		return res
			.status(400)
			.json({ error: 'Date or content missing' })
	}
	const newId =
		notes.length > 0
			? Math.max(...notes.map((n) => n.id)) + 1
			: 1
	const newNote = { id: newId, date, content }
	notes = notes.concat(newNote)
	return res.status(201).json(newNote)
})

app.delete('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	const updatedNotes = notes.filter((n) => n.id !== id)
	if (notes.length === updatedNotes.length) {
		return res
			.status(404)
			.json({ error: `Missing note of ID ${id}` })
	}
	notes = updatedNotes
	res.status(204).end()
})

app.put('/api/notes/:id', (req, res) => {
	const id = Number(req.params.id)
	const { content } = req.body

	if (!content) {
		return res
			.status(400)
			.json({ error: 'Content missing' })
	}

	const noteIndex = notes.findIndex((n) => n.id === id)

	if (noteIndex === -1) {
		return res
			.status(404)
			.json({ error: `Note with ID ${id} not found` })
	}
	notes[noteIndex] = { ...notes[noteIndex], content }
	return res.json(notes[noteIndex])
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Connected to PORT: ${PORT}`)
})
