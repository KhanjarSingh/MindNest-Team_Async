import React, { useState } from 'react';
// Using axios is a bit cleaner for requests, but fetch is fine too.
// If you don't have axios, run: npm install axios
import axios from 'axios';
// 1. Removed the CSS import: import './addIdea.css';

// 2. Added the styles object back inside the component file
const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  message: {
    textAlign: 'center',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  }
};


const AddIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    description: '',
    demoLink: '',
    pitchDeckUrl: '',
    ppt_Url: '',
  });

  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('');
    setError('');
    setIsLoading(true); 

    try {
      
      const response = await axios.post('/api/v1/ideas', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      
      setMessage('Idea created successfully!');
      setFormData({
        title: '',
        pitch: '',
        description: '',
        demoLink: '',
        pitchDeckUrl: '',
        ppt_Url: '',
      });

    } catch (err) {
      console.error('Error response:', err.response?.data);
      console.error('Full error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Something went wrong';
      const details = err.response?.data?.details ? ` (${JSON.stringify(err.response.data.details)})` : '';
      setError(errorMsg + details);
    } finally {
      setIsLoading(false); 
    }
  };


  return (
    <div style={styles.container}>
      <h2>Submit Your New Idea</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="pitch" style={styles.label}>Pitch *</label>
          <textarea
            id="pitch"
            name="pitch"
            value={formData.pitch}
            onChange={handleChange}
            placeholder="A short summary of your idea (1-2 sentences)"
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your idea in detail"
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="demoLink" style={styles.label}>Demo Link (e.g., GitHub)</label>
          <input
            type="url"
            id="demoLink"
            name="demoLink"
            value={formData.demoLink}
            onChange={handleChange}
            placeholder="https://github.com/your-project"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="pitchDeckUrl" style={styles.label}>Pitch Deck URL (e.g., Google Slides)</label>
          <input
            type="url"
            id="pitchDeckUrl"
            name="pitchDeckUrl"
            value={formData.pitchDeckUrl}
            onChange={handleChange}
            placeholder="https://docs.google.com/..."
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="ppt_Url" style={styles.label}>PPT URL (Optional)</label>
          <input
            type="url"
            id="ppt_Url"
            name="ppt_Url"
            value={formData.ppt_Url}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          style={{...styles.button, ...(isLoading ? styles.buttonDisabled : {})}}
          disabled={isLoading} 
        >
          {isLoading ? 'Submitting...' : 'Submit Idea'}
        </button>

        {}
        {message && (
          <div style={{...styles.message, ...styles.successMessage}}>
            {message}
          </div>
        )}
        {error && (
          <div style={{...styles.message, ...styles.errorMessage}}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddIdea;