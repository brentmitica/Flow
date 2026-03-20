// FLOW Analytics Page — Charts, productivity score, trends
// Design: "Precision Instrument" — amber charts, mono numbers
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  ChartBar, TrendUp, Timer, CheckSquare,
  Target, Flame, Calendar
} from '@phosphor-icons/react';
import { useFlowStore } from '../store/flowStore';
import { pageVariants, pageTransition } from '../lib/animations';
import { mockAnalytics } from '../lib/mockData';

const CHART_COLORS = {
  amber: '#D97706',
  blue: '#2563EB',
  green: '#16A34A',
  purple: '#7C3AED',
  red: '#DC2626',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 6, padding: '8px 12px',
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
      }}>
        <div style={{ color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color, fontWeight: 500 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { tasks, habits, user } = useFlowStore();

  // Prepare chart data (last 14 days)
  const chartData = mockAnalytics.slice(0, 14).reverse().map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tasks: d.tasksCompleted,
    focus: Math.round(d.focusMinutes / 60 * 10) / 10,
    habits: d.habitsCompleted,
    score: d.productivityScore,
  }));

  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Project distribution
  const projectData = [
    { name: 'Work', value: 12, color: CHART_COLORS.amber },
    { name: 'Personal', value: 7, color: CHART_COLORS.blue },
    { name: 'Side Project', value: 5, color: CHART_COLORS.green },
    { name: 'Learning', value: 4, color: CHART_COLORS.purple },
  ];

  const weeklyFocus = mockAnalytics.slice(0, 7).reduce((sum, d) => sum + d.focusMinutes, 0);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 400,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em', marginBottom: 2,
        }}>
          Analytics
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          Your productivity patterns over the last 30 days
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 28,
      }}>
        {[
          {
            label: 'Productivity Score',
            value: user.productivityScore,
            unit: '/100',
            icon: TrendUp,
            color: CHART_COLORS.amber,
            delta: '+8 from last week',
            positive: true,
          },
          {
            label: 'Focus Time',
            value: Math.round(weeklyFocus / 60),
            unit: 'h this week',
            icon: Timer,
            color: CHART_COLORS.purple,
            delta: '↑ 12% vs last week',
            positive: true,
          },
          {
            label: 'Tasks Completed',
            value: completedTasks,
            unit: `/ ${totalTasks}`,
            icon: CheckSquare,
            color: CHART_COLORS.green,
            delta: `${completionRate}% completion rate`,
            positive: completionRate > 50,
          },
          {
            label: 'Current Streak',
            value: user.currentStreak,
            unit: 'days',
            icon: Flame,
            color: '#D97706',
            delta: `Best: ${user.longestStreak} days`,
            positive: true,
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <kpi.icon size={14} color={kpi.color} weight="duotone" />
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                {kpi.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>
                {kpi.value}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{kpi.unit}</span>
            </div>
            <div style={{
              fontSize: 11,
              color: kpi.positive ? 'var(--success)' : 'var(--error)',
            }}>
              {kpi.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Productivity Score Trend */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '20px 20px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendUp size={14} color={CHART_COLORS.amber} weight="duotone" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              Productivity Score
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="score" name="Score"
                stroke={CHART_COLORS.amber} fill="url(#scoreGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Distribution */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ChartBar size={14} color={CHART_COLORS.blue} weight="duotone" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              Tasks by Project
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={projectData}
                cx="50%" cy="50%"
                innerRadius={40} outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {projectData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {projectData.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{p.name}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Tasks per Day */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '20px 20px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckSquare size={14} color={CHART_COLORS.green} weight="duotone" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              Tasks Completed
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tasks" name="Tasks" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Focus Hours */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '20px 20px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Timer size={14} color={CHART_COLORS.purple} weight="duotone" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              Focus Hours
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="focus" name="Hours"
                stroke={CHART_COLORS.purple} strokeWidth={2}
                dot={{ fill: CHART_COLORS.purple, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
