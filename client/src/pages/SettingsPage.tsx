// FLOW Settings Page — Profile, preferences, integrations
// Design: "Precision Instrument" — clean form layout, amber toggles
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  User, Bell, Palette, Link, Shield,
  Gear, Moon, Sun as SunIcon, Monitor,
  Check, GoogleLogo, Robot, Timer
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { useTheme } from '../contexts/ThemeContext';
import { pageVariants, pageTransition } from '../lib/animations';
import { toast } from 'sonner';

type SettingsSection = 'profile' | 'appearance' | 'notifications' | 'integrations' | 'ai' | 'focus';

const SECTIONS = [
  { id: 'profile' as SettingsSection, label: 'Profile', icon: User },
  { id: 'appearance' as SettingsSection, label: 'Appearance', icon: Palette },
  { id: 'notifications' as SettingsSection, label: 'Notifications', icon: Bell },
  { id: 'integrations' as SettingsSection, label: 'Integrations', icon: Link },
  { id: 'ai' as SettingsSection, label: 'AI & Automation', icon: Robot },
  { id: 'focus' as SettingsSection, label: 'Focus', icon: Timer },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: checked ? 'var(--accent-primary)' : 'var(--bg-elevated)',
        border: `1px solid ${checked ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: 'white',
          position: 'absolute', top: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </motion.button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: description ? 2 : 0 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useFlowStore();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // Settings state
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    habitReminders: true,
    weeklyReview: true,
    focusMode: false,
    email: false,
  });
  const [aiSettings, setAiSettings] = useState({
    smartScheduling: true,
    dailyBriefing: true,
    taskSuggestions: true,
    writingAssistant: false,
  });
  const [focusSettings, setFocusSettings] = useState({
    autoStartBreaks: true,
    longBreakAfter: 4,
    pomoDuration: 25,
    breakDuration: 5,
  });

  const handleSave = () => {
    toast.success('Settings saved', { duration: 1500 });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ display: 'flex', gap: 32, maxWidth: 840 }}
    >
      {/* Sidebar nav */}
      <div style={{ width: 180, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Settings
        </div>
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ backgroundColor: 'var(--bg-overlay)' }}
              style={{
                width: '100%', height: 34,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0 10px', borderRadius: 6, border: 'none',
                background: isActive ? 'var(--bg-overlay)' : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                marginBottom: 2,
              }}
            >
              <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} weight={isActive ? 'duotone' : 'regular'} />
              {section.label}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {activeSection === 'profile' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              Profile
            </h2>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 600, color: 'white',
              }}>
                AC
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{user.email}</div>
                <motion.button
                  whileHover={{ color: 'var(--accent-primary)' }}
                  onClick={() => toast.info('Photo upload coming soon', { duration: 2000 })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-body)' }}
                >
                  Change photo →
                </motion.button>
              </div>
            </div>

            {[
              { label: 'Full Name', value: user.name, placeholder: 'Your name' },
              { label: 'Email', value: user.email, placeholder: 'your@email.com' },
              { label: 'Timezone', value: user.timezone, placeholder: 'America/New_York' },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', height: 36, padding: '0 12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 6, outline: 'none',
                    fontSize: 14, color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'appearance' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              Appearance
            </h2>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>Theme</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { value: 'light', label: 'Light', icon: SunIcon },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(t => (
                  <motion.button
                    key={t.value}
                    onClick={() => { if (t.value !== 'system' && toggleTheme) toggleTheme(); else toast.info('System theme coming soon', { duration: 1500 }); }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1, height: 72,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: theme === t.value ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                      border: `1px solid ${theme === t.value ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <t.icon size={20} color={theme === t.value ? 'var(--accent-primary)' : 'var(--text-secondary)'} weight={theme === t.value ? 'duotone' : 'regular'} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: theme === t.value ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {t.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <SettingRow label="Compact Mode" description="Reduce spacing for more information density">
              <Toggle checked={false} onChange={() => toast.info('Compact mode coming soon', { duration: 1500 })} />
            </SettingRow>
            <SettingRow label="Sidebar Collapsed by Default" description="Start with the sidebar collapsed">
              <Toggle checked={false} onChange={() => toast.info('Coming soon', { duration: 1500 })} />
            </SettingRow>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              Notifications
            </h2>
            <SettingRow label="Task Reminders" description="Get reminded when tasks are due">
              <Toggle checked={notifications.taskReminders} onChange={v => setNotifications(n => ({ ...n, taskReminders: v }))} />
            </SettingRow>
            <SettingRow label="Habit Reminders" description="Daily reminders to complete your habits">
              <Toggle checked={notifications.habitReminders} onChange={v => setNotifications(n => ({ ...n, habitReminders: v }))} />
            </SettingRow>
            <SettingRow label="Weekly Review" description="Sunday evening review prompts">
              <Toggle checked={notifications.weeklyReview} onChange={v => setNotifications(n => ({ ...n, weeklyReview: v }))} />
            </SettingRow>
            <SettingRow label="Focus Mode Alerts" description="Notifications during focus sessions">
              <Toggle checked={notifications.focusMode} onChange={v => setNotifications(n => ({ ...n, focusMode: v }))} />
            </SettingRow>
            <SettingRow label="Email Digest" description="Weekly productivity summary via email">
              <Toggle checked={notifications.email} onChange={v => setNotifications(n => ({ ...n, email: v }))} />
            </SettingRow>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              Integrations
            </h2>
            {[
              { name: 'Google Calendar', description: 'Sync events and tasks', icon: GoogleLogo, connected: false, color: '#4285F4' },
              { name: 'Notion', description: 'Import notes and databases', icon: Gear, connected: false, color: '#000000' },
              { name: 'Slack', description: 'Get task notifications in Slack', icon: Bell, connected: false, color: '#4A154B' },
              { name: 'GitHub', description: 'Link issues to tasks', icon: Link, connected: false, color: '#333333' },
            ].map(integration => (
              <div key={integration.name} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0', borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${integration.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <integration.icon size={18} color={integration.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{integration.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{integration.description}</div>
                </div>
                <motion.button
                  onClick={() => toast.info(`${integration.name} integration coming soon`, { duration: 2000 })}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    height: 30, padding: '0 14px',
                    background: integration.connected ? 'var(--bg-elevated)' : 'var(--accent-primary)',
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    fontSize: 12, fontWeight: 500,
                    color: integration.connected ? 'var(--text-secondary)' : 'white',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {integration.connected ? 'Connected' : 'Connect'}
                </motion.button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'ai' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              AI & Automation
            </h2>
            <SettingRow label="Smart Scheduling" description="AI auto-schedules tasks based on your patterns">
              <Toggle checked={aiSettings.smartScheduling} onChange={v => setAiSettings(s => ({ ...s, smartScheduling: v }))} />
            </SettingRow>
            <SettingRow label="Daily Briefing" description="AI-generated morning summary">
              <Toggle checked={aiSettings.dailyBriefing} onChange={v => setAiSettings(s => ({ ...s, dailyBriefing: v }))} />
            </SettingRow>
            <SettingRow label="Task Suggestions" description="AI suggests tasks based on your goals">
              <Toggle checked={aiSettings.taskSuggestions} onChange={v => setAiSettings(s => ({ ...s, taskSuggestions: v }))} />
            </SettingRow>
            <SettingRow label="Writing Assistant" description="AI helps you write notes and documents">
              <Toggle checked={aiSettings.writingAssistant} onChange={v => setAiSettings(s => ({ ...s, writingAssistant: v }))} />
            </SettingRow>
          </div>
        )}

        {activeSection === 'focus' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 20 }}>
              Focus Settings
            </h2>
            {[
              { label: 'Pomodoro Duration', key: 'pomoDuration', unit: 'min', value: focusSettings.pomoDuration },
              { label: 'Short Break Duration', key: 'breakDuration', unit: 'min', value: focusSettings.breakDuration },
              { label: 'Long Break After', key: 'longBreakAfter', unit: 'pomodoros', value: focusSettings.longBreakAfter },
            ].map(setting => (
              <div key={setting.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {setting.label}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    defaultValue={setting.value}
                    style={{
                      width: 80, height: 36, padding: '0 12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 6, outline: 'none',
                      fontSize: 14, color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{setting.unit}</span>
                </div>
              </div>
            ))}
            <SettingRow label="Auto-start Breaks" description="Automatically start break timer after pomodoro">
              <Toggle checked={focusSettings.autoStartBreaks} onChange={v => setFocusSettings(s => ({ ...s, autoStartBreaks: v }))} />
            </SettingRow>
          </div>
        )}

        {/* Save button */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <motion.button
            onClick={handleSave}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 36, padding: '0 20px',
              background: 'var(--accent-primary)', border: 'none',
              borderRadius: 6, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'white',
              fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Check size={14} weight="bold" />
            Save Changes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
