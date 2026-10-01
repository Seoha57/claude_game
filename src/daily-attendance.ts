const KEY = 'dod_attendance';

interface AttendanceData {
  lastDate: string;
  streak: number;
  totalDays: number;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function load(): AttendanceData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AttendanceData;
  } catch { /* ignore */ }
  return { lastDate: '', streak: 0, totalDays: 0 };
}

function save(data: AttendanceData): void {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export interface AttendanceReward {
  streak: number;
  totalDays: number;
  isNew: boolean;
}

export function checkAttendance(): AttendanceReward {
  const data = load();
  const t = today();

  if (data.lastDate === t) {
    return { streak: data.streak, totalDays: data.totalDays, isNew: false };
  }

  if (data.lastDate === yesterday()) {
    data.streak++;
  } else {
    data.streak = 1;
  }
  data.totalDays++;
  data.lastDate = t;
  save(data);
  return { streak: data.streak, totalDays: data.totalDays, isNew: true };
}

export function getAttendance(): AttendanceData {
  return load();
}
