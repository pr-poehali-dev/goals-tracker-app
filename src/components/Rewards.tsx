import { AppData } from "@/lib/appData";

interface Props {
  data: AppData;
}

interface Badge {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  condition: (data: AppData) => boolean;
  progress?: (data: AppData) => { current: number; goal: number };
}

const BADGES: Badge[] = [
  {
    id: "first_entry",
    title: "Первый шаг",
    desc: "Сделай первую отметку",
    emoji: "🌱",
    color: "#10B981",
    condition: d => d.entries.length >= 1,
  },
  {
    id: "ten_entries",
    title: "В ритме",
    desc: "10 отметок в любом параметре",
    emoji: "🔥",
    color: "#F59E0B",
    condition: d => d.entries.length >= 10,
    progress: d => ({ current: Math.min(d.entries.length, 10), goal: 10 }),
  },
  {
    id: "half_goal_p1",
    title: "Полпути",
    desc: "Достигни 50% по первому параметру",
    emoji: "⚡",
    color: "#7C3AED",
    condition: d => d.params[0]?.current >= d.params[0]?.goal / 2,
    progress: d => ({ current: Math.min(d.params[0]?.current || 0, Math.floor(d.params[0]?.goal / 2)), goal: Math.floor(d.params[0]?.goal / 2) }),
  },
  {
    id: "goal_p1",
    title: "Покоритель",
    desc: "Выполни цель первого параметра",
    emoji: "🏆",
    color: "#F59E0B",
    condition: d => d.params[0]?.current >= d.params[0]?.goal,
    progress: d => ({ current: Math.min(d.params[0]?.current || 0, d.params[0]?.goal), goal: d.params[0]?.goal }),
  },
  {
    id: "all_params",
    title: "Многозадачность",
    desc: "Отметь все 4 параметра",
    emoji: "🎯",
    color: "#06B6D4",
    condition: d => new Set(d.entries.map(e => e.paramId)).size >= 4,
    progress: d => ({ current: new Set(d.entries.map(e => e.paramId)).size, goal: 4 }),
  },
  {
    id: "streak_5",
    title: "Постоянство",
    desc: "5 дней активности подряд",
    emoji: "📅",
    color: "#EC4899",
    condition: d => {
      const days = new Set(d.entries.map(e => e.date.split("T")[0]));
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d2 = new Date();
        d2.setDate(d2.getDate() - i);
        if (days.has(d2.toISOString().split("T")[0])) streak++;
        else break;
      }
      return streak >= 5;
    },
  },
  {
    id: "total_50",
    title: "Марафонец",
    desc: "50 суммарных отметок",
    emoji: "🚀",
    color: "#8B5CF6",
    condition: d => d.entries.length >= 50,
    progress: d => ({ current: Math.min(d.entries.length, 50), goal: 50 }),
  },
  {
    id: "all_goals",
    title: "Легенда",
    desc: "Выполни цели всех 4 параметров",
    emoji: "👑",
    color: "#F59E0B",
    condition: d => d.params.every(p => p.current >= p.goal),
    progress: d => ({ current: d.params.filter(p => p.current >= p.goal).length, goal: 4 }),
  },
];

export default function Rewards({ data }: Props) {
  const unlocked = BADGES.filter(b => b.condition(data));
  const locked = BADGES.filter(b => !b.condition(data));

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black">
          <span className="gradient-text">Награды</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Разблокировано: <span className="font-bold text-foreground">{unlocked.length}</span> из {BADGES.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-4 mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Прогресс коллекции</span>
          <span>{Math.round(unlocked.length / BADGES.length * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(unlocked.length / BADGES.length) * 100}%`,
              background: 'linear-gradient(90deg, #7C3AED, #F59E0B)',
              boxShadow: '0 0 8px rgba(124,58,237,0.5)',
            }} />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Получено</p>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map(badge => (
              <div key={badge.id}
                className="rounded-2xl p-4 relative overflow-hidden animate-scale-in"
                style={{ background: `${badge.color}12`, border: `1px solid ${badge.color}40` }}>
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: badge.color }}>
                    ✓
                  </div>
                </div>
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <p className="font-bold text-sm leading-tight">{badge.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Предстоит получить</p>
          <div className="space-y-2.5">
            {locked.map(badge => {
              const prog = badge.progress?.(data);
              return (
                <div key={badge.id}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 opacity-30"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {badge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-muted-foreground">{badge.title}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{badge.desc}</p>
                    {prog && (
                      <div className="mt-2">
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(prog.current / prog.goal * 100, 100)}%`, background: badge.color }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 mt-0.5">{prog.current} / {prog.goal}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xl opacity-20">🔒</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
