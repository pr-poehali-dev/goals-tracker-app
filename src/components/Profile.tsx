import { useState } from "react";
import { AppData } from "@/lib/appData";
import Icon from "@/components/ui/icon";

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

export default function Profile({ data, setData }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(data.userName);

  const saveName = () => {
    setData(prev => ({ ...prev, userName: name }));
    setEditing(false);
  };

  const totalEntries = data.entries.length;
  const activeDays = new Set(data.entries.map(e => e.date.split("T")[0])).size;
  const completedGoals = data.params.filter(p => p.current >= p.goal).length;

  const stats = [
    { label: "Всего записей", value: totalEntries, emoji: "📝", color: "#7C3AED" },
    { label: "Активных дней", value: activeDays, emoji: "📅", color: "#06B6D4" },
    { label: "Целей выполнено", value: completedGoals, emoji: "🏆", color: "#F59E0B" },
    { label: "Параметров", value: 4, emoji: "🎯", color: "#EC4899" },
  ];

  const levelXP = totalEntries * 10;
  const level = Math.floor(levelXP / 100) + 1;
  const xpInLevel = levelXP % 100;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black">
          <span className="gradient-text">Профиль</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Твой прогресс и настройки</p>
      </div>

      {/* Avatar card */}
      <div className="glass rounded-2xl p-5 mb-5 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))' }}>
            🧑‍🚀
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
            {level}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-secondary rounded-xl px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-white/20"
                autoFocus
                onKeyDown={e => e.key === "Enter" && saveName()}
              />
              <button onClick={saveName} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                ОК
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-black text-lg truncate">{data.userName}</p>
              <button onClick={() => setEditing(true)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Pencil" size={14} />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">Уровень {level} • {xpInLevel}/100 XP</p>
          <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl p-4"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
            <span className="text-2xl">{s.emoji}</span>
            <p className="text-2xl font-black mt-2" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cloud sync info */}
      <div className="glass rounded-2xl p-4 mb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(6,182,212,0.15)' }}>
          <Icon name="Cloud" size={20} style={{ color: '#06B6D4' } as React.CSSProperties} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Синхронизация</p>
          <p className="text-xs text-muted-foreground">Данные сохраняются локально</p>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
          Активно
        </div>
      </div>

      {/* App info */}
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.15)' }}>
          <Icon name="Sparkles" size={20} style={{ color: '#A78BFA' } as React.CSSProperties} />
        </div>
        <div>
          <p className="font-semibold text-sm">АчивКи v1.0</p>
          <p className="text-xs text-muted-foreground">Трекер достижений по 4 параметрам</p>
        </div>
      </div>

      {/* Params quick overview */}
      <div className="mt-5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Мои параметры</p>
        <div className="space-y-2">
          {data.params.map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: `${p.color}08`, border: `1px solid ${p.color}15` }}>
              <span className="text-lg">{p.emoji}</span>
              <span className="flex-1 text-sm font-medium">{p.name}</span>
              <span className="text-xs font-bold" style={{ color: p.color }}>
                {p.total} {p.unit} всего
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
