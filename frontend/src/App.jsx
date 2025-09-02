import React, { useState, useEffect } from 'react';
import apiClient from './services/api';
import Auth from './components/Auth';
import NoteForm from './components/NoteForm';
import NoteItem from './components/NoteItem';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchNotes();
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      const response = await apiClient.get('/notes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const handleNoteCreated = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">📝 Notes App</h1>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="app-main">
        <section className="note-form-section card">
          <h2>Add a New Note</h2>
          <NoteForm token={token} onNoteCreated={handleNoteCreated} />
        </section>

        <section className="notes-list-section card">
          <h2>Your Notes</h2>
          {notes.length === 0 ? (
            <p className="empty-text">No notes yet. Start writing one!</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  token={token}
                  onNoteDeleted={handleDeleteNote}
                  onNoteUpdated={handleNoteUpdated}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
