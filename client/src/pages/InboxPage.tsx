// FLOW Inbox Page — Quick capture, GTD-style processing
// Design: "Precision Instrument" — calm, focused, zero-friction
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Tray, Plus, CheckSquare, FileText, Calendar,
  Lightbulb, Trash, ArrowRight, Check
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition, listContainerVariants, listItemVariants } from '../lib/animations';
import { toast } from 'sonner';
import type { InboxItem } from '../lib/types';

const TYPE_ICONS: Record<string, any> = {
  TASK: CheckSquare,
  NOTE: FileText,
  EVENT: Calendar,
  IDEA: Lightbulb,
  UNPROCESSED: Tray,
};

const TYPE_COLORS: Record<string, string> = {
  TASK: '#D97706',
  NOTE: '#7C3AED',
  EVENT: '#0891B2',
  IDEA: '#16A34A',
  UNPROCESSED: 'var(--text-tertiary)',
};

export default function InboxPage() {
  const { inboxItems, addInboxItem, processInboxItem, deleteInboxItem } = useFlowStore();
  const [captureText, setCaptureText] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unprocessed = inboxItems.filter(i => !i.processed);
  const processed = inboxItems.filter(i => i.processed);

  const handleCapture = () => {
    if (!captureText.trim()) return;
    addInboxItem(captureText.trim());
    toast.success('Captured!', { description: captureText.trim(), duration: 1500 });
    setCaptureText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCapture();
  };

  const handleProcess = (item: InboxItem) => {
    setProcessingId(item.id);
    setTimeout(() => {
      processInboxItem(item.id);
      setProcessingId(null);
      toast.success('Processed', { duration: 1000 });
    }, 400);
  };

  const handleDelete = (id: string) => {
    deleteInboxItem(id);
    toast.success('Deleted', { duration: 1000 });
  };

  const formatTimeLocal = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ maxWidth: 680 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 400,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em', marginBottom: 2,
        }}>
          Inbox
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          {unprocessed.length} item{unprocessed.length !== 1 ? 's' : ''} to process
        </p>
      </div>

      {/* Quick Capture */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 10, padding: '14px 16px',
        marginBottom: 28,
        boxShadow: 'var(--shadow-xs)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          Quick Capture
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={captureText}
            onChange={e => setCaptureText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Press Enter to capture..."
            autoFocus
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 15, color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <motion.button
            onClick={handleCapture}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            disabled={!captureText.trim()}
            style={{
              height: 34, padding: '0 14px',
              background: captureText.trim() ? 'var(--accent-primary)' : 'var(--bg-elevated)',
              border: 'none', borderRadius: 6, cursor: captureText.trim() ? 'pointer' : 'default',
              fontSize: 13, fontWeight: 500,
              color: captureText.trim() ? 'white' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plus size={14} weight="bold" />
            Capture
          </motion.button>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>
          Tip: Just dump it here. Process later. Don't think, just capture.
        </div>
      </div>

      {/* Unprocessed Items */}
      {unprocessed.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Tray size={14} color="var(--accent-primary)" weight="duotone" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              To Process ({unprocessed.length})
            </span>
          </div>

          <motion.div
            variants={listContainerVariants}
            initial="initial"
            animate="animate"
            style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <AnimatePresence>
              {unprocessed.map(item => {
                const TypeIcon = TYPE_ICONS[item.type] || Tray;
                const typeColor = TYPE_COLORS[item.type] || 'var(--text-tertiary)';
                const isProcessing = processingId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    variants={listItemVariants}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    layout
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      transition: 'border-color 0.2s',
                    }}
                    whileHover={{ borderColor: 'var(--border-default)' }}
                  >
                    {/* Type indicator */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${typeColor}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <TypeIcon size={15} color={typeColor} weight="duotone" />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, color: 'var(--text-primary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.content}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {formatTime(item.createdAt)}
                        {item.type !== 'UNPROCESSED' && (
                          <span style={{ marginLeft: 6, color: typeColor, fontWeight: 500 }}>
                            · {item.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <motion.button
                        onClick={() => handleProcess(item)}
                        whileHover={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-primary)' }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: 30, height: 30, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--text-tertiary)',
                          transition: 'all 0.15s ease',
                        }}
                        title="Mark as processed"
                      >
                        {isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.4, ease: 'linear' }}
                          >
                            <Check size={14} />
                          </motion.div>
                        ) : (
                          <Check size={14} />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(item.id)}
                        whileHover={{ backgroundColor: '#DC262618', color: 'var(--error)' }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: 30, height: 30, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--text-tertiary)',
                          transition: 'all 0.15s ease',
                        }}
                        title="Delete"
                      >
                        <Trash size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Empty state */}
      {unprocessed.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '48px 24px', textAlign: 'center',
            border: '1px dashed var(--border-default)',
            borderRadius: 12, marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 6 }}>
            Inbox Zero
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            Everything's been processed. A rare and beautiful state.
          </div>
        </motion.div>
      )}

      {/* Processed Items */}
      {processed.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Check size={14} color="var(--success)" weight="bold" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Processed ({processed.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: 0.5 }}>
            {processed.slice(0, 5).map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px',
                background: 'var(--bg-elevated)',
                borderRadius: 6,
              }}>
                <Check size={12} color="var(--success)" weight="bold" />
                <span style={{
                  fontSize: 13, color: 'var(--text-tertiary)',
                  textDecoration: 'line-through',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.content}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                  {formatTime(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

}
