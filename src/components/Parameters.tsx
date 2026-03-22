import { useState } from "react";
import { AppData, Param } from "@/lib/appData";
import Icon from "@/components/ui/icon";

interface Props {
  data: AppData;
  onUpdateParam: (paramId: string, updates: Partial<Param>) => void;
  onAddEntry: (paramId: string, value: number) => void;
}

const EMOJIS = ["💪", "📚", "🧘", "💧", "🏃", "🎯", "🧠", "✍️", "🎸", "🌱", "🥗", "😴", "🚴", "🏊", "🎨"];
const COLORS = ["#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#EF4444", "#3B82F6", "#8B5CF6"];

export default function Parameters({ data, onUpdateParam, onAddEntry }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Param>>({});

  const startEdit = (param: Param) => {
    setEditingId(param.id);
    setEditForm({ name: param.name, emoji: param.emoji, color: param.color, unit: param.unit, goal: param.goal });
  };

  const saveEdit = () => {
    if (editingId) {
      const gradMap: Record<string, string> = {
        "#7C3AED": "linear-gradient(135deg, #7C3AED, #A855F7)",
        "#06B6D4": "linear-gradient(135deg, #06B6D4, #22D3EE)",
        "#10B981": "linear-gradient(135deg, #10B981, #34D399)",
        "#F59E0B": "linear-gradient(135deg, #F59E0B, #FCD34D)",
        "#EC4899": "linear-gradient(135deg, #EC4899, #F472B6)",
        "#EF4444": "linear-gradient(135deg, #EF4444, #F87171)",
        "#3B82F6": "linear-gradient(135deg, #3B82F6, #60A5FA)",
        "#8B5CF6": "linear-gradient(135deg, #8B5CF6, #A78BFA)",
      };
      onUpdateParam(editingId, {
        ...editForm,
        gradient: gradMap[editForm.color || "#7C3AED"] || `linear-gradient(135deg, ${editForm.color}, ${editForm.color}88)`,
      });
      setEditingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black">
          <span className="gradient-text">Параметры</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Настрой свои 4 цели отслеживания</p>
      </div>

      <div className="space-y-3">
        {data.params.map((param, i) => {
          const progress = Math.min((param.current / param.goal) * 100, 100);
          const isEditing = editingId === param.id;

          return (
            <div
              key={param.id}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                border: `1px solid ${param.color}30`,
                background: `linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))`,
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {/* Header row */}
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${param.color}20` }}>
                    {param.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-base">{param.name}</p>
                      <button
                        onClick={() => isEditing ? setEditingId(null) : startEdit(param)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: isEditing ? `${param.color}30` : 'transparent', color: param.color }}
                      >
                        <Icon name={isEditing ? "X" : "Pencil"} size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {param.current} / {param.goal} {param.unit} •
                      <span className="font-semibold" style={{ color: param.color }}> {Math.round(progress)}%</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: param.gradient, boxShadow: `0 0 8px ${param.color}60` }} />
                </div>

                <div className="flex gap-2 mt-3">
                  {[1, 5, 10].map(v => (
                    <button
                      key={v}
                      onClick={() => onAddEntry(param.id, v)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
                      style={{ background: `${param.color}20`, color: param.color, border: `1px solid ${param.color}30` }}
                    >
                      +{v} {param.unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit form */}
              {isEditing && (
                <div className="px-4 pb-4 border-t animate-fade-in" style={{ borderColor: `${param.color}20` }}>
                  <div className="pt-4 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Название</label>
                      <input
                        value={editForm.name || ""}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Цель</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editForm.goal || ""}
                          onChange={e => setEditForm(f => ({ ...f, goal: Number(e.target.value) }))}
                          className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                        />
                        <input
                          value={editForm.unit || ""}
                          onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                          className="w-20 bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                          placeholder="ед."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Иконка</label>
                      <div className="flex flex-wrap gap-2">
                        {EMOJIS.map(e => (
                          <button key={e} onClick={() => setEditForm(f => ({ ...f, emoji: e }))}
                            className="w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all"
                            style={{ background: editForm.emoji === e ? `${param.color}30` : 'rgba(255,255,255,0.05)', border: editForm.emoji === e ? `1px solid ${param.color}` : '1px solid transparent' }}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Цвет</label>
                      <div className="flex gap-2 flex-wrap">
                        {COLORS.map(c => (
                          <button key={c} onClick={() => setEditForm(f => ({ ...f, color: c }))}
                            className="w-8 h-8 rounded-full transition-all"
                            style={{ background: c, border: editForm.color === c ? '2px solid white' : '2px solid transparent', transform: editForm.color === c ? 'scale(1.15)' : 'scale(1)' }} />
                        ))}
                      </div>
                    </div>
                    <button onClick={saveEdit}
                      className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
                      style={{ background: param.gradient }}>
                      Сохранить
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 glass rounded-2xl p-4 flex items-center gap-3">
        <Icon name="Info" size={18} className="text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">Нажми карандаш, чтобы изменить название, цель, иконку или цвет параметра</p>
      </div>
    </div>
  );
}
