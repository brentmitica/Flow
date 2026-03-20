// FLOW Mobile Bottom Navigation
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Sun, CheckSquare, Tray, Calendar, DotsThree } from '@phosphor-icons/react';
import { DURATIONS } from '../../lib/animations';

const MOBILE_NAV = [
  { href: '/today', label: 'Today', icon: Sun },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/inbox', label: 'Inbox', icon: Tray },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/settings', label: 'More', icon: DotsThree },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="flow-mobile-nav">
      {MOBILE_NAV.map((item) => {
        const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                minWidth: 48,
              }}
              whileTap={{ scale: 0.92 }}
            >
              <Icon
                weight={isActive ? 'duotone' : 'regular'}
                size={22}
                color={isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)'}
              />
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                fontFamily: 'var(--font-body)',
              }}>
                {item.label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
