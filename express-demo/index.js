const Joi = require('joi')
const express = require('express')
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

function validateCourse(course) {
    const courseSchema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, courseSchema)
}


app.get('/', (req, res) => {
    //put the documentation here afterwards
    res.send('Hello World')
})

app.get('/api/courses', (req,res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')

    res.send(course)
})

app.post('/api/courses', (req,res) => {
    const result = validateCourse(req.body)
    if(result.error)
        return res.status(400).send(result.error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req,res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')
    //Validate
    //if invalid, return 400 - bad request
    const { error } = validateCourse(req.body)

    if(error)
        return res.status(400).send(error.details[0].message)


    //update course
    //return the updated course
    course.name = req.body.name
    res.send(course)
})

app.delete('/api/courses', (req,res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course)
        return res.status(404).send('the course for the given ID was not found')
    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    res.send(courses)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))