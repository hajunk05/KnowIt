require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const mongoose = require('mongoose')
const Note = require('./models/note')

mongoose.set('strictQuery', false)
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('MongoDB connected'))

// Find all notes OR Find all notes of specific date
app.get('/api/notes', async (req, res) => {
	try {
		const { date } = req.query
		const query = date ? { date } : {}
		const notes = await Note.find(query)
		res.json(notes)
	} catch (e) {
		next(e)
	}
})

// Find a note of a specific ID
app.get('/api/notes/:id', async (req, res) => {
	try {
		const id = req.params.id
		const note = await Note.findById(id)
		if (!note)
			return res
				.status(404)
				.json({ error: 'note not found' })
	} catch (e) {
		next(e)
	}
})

app.post('/api/notes', async (req, res) => {
	try {
		const { date, content } = req.body
		if (!date || !content) {
			return res
				.status(400)
				.json({ error: 'Data or content missing' })
		}
		const saved = await new Note({ date, content }).save()
		res.status(201).json(saved)
	} catch (e) {
		next(e)
	}
})

app.delete('/api/notes/:id', async (req, res) => {
	try {
		const deleted = await Note.findByIdAndDelete(
			req.params.id
		)
		if (!deleted)
			return res
				.status(404)
				.json({ error: 'note not found' })
		res.status(204).end()
	} catch {
		next(e)
	}
})

app.put('/api/notes/:id', async (req, res) => {
	try {
		const { date, content } = req.body
		if (!date || !content)
			return res
				.status(400)
				.json({ error: 'Update content missing' })
		const updateNote = { date, content }
		const updated = await Note.findByIdAndUpdate(
			req.params.id,
			updateNote,
			{
				new: true, // returns the updated doc
				runValidators: true, // enforces schema validation on update
				context: 'query', // needed for some validators and minlength.
			}
		)
		if (!updated)
			return res
				.status(404)
				.json({ error: `No note matches the ID ${id}` })
		res.json(updated)
	} catch (e) {
		next(e)
	}
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
	if (err.name === 'CastError') {
		return res
			.status(400)
			.json({ error: 'malformatted id' })
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}

	res.status(500).json({ error: 'server error' })
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Connected to PORT: ${PORT}`)
})
