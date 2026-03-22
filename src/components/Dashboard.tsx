import { useState } from "react";
import { AppData } from "@/lib/appData";
import Icon from "@/components/ui/icon";

interface Props {
  data: AppData;
  onAddEntry: (paramId: string, value: number) => void;
}

export default function Dashboard({ data, onAddEntry }: Props) {
  const [adding, setAdding] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("1");

  const totalProgress = data.params.reduce((acc, p) => {
    return acc + Math.min(p.current / p.goal, 1);
  }, 0) / data.params.length * 100;

  const handleAdd = (paramId: string) => {
    const val = parseFloat(inputVal);
    if (!isNaN(val) && val > 0) {
      onAddEntry(paramId, val);
      setAdding(null);
      setInputVal("1");
    }
  };

  const today = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 pt-2">
        <p className="text-muted-foreground text-sm capitalize">{today}</p>
        <h1 className="text-3xl font-black mt-1 leading-tight">
          Привет, <span className="gradient-text">{data.userName}!</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Продолжай двигаться к цели 🚀</p>
      </div>

      {/* Overall progress */}
      <div className="glass rounded-2xl p-5 mb-5 gradient-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Общий прогресс</span>
          <span className="text-2xl font-black gradient-text">{Math.round(totalProgress)}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${totalProgress}%`,
              background: 'linear-gradient(90deg, var(--grad-1), var(--grad-2))',
              boxShadow: '0 0 10px rgba(124,58,237,0.5)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Активных: {data.params.filter(p => p.current > 0).length} из {data.params.length}</span>
          <span className="text-xs text-muted-foreground">Записей: {data.entries.length}</span>
        </div>
      </div>

      {/* Param cards */}
      <div className="grid grid-cols-2 gap-3">
        {data.params.map((param, i) => {
          const progress = Math.min((param.current / param.goal) * 100, 100);
          const isActive = adding === param.id;
          return (
            <div
              key={param.id}
              className="rounded-2xl p-4 relative overflow-hidden cursor-pointer hover-scale"
              style={{
                background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))`,
                border: `1px solid ${param.color}30`,
                animationDelay: `${i * 0.08}s`,
              }}
              onClick={() => !isActive && setAdding(isActive ? null : param.id)}
            >
              {/* Glow bg */}
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: param.gradient }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{param.emoji}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${param.color}25`, color: param.color }}>
                    {Math.round(progress)}%
                  </span>
                </div>

                <p className="font-bold text-sm text-foreground">{param.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold" style={{ color: param.color }}>{param.current}</span>
                  <span> / {param.goal} {param.unit}</span>
                </p>

                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: param.gradient, boxShadow: `0 0 6px ${param.color}80` }}
                  />
                </div>

                {isActive ? (
                  <div className="mt-3 flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <input
                      type="number"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-white/30 w-full"
                      autoFocus
                      min="0.1"
                      step="0.5"
                    />
                    <button
                      onClick={() => handleAdd(param.id)}
                      className="rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                      style={{ background: param.gradient }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => setAdding(null)}
                      className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground bg-secondary"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-3 w-full rounded-lg py-1.5 text-xs font-semibold transition-all"
                    style={{ background: `${param.color}20`, color: param.color, border: `1px solid ${param.color}30` }}
                  >
                    + Отметить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak */}
      <div className="mt-5 glass rounded-2xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl animate-float"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(252,211,77,0.1))' }}>
          🔥
        </div>
        <div>
          <p className="font-bold text-foreground">Серия активности</p>
          <p className="text-sm text-muted-foreground">Ты активен <span className="text-amber-400 font-bold">5 дней</span> подряд!</p>
        </div>
        <Icon name="ChevronRight" size={20} className="ml-auto text-muted-foreground" />
      </div>
    </div>
  );
}
