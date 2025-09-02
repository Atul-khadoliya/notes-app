import React, { useState } from 'react';
import apiClient from '../services/api';

const NoteForm = ({ token, onNoteCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post(
        '/notes/',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onNoteCreated(response.data);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create note.');
    }
  };

  return (
    <form onSubmit={handleCreateNote} className="note-form-container">
      <h3 className="note-form-title">Create a New Note</h3>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Content</label>
        <textarea
          className="form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button type="submit" className="btn add-btn">Add Note</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default NoteForm;
