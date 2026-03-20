import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { House, ArrowLeft } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-base)', fontFamily: 'var(--font-body)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.0, 0.0, 0.2, 1.0] }}
        style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}
      >
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 96, lineHeight: 1,
          color: 'var(--border-default)',
          letterSpacing: '-0.04em',
          marginBottom: 16,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24, fontWeight: 400,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          Page not found
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--text-tertiary)',
          lineHeight: 1.6, marginBottom: 28,
          fontStyle: 'italic',
        }}>
          This page doesn't exist or was moved. Let's get you back to flow.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link href="/today">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                height: 36, padding: '0 16px',
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--accent-primary)', borderRadius: 6,
                fontSize: 13, fontWeight: 500, color: 'white',
                cursor: 'pointer',
              }}
            >
              <House size={14} weight="duotone" />
              Go to Today
            </motion.div>
          </Link>
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 36, padding: '0 16px',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <ArrowLeft size={14} />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
