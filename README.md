# mentor-and-student-task


//Create Mentor (POST : http://localhost:9090/mentors)
Request : { "name": "Sanjai" }
Response :
{
  "_id": "60c4b492b8a64a001f2f77db",
  "name": "Sanjai",
  "students": []
}

//Create Student (POST : http://localhost:9090/students)
Request : { "name": "Sivabalan" }
Response :
{
  "_id": "60c4b4c8b8a64a001f2f77dc",
  "name": "Sivabalan",
  "mentor": null
}

//Assign Student to Mentor (POST : http://localhost:9090/mentors/:mentorId/students)
Request : { "studentIds": ["60c4b4c8b8a64a001f2f77dc"] }
Response :
{
  "message": "Students assigned successfully"
}

//Change Mentor for Student (PUT : http://localhost:9090/students/:studentId/mentor)
Request : { "mentorId": "60c4b492b8a64a001f2f77db" }
Response :
{
  "message": "Mentor assigned successfully"
}

//Show all students for a particular mentor (GET: http://localhost:9090/mentors/:mentorId/students)
//Show the past assigned mentor for a particular student (GET: http://localhost:9090/students/:studentId/mentor)
