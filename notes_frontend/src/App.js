import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

// Color & Theme palette (can be set via CSS variables for easy overrides)
const COLOR = {
  accent: "#FFCA28",
  primary: "#1976D2",
  secondary: "#424242",
};

const demoNotes = [
  {
    id: "1",
    title: "Welcome to Notes!",
    content: "Click any note or create a new one to get started.",
    updated: Date.now() - 86400000,
  },
  {
    id: "2",
    title: "React minimal notes",
    content: "This is a simple React notes app.",
    updated: Date.now() - 43200000,
  },
];

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// PUBLIC_INTERFACE
function App() {
  // Notes state
  const [notes, setNotes] = useState([]);
  // Current note (id, temp working state)
  const [selectedId, setSelectedId] = useState(null);
  // Search/filter state
  const [search, setSearch] = useState("");
  // Sidebar toggle (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ================ LOAD/INIT DEMO NOTES ======================
  useEffect(() => {
    // Simulate notes in localStorage
    const saved = localStorage.getItem("notes_data");
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      setNotes(demoNotes);
      localStorage.setItem("notes_data", JSON.stringify(demoNotes));
    }
  }, []);

  // ================ SAVE NOTES TO localStorage ===================
  useEffect(() => {
    localStorage.setItem("notes_data", JSON.stringify(notes));
  }, [notes]);

  // ================ SELECTED NOTE SYNCH ======================
  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) || null,
    [notes, selectedId]
  );

  // ================ SEARCH LOGIC ======================
  const filteredNotes = useMemo(() => {
    if (!search) return notes.slice().sort((a, b) => b.updated - a.updated);
    const term = search.toLowerCase();
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          (n.content && n.content.toLowerCase().includes(term))
      )
      .sort((a, b) => b.updated - a.updated);
  }, [notes, search]);

  // PUBLIC_INTERFACE
  function handleSelectNote(id) {
    setSelectedId(id);
    setSidebarOpen(false);
  }

  // PUBLIC_INTERFACE
  function handleCreateNote() {
    const newNote = {
      id: generateId(),
      title: "Untitled",
      content: "",
      updated: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
    setSidebarOpen(false);
  }

  // PUBLIC_INTERFACE
  function handleDeleteNote(id) {
    if (window.confirm("Delete this note?")) {
      const idx = notes.findIndex((n) => n.id === id);
      if (idx !== -1 && notes[idx].id === selectedId) {
        // select next note or clear
        const remaining =
          notes.length > 1
            ? notes.filter((n) => n.id !== id)
            : [];
        setNotes(remaining);
        if (remaining.length) {
          setSelectedId(remaining[0].id);
        } else {
          setSelectedId(null);
        }
      } else {
        setNotes(notes.filter((n) => n.id !== id));
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleUpdateNote(field, value) {
    if (!selectedNote) return;
    setNotes(
      notes.map((n) =>
        n.id === selectedId
          ? { ...n, [field]: value, updated: Date.now() }
          : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleSidebarToggle() {
    setSidebarOpen((open) => !open);
  }

  // =========== UI STYLES (Inline for minimalism/app override) ==================
  const styles = {
    app: {
      display: "flex",
      minHeight: "100vh",
      background: "#fff",
      color: COLOR.secondary,
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
      letterSpacing: "0.02em",
    },
    sidebar: {
      width: sidebarOpen ? 220 : 0,
      background: COLOR.primary,
      color: "#fff",
      transition: "width 0.2s",
      minHeight: "100vh",
      boxShadow: "2px 0 8px rgba(25,118,210,0.07)",
      display: "flex",
      flexDirection: "column",
      zIndex: 2,
      borderRight: "1px solid #f2f5fa",
      position: "relative",
      overflow: "hidden",
    },
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      padding: 20,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "1.5px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      background: COLOR.primary,
      userSelect: "none",
      gap: 8,
    },
    sidebarCloseBtn: {
      marginLeft: "auto",
      fontSize: 18,
      background: "none",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      opacity: 0.72,
    },
    navBtn: {
      margin: "14px 20px 8px 20px",
      borderRadius: 5,
      border: "none",
      background: COLOR.accent,
      color: "#fff",
      fontWeight: 500,
      fontSize: 15,
      padding: "10px 0",
      cursor: "pointer",
      width: "90%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      transition: "background .15s",
    },
    list: {
      flex: 1,
      padding: "0 0 12px 0",
      overflowY: "auto",
    },
    noteListItem: (selected) => ({
      display: "block",
      border: "none",
      background: selected ? "#e3edfb" : "#fff",
      color: selected ? COLOR.primary : COLOR.secondary,
      fontWeight: selected ? 700 : 500,
      fontSize: 15,
      padding: "14px 22px 11px 22px",
      margin: "0 0 3px 0",
      borderLeft: selected ? `5px solid ${COLOR.accent}` : "5px solid transparent",
      boxShadow: "0 1.5px 3px 0 rgba(25,118,210,0.02)",
      borderRadius: "0 8px 8px 0",
      cursor: "pointer",
      textAlign: "left",
      transition: "background 0.12s, color 0.14s",
      overflow: "hidden",
      position: "relative",
    }),
    listNoteTitle: {
      fontWeight: 600,
      fontSize: 14,
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    listNoteTime: {
      color: "#bfc9db",
      fontWeight: 400,
      fontSize: 12,
      marginTop: 2,
      marginBottom: 0,
      letterSpacing: "0.02em",
    },
    main: {
      flex: 1,
      display: "flex",
      background: "#f8f9fb",
      minHeight: "100vh",
      transition: "margin-left 0.18s",
    },
    notesPanel: {
      width: 300,
      background: "#fff",
      boxShadow: "2px 0 8px rgba(25,118,210,0.03)",
      borderRight: "1px solid #eff3f8",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
    },
    searchBox: {
      margin: "24px 22px 15px 22px",
      padding: "8px 10px",
      borderRadius: "6px",
      border: "1px solid #eef2f8",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
      width: "calc(100% - 22px*2)",
      boxSizing: "border-box",
      background: "#f8fafd",
    },
    editorPanel: {
      flex: 1,
      padding: "0",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      boxShadow: "none",
      border: "none",
    },
    editorHeader: {
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #eeeeee",
      background: "#f8fafc",
      height: 58,
      padding: "0 32px",
      gap: 10,
    },
    editorTitleInput: {
      border: "none",
      outline: "none",
      background: "#fff",
      fontWeight: 700,
      fontSize: 22,
      flex: 1,
      color: COLOR.primary,
      padding: "8px 0 8px 0",
      borderRadius: 3,
      marginRight: 12,
      boxShadow: "none",
    },
    editorBtns: {
      display: "flex",
      gap: 10,
      alignItems: "center",
    },
    btnDelete: {
      background: "#fff3e2",
      color: "#d25a00",
      border: "1px solid #ffd581",
      borderRadius: 5,
      padding: "5px 14px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "background .14s",
    },
    btnSave: {
      background: COLOR.primary,
      color: "#fff",
      border: "none",
      borderRadius: 5,
      padding: "7px 18px",
      fontSize: 16,
      fontWeight: 600,
      cursor: "pointer",
      marginLeft: 2,
      boxShadow: "0 2px 4px rgba(25,118,210,0.08)",
      transition: "background .13s",
    },
    editorTextarea: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "#f7fafe",
      fontSize: 17,
      fontFamily: "inherit",
      padding: "28px 32px",
      resize: "none",
      minHeight: 200,
      width: "100%",
      color: "#24263a",
      letterSpacing: ".015em",
      borderRadius: 0,
      margin: 0,
    },
    editorEmptyState: {
      color: "#aaa",
      fontSize: 20,
      width: "100%",
      textAlign: "center",
      margin: "auto",
      padding: "60px 16px",
      userSelect: "none",
    },
    mobileSidebarBtn: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 80,
      background: COLOR.primary,
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: 36,
      height: 36,
      fontSize: 22,
      boxShadow: "0 2px 6px rgba(25,118,210,0.10)",
      cursor: "pointer",
      display: "none",
    },
    "@media (maxWidth: 650px)": {
      app: { flexDirection: "column" },
      sidebar: { width: sidebarOpen ? "100vw" : 0, position: "absolute", minHeight: 0 },
      main: { flexDirection: "column", marginLeft: 0 },
      notesPanel: { width: "100vw" },
      editorPanel: { padding: "0 8px" },
      mobileSidebarBtn: { display: "block" },
    },
  };

  // ================ RENDER ========================
  return (
    <div style={styles.app} data-testid="app-main">
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar} aria-label="Main sidebar">
        {sidebarOpen && (
          <>
            <div style={styles.sidebarHeader}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  background: COLOR.accent,
                  borderRadius: 2,
                  marginRight: 8,
                }}
              ></span>
              Notes
              <button
                style={styles.sidebarCloseBtn}
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                tabIndex="0"
              >
                ×
              </button>
            </div>
            <button
              style={styles.navBtn}
              onClick={handleCreateNote}
              aria-label="Create new note"
            >
              + New Note
            </button>
            <div style={styles.list}>
              {notes.length === 0 && (
                <div style={{
                  color: "#eee", fontSize: 15, textAlign: "center", marginTop: 48
                }}>
                  No notes
                </div>
              )}
              {notes.map((note) => (
                <button
                  key={note.id}
                  style={styles.noteListItem(note.id === selectedId)}
                  onClick={() => handleSelectNote(note.id)}
                  aria-label={`Select note ${note.title}`}
                >
                  <div style={styles.listNoteTitle}>{note.title || <i>(No Title)</i>}</div>
                  <div style={styles.listNoteTime}>
                    {new Date(note.updated).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}></div>
          </>
        )}
      </aside>
      {/* Sidebar open button (Mobile) */}
      {!sidebarOpen && (
        <button
          style={{ ...styles.mobileSidebarBtn, display: "block" }}
          aria-label="Open sidebar"
          onClick={handleSidebarToggle}
        >
          ☰
        </button>
      )}

      {/* Main content: notes panel, editor */}
      <main style={styles.main}>
        {/* Notes List/Panel */}
        <section style={styles.notesPanel} aria-label="Notes list">
          <input
            style={styles.searchBox}
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes"
            data-testid="search-input"
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredNotes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  margin: "80px 0",
                  fontSize: 18,
                }}
              >
                No notes found
              </div>
            ) : (
              filteredNotes.map((n) => (
                <button
                  key={n.id}
                  style={styles.noteListItem(n.id === selectedId)}
                  onClick={() => handleSelectNote(n.id)}
                  aria-label={`Open note ${n.title}`}
                  data-testid="note-item"
                >
                  <div style={styles.listNoteTitle}>{n.title || "(No Title)"}</div>
                  <div style={styles.listNoteTime}>{new Date(n.updated).toLocaleString()}</div>
                </button>
              ))
            )}
          </div>
        </section>
        {/* Editor Panel */}
        <section style={styles.editorPanel}>
          {selectedNote ? (
            <>
              {/* Editor Header */}
              <div style={styles.editorHeader}>
                <input
                  style={styles.editorTitleInput}
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateNote("title", e.target.value)}
                  placeholder="Title"
                  aria-label="Edit note title"
                  data-testid="editor-title"
                />
                <div style={styles.editorBtns}>
                  <button
                    style={styles.btnDelete}
                    onClick={() => handleDeleteNote(selectedId)}
                    aria-label="Delete note"
                    data-testid="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Editor Textarea */}
              <textarea
                style={styles.editorTextarea}
                value={selectedNote.content}
                onChange={(e) =>
                  handleUpdateNote("content", e.target.value)
                }
                placeholder="Type your note here..."
                aria-label="Edit note content"
                data-testid="editor-content"
              />
            </>
          ) : (
            <div style={styles.editorEmptyState}>
              Select a note or create a new one to begin.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
