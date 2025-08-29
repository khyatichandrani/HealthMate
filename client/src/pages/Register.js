import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    age: '',
    gender: '',
    contact: '',
    specialization: ''
  });

  const [errors, setErrors] = useState({}); // Track validation errors

  // Handle input changes, clear errors for current field on change
  const handleChange = e => {
    const { name, value } = e.target;

    // For contact, allow only digits (including empty)
    if (name === 'contact') {
      if (value === '' || /^[0-9\b]+$/.test(value)) {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors.contact) setErrors(prev => ({ ...prev, contact: '' }));
      }
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate all fields and return errors object
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required.';

    if (!form.email) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) newErrors.email = 'Email is invalid.';
    }

    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!form.role || !['patient', 'doctor'].includes(form.role)) {
      newErrors.role = 'Role is required.';
    }

    if (form.age) {
      const ageNum = Number(form.age);
      if (!Number.isInteger(ageNum) || ageNum <= 0) {
        newErrors.age = 'Age must be a positive integer.';
      }
    }

    // Gender can be optional, but if you want to validate:
    // if (!form.gender) newErrors.gender = 'Gender is required.';

    if (form.contact) {
      if (!/^\d+$/.test(form.contact)) {
        newErrors.contact = 'Contact number must contain digits only.';
      }
    }

    if (form.role === 'doctor' && !form.specialization.trim()) {
      newErrors.specialization = 'Specialization is required for doctors.';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      // Do not submit if validation errors exist
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/auth/register`, form);
      alert(res.data.message);
      // Optional: Reset form
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        age: '',
        gender: '',
        contact: '',
        specialization: ''
      });
      setErrors({});
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="form-center">
        <form onSubmit={handleSubmit} noValidate>
          <h2>Register</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            required
          />
          {errors.name && <small className="error-text">{errors.name}</small>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            required
          />
          {errors.email && <small className="error-text">{errors.email}</small>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
            required
          />
          {errors.password && <small className="error-text">{errors.password}</small>}

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className={errors.role ? 'input-error' : ''}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          {errors.role && <small className="error-text">{errors.role}</small>}

          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            name="age"
            placeholder="Age"
            min="1"
            value={form.age}
            onChange={handleChange}
            className={errors.age ? 'input-error' : ''}
          />
          {errors.age && <small className="error-text">{errors.age}</small>}

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            {/* Add more options or allow free text if needed */}
          </select>
          {errors.gender && <small className="error-text">{errors.gender}</small>}

          <label htmlFor="contact">Contact Number</label>
          <input
            id="contact"
            
            name="contact"
            placeholder="Contact Number"
            maxLength={10}
            value={form.contact}
            onChange={handleChange}
            className={errors.contact ? 'input-error' : ''}
            inputMode="numeric" // mobile number keyboard
            pattern="[0-9]*"
          />
          {errors.contact && <small className="error-text">{errors.contact}</small>}

          {form.role === 'doctor' && (
            <>
              <label htmlFor="specialization">Specialization</label>
              <input
                id="specialization"
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                className={errors.specialization ? 'input-error' : ''}
              />
              {errors.specialization && <small className="error-text">{errors.specialization}</small>}
            </>
          )}

          <div className="agreement">
            <input style={{ width: '10%' }} type="checkbox" required /> I agree to the
            <Link to="/terms"> Terms</Link> and <Link to="/privacy"> Privacy Policy</Link>
          </div>

          <button type="submit">Register</button>

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
