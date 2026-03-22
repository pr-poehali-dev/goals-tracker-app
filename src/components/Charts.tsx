import { AppData } from "@/lib/appData";

interface Props {
  data: AppData;
}

function getMiniData(entries: AppData["entries"], paramId: string) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days[key] = 0;
  }
  entries
    .filter(e => e.paramId === paramId)
    .forEach(e => {
      const key = e.date.split("T")[0];
      if (key in days) days[key] = (days[key] || 0) + e.value;
    });
  return Object.values(days);
}

function getWeekDays() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const today = new Date().getDay();
  const offset = today === 0 ? 6 : today - 1;
  return Array.from({ length: 7 }, (_, i) => days[(offset - 6 + i + 7) % 7]);
}

export default function Charts({ data }: Props) {
  const weekDays = getWeekDays();

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black">
          <span className="gradient-text">Статистика</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Прогресс за последние 7 дней</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Всего записей</p>
          <p className="text-3xl font-black gradient-text">{data.entries.length}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Активных дней</p>
          <p className="text-3xl font-black" style={{ color: '#10B981' }}>
            {new Set(data.entries.map(e => e.date.split("T")[0])).size}
          </p>
        </div>
      </div>

      {/* Bar charts per param */}
      <div className="space-y-4">
        {data.params.map((param, pi) => {
          const barData = getMiniData(data.entries, param.id);
          const maxVal = Math.max(...barData, 1);
          const totalThisWeek = barData.reduce((a, b) => a + b, 0);

          return (
            <div
              key={param.id}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: `1px solid ${param.color}25`,
                animationDelay: `${pi * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{param.emoji}</span>
                  <span className="font-bold text-sm">{param.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">За неделю</p>
                  <p className="font-bold text-sm" style={{ color: param.color }}>
                    {totalThisWeek} {param.unit}
                  </p>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-1.5 h-20">
                {barData.map((val, idx) => {
                  const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                  const isToday = idx === 6;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col justify-end" style={{ height: '64px' }}>
                        <div
                          className="w-full rounded-t-lg transition-all duration-700 relative overflow-hidden"
                          style={{
                            height: `${Math.max(heightPct, val > 0 ? 8 : 2)}%`,
                            background: val > 0 ? param.gradient : 'rgba(255,255,255,0.05)',
                            boxShadow: val > 0 && isToday ? `0 0 10px ${param.color}60` : 'none',
                            border: isToday ? `1px solid ${param.color}60` : 'none',
                          }}
                        >
                          {val > 0 && (
                            <div className="absolute inset-0 opacity-30"
                              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] text-muted-foreground"
                        style={{ color: isToday ? param.color : undefined, fontWeight: isToday ? 700 : 400 }}>
                        {weekDays[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress to goal */}
              <div className="mt-4 pt-3 border-t" style={{ borderColor: `${param.color}15` }}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">К цели месяца</span>
                  <span style={{ color: param.color }} className="font-semibold">
                    {param.current} / {param.goal} {param.unit}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{
                      width: `${Math.min((param.current / param.goal) * 100, 100)}%`,
                      background: param.gradient,
                    }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
