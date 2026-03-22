import { AppData } from "@/lib/appData";
import Icon from "@/components/ui/icon";

interface Props {
  data: AppData;
}

function groupByDate(entries: AppData["entries"]) {
  const groups: Record<string, AppData["entries"]> = {};
  entries.forEach(e => {
    const key = e.date.split("T")[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Сегодня";
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function History({ data }: Props) {
  const grouped = groupByDate(data.entries);
  const paramMap = Object.fromEntries(data.params.map(p => [p.id, p]));

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black">
          <span className="gradient-text">История</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Все твои отметки и изменения</p>
      </div>

      {grouped.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-muted-foreground">Пока нет записей</p>
          <p className="text-xs text-muted-foreground mt-1">Начни отмечать прогресс на Главной</p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, entries]) => {
            const dayTotal = entries.reduce((acc, e) => {
              const p = paramMap[e.paramId];
              if (!acc[e.paramId]) acc[e.paramId] = { param: p, count: 0 };
              acc[e.paramId].count += e.value;
              return acc;
            }, {} as Record<string, { param: typeof data.params[0]; count: number }>);

            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-foreground">{formatDate(date)}</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{entries.length} записей</span>
                </div>

                {/* Day summary pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.values(dayTotal).map(({ param, count }) => param && (
                    <span key={param.id} className="text-xs px-2 py-1 rounded-full font-semibold"
                      style={{ background: `${param.color}20`, color: param.color }}>
                      {param.emoji} {count} {param.unit}
                    </span>
                  ))}
                </div>

                {/* Entries */}
                <div className="space-y-2">
                  {entries.map(entry => {
                    const param = paramMap[entry.paramId];
                    if (!param) return null;
                    return (
                      <div key={entry.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                        style={{ background: `${param.color}08`, border: `1px solid ${param.color}15` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: `${param.color}20` }}>
                          {param.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">{param.name}</p>
                          {entry.note && (
                            <p className="text-xs text-muted-foreground truncate">{entry.note}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold" style={{ color: param.color }}>
                            +{entry.value} {param.unit}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{formatTime(entry.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data.entries.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-4 flex items-center gap-3">
          <Icon name="TrendingUp" size={18} style={{ color: '#10B981' } as React.CSSProperties} className="flex-shrink-0" />
          <div>
            <p className="text-sm font-bold">Всего за всё время</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.params.map(p => (
                <span key={p.id} className="text-xs" style={{ color: p.color }}>
                  {p.emoji} {p.total} {p.unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
