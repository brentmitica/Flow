// FLOW Notes Page — TipTap-style editor with sidebar
// Design: "Precision Instrument" — editorial calm, generous line-height
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FileText, Plus, MagnifyingGlass, Star, PushPin,
  Clock, Hash, ArrowLeft, TextT,
  Link, Code, ListBullets, Quotes, Robot,
  FloppyDisk, Trash
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition } from '../lib/animations';
import { toast } from 'sonner';
import type { Note } from '../lib/types';

const SAMPLE_CONTENT = `Start writing your thoughts here...

Use **bold** for emphasis, *italic* for nuance.

## Key Ideas

- First thought
- Second thought
- Third thought

> A quote that resonates with you.

\`\`\`
// Code snippet
const flow = "beautiful";
\`\`\`
`;

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useFlowStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  useEffect(() => {
    if (selectedNote) {
      setEditorTitle(selectedNote.title);
      setEditorContent(selectedNote.contentText || SAMPLE_CONTENT);
    }
  }, [selectedNoteId]);

  const handleContentChange = (value: string) => {
    setEditorContent(value);
    setSaveStatus('unsaved');
    if (saveTimer) clearTimeout(saveTimer);
    const timer = setTimeout(() => {
      if (selectedNoteId) {
        updateNote(selectedNoteId, { contentText: value, updatedAt: new Date().toISOString() });
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 500);
      }
    }, 500);
    setSaveTimer(timer);
  };

  const handleTitleChange = (value: string) => {
    setEditorTitle(value);
    if (selectedNoteId) {
      updateNote(selectedNoteId, { title: value });
    }
  };

  const handleNewNote = () => {
    const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Untitled Note',
      content: { type: 'doc', content: [] },
      contentText: '',
    };
    addNote(newNote);
    // Select the new note (it'll be at the end of the array)
    setTimeout(() => {
      const latestNote = useFlowStore.getState().notes[useFlowStore.getState().notes.length - 1];
      if (latestNote) setSelectedNoteId(latestNote.id);
    }, 50);
    toast.success('New note created', { duration: 1500 });
  };

  const handleDeleteNote = () => {
    if (!selectedNoteId) return;
    deleteNote(selectedNoteId);
    const remaining = notes.filter(n => n.id !== selectedNoteId);
    setSelectedNoteId(remaining[0]?.id || null);
    toast.success('Note deleted', { duration: 1500 });
  };

  const filteredNotes = notes.filter(n =>
    !searchQuery ||
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.contentText || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const regularNotes = filteredNotes.filter(n => !n.isPinned);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{
        display: 'flex',
        height: 'calc(100vh - 48px - 48px)',
        margin: '-24px',
        overflow: 'hidden',
      }}
    >
      {/* Notes Sidebar */}
      <div style={{
        width: 240, flexShrink: 0,
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-surface)',
        overflow: 'hidden',
      }}>
        {/* Search + New */}
        <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6, marginBottom: 8,
          }}>
            <MagnifyingGlass size={12} color="var(--text-tertiary)" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
                width: '100%',
              }}
            />
          </div>
          <motion.button
            onClick={handleNewNote}
            whileHover={{ backgroundColor: 'var(--accent-subtle)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', height: 30,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent',
              border: '1px dashed var(--border-default)',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              justifyContent: 'center',
            }}
          >
            <Plus size={12} />
            New Note
          </motion.button>
        </div>

        {/* Notes List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {pinnedNotes.length > 0 && (
            <div>
              <div style={{ padding: '6px 12px 2px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Pinned
              </div>
              {pinnedNotes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  onClick={() => setSelectedNoteId(note.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div style={{ padding: '6px 12px 2px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                  All Notes
                </div>
              )}
              {regularNotes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  onClick={() => setSelectedNoteId(note.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
          {filteredNotes.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <FileText size={24} color="var(--text-tertiary)" weight="duotone" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                {searchQuery ? 'No notes found' : 'Your thoughts, organized'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      {selectedNote ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor toolbar */}
          <div style={{
            height: 44, padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                { icon: TextT, title: 'Bold' },
                { icon: TextT, title: 'Italic' },
                { icon: Link, title: 'Link' },
                { icon: Code, title: 'Code' },
                { icon: ListBullets, title: 'List' },
                { icon: Quotes, title: 'Quote' },
              ].map(({ icon: Icon, title }) => (
                <motion.button
                  key={title}
                  whileHover={{ backgroundColor: 'var(--bg-elevated)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toast.info(`${title} formatting`, { duration: 1000 })}
                  style={{
                    width: 28, height: 28, borderRadius: 5,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                  title={title}
                >
                  <Icon size={14} />
                </motion.button>
              ))}
              <div style={{ width: 1, height: 16, background: 'var(--border-default)', margin: '0 4px' }} />
              <motion.button
                whileHover={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)' }}
                onClick={() => toast.info('AI note enhancement coming soon', { duration: 2000 })}
                style={{
                  height: 28, padding: '0 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', border: '1px solid var(--border-default)',
                  borderRadius: 5, cursor: 'pointer',
                  fontSize: 11, color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Robot size={12} />
                AI
              </motion.button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Save status */}
              <span style={{
                fontSize: 11, color: 'var(--text-tertiary)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {saveStatus === 'saved' && <><FloppyDisk size={11} /> Saved</>}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'unsaved' && 'Unsaved changes'}
              </span>
              <motion.button
                whileHover={{ color: 'var(--error)' }}
                onClick={handleDeleteNote}
                style={{
                  width: 28, height: 28, borderRadius: 5,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                }}
                title="Delete note"
              >
                <Trash size={14} />
              </motion.button>
            </div>
          </div>

          {/* Editor content */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '40px 64px',
            background: 'var(--bg-base)',
          }}>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              {/* Title */}
              <input
                value={editorTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-display)',
                  fontSize: 36, fontWeight: 400,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              />
              {/* Metadata */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 32,
                fontSize: 12, color: 'var(--text-tertiary)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} />
                  {formatDate(selectedNote.updatedAt)}
                </span>
                {selectedNote.wordCount && (
                  <span>{selectedNote.wordCount} words</span>
                )}
                {selectedNote.project && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Hash size={11} />
                    <span style={{ color: selectedNote.project.color }}>{selectedNote.project.name}</span>
                  </span>
                )}
              </div>

              {/* Editor area */}
              <textarea
                value={editorContent}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="Start writing..."
                style={{
                  width: '100%', border: 'none', outline: 'none',
                  background: 'transparent', resize: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 15, lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  minHeight: 400,
                }}
                rows={20}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
        }}>
          <FileText size={40} color="var(--text-tertiary)" weight="duotone" />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)' }}>
            Your thoughts, organized
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            Select a note or create a new one
          </div>
          <motion.button
            onClick={handleNewNote}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 36, padding: '0 16px',
              background: 'var(--accent-primary)', border: 'none',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 13, color: 'white', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plus size={14} />
            New note →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function NoteListItem({
  note, isSelected, onClick, formatDate
}: {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  formatDate: (d: string) => string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: isSelected ? undefined : 'var(--bg-hover)' }}
      style={{
        width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer',
        background: isSelected ? 'var(--accent-subtle)' : 'transparent',
        borderLeft: isSelected ? '2px solid var(--accent-primary)' : '2px solid transparent',
        textAlign: 'left', fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
        marginBottom: 2,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {note.isPinned && <PushPin size={10} style={{ marginRight: 4, color: 'var(--accent-primary)' }} />}
        {note.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {formatDate(note.updatedAt)}
        </span>
        {note.contentText && (
          <span style={{
            fontSize: 11, color: 'var(--text-tertiary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>
            · {note.contentText.slice(0, 40)}...
          </span>
        )}
      </div>
    </motion.button>
  );
}
