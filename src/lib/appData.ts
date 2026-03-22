export interface Param {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  unit: string;
  goal: number;
  current: number;
  total: number;
}

export interface Entry {
  id: string;
  paramId: string;
  value: number;
  date: string;
  note?: string;
}

export interface AppData {
  userName: string;
  params: Param[];
  entries: Entry[];
}

export const defaultAppData: AppData = {
  userName: "Чемпион",
  params: [
    {
      id: "p1",
      name: "Тренировки",
      emoji: "💪",
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED, #A855F7)",
      unit: "раз",
      goal: 30,
      current: 12,
      total: 47,
    },
    {
      id: "p2",
      name: "Чтение",
      emoji: "📚",
      color: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #22D3EE)",
      unit: "стр",
      goal: 500,
      current: 210,
      total: 1240,
    },
    {
      id: "p3",
      name: "Медитация",
      emoji: "🧘",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981, #34D399)",
      unit: "мин",
      goal: 300,
      current: 85,
      total: 620,
    },
    {
      id: "p4",
      name: "Вода",
      emoji: "💧",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)",
      unit: "стак.",
      goal: 60,
      current: 28,
      total: 183,
    },
  ],
  entries: [
    { id: "e1", paramId: "p1", value: 1, date: new Date(Date.now() - 86400000 * 0).toISOString(), note: "Утренняя тренировка" },
    { id: "e2", paramId: "p2", value: 30, date: new Date(Date.now() - 86400000 * 0).toISOString(), note: "Глава 5" },
    { id: "e3", paramId: "p3", value: 15, date: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "e4", paramId: "p4", value: 4, date: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: "e5", paramId: "p1", value: 1, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "e6", paramId: "p2", value: 45, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "e7", paramId: "p3", value: 10, date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: "e8", paramId: "p4", value: 6, date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: "e9", paramId: "p1", value: 1, date: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: "e10", paramId: "p2", value: 25, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  ],
};
