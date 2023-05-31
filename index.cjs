const express = require('express');
const mongoose = require('mongoose');
const Mentor = require('./models/mentor');
const Student = require('./models/student');
require('dotenv').config();

const PORT = 9090;
const app = express();
app.use(express.json());


mongoose.connect('mongodb://localhost/mentor-student-db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


app.post('/mentors', async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json(mentor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mentor' });
  }
});


app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Assign Student to Mentor
app.post('/mentors/:mentorId/students', async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId);
    const students = await Student.find({ _id: { $in: studentIds } });

    if (!mentor || students.length !== studentIds.length) {
      return res.status(404).json({ error: 'Mentor or students not found' });
    }

    mentor.students.push(...students);
    await mentor.save();

    students.forEach(async (student) => {
      student.mentor = mentor;
      await student.save();
    });

    res.json({ message: 'Students assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign students' });
  }
});

// Assign or Change Mentor for Student
app.put('/students/:studentId/mentor', async (req, res) => {
    const { studentId } = req.params;
    const { mentorId } = req.body;
  
    try {
      const student = await Student.findById(studentId);
      const mentor = await Mentor.findById(mentorId);
  
      if (!student || !mentor) {
        return res.status(404).json({ error: 'Student or mentor not found' });
      }
  
      if (student.mentor) {
        const previousMentor = await Mentor.findById(student.mentor);
        previousMentor.students.pull(student);
        await previousMentor.save();
      }
  
      student.mentor = mentor;
      mentor.students.push(student);
  
      await student.save();
      await mentor.save();
  
      res.json({ message: 'Mentor assigned successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to assign mentor' });
    }
  });
  
  // Show all students for a particular mentor
  app.get('/mentors/:mentorId/students', async (req, res) => {
    const { mentorId } = req.params;
  
    try {
      const mentor = await Mentor.findById(mentorId).populate('students');
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }
  
      res.json(mentor.students);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  });
  
  // Show the past assigned mentor for a particular student
  app.get('/students/:studentId/mentor', async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const student = await Student.findById(studentId).populate('mentor');
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.json(student.mentor);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve mentor' });
    }
  });
  
  
  app.listen(PORT, ()=>console.log(`Server running in localhost:${PORT}`));
  
  
