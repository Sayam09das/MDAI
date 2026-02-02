import React, { useState, useEffect } from 'react'
import StudentAttendance from './StudentAttendance'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const getToken = () => localStorage.getItem("token")

const ReturnStudentAttendance = () => {
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/courses/teacher`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch courses')
        setCourses(data.courses || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Fetch students when a course is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStudents([])
        setSelectedStudent('')
        return
      }
      
      try {
        const res = await fetch(`${BACKEND_URL}/api/teacher/students`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Failed to fetch students')
        
        // Filter students who are enrolled in the selected course
        const filteredStudents = data.students?.filter(student =>
          student.enrolledCourses?.some(course => course.courseId === selectedCourse)
        ) || []
        setStudents(filteredStudents)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchStudents()
  }, [selectedCourse])

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value)
    setSelectedStudent('')
  }

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value)
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (error && courses.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Student Attendance</h2>

      {/* Course Selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Select Course *
        </label>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #ddd',
            fontSize: 16
          }}
        >
          <option value="">-- Select a Course --</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Student Selection */}
      {selectedCourse && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Select Student *
          </label>
          <select
            value={selectedStudent}
            onChange={handleStudentChange}
            style={{
              width: '100%',
              maxWidth: 400,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 16
            }}
          >
            <option value="">-- Select a Student --</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.fullName} ({student.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show message if no course/student selected */}
      {!selectedCourse && (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          background: '#f5f5f5',
          borderRadius: 8,
          color: '#666'
        }}>
          <p>Please select a course to view student attendance</p>
        </div>
      )}

      {selectedCourse && !selectedStudent && (
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          background: '#f5f5f5',
          borderRadius: 8,
          color: '#666'
        }}>
          <p>Please select a student to view their attendance</p>
        </div>
      )}

      {/* Show StudentAttendance when both course and student are selected */}
      {selectedCourse && selectedStudent && (
        <StudentAttendance courseId={selectedCourse} studentId={selectedStudent} />
      )}
    </div>
  )
}

export default ReturnStudentAttendance

