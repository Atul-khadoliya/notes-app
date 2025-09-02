import React, { useState } from 'react';
import apiClient from '../services/api';

const NoteItem = ({ note, token, onNoteDeleted, onNoteUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put(
        `/notes/${note.id}`,
        { title: editedTitle, content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onNoteUpdated(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onNoteDeleted(note.id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (isEditing) {
    return (
      <li className="note-item editing">
        <form onSubmit={handleUpdateNote} className="edit-form">
          <input
            type="text"
            className="form-input"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            required
          />
          <textarea
            className="form-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="note-actions">
            <button type="submit" className="btn save-btn">Save</button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="note-item">
      <div className="note-content">
        <h4 className="note-title">{note.title}</h4>
        <p className="note-text">{note.content}</p>
        <small className="note-share">
         
          <a
            href={`http://127.0.0.1:8000/share/${note.share_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
           
          </a>
        </small>
      </div>

      <div className="note-actions">
        <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="btn delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
