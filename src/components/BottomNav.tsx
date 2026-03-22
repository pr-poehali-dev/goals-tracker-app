import Icon from "@/components/ui/icon";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", icon: "LayoutDashboard", label: "Главная" },
  { id: "params", icon: "SlidersHorizontal", label: "Параметры" },
  { id: "charts", icon: "BarChart3", label: "Статистика" },
  { id: "history", icon: "History", label: "История" },
  { id: "rewards", icon: "Trophy", label: "Награды" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto px-3 pb-3 pt-1">
        <div className="glass rounded-2xl px-2 py-2 flex items-center justify-around"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-0"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))' : 'transparent',
                }}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute inset-0 rounded-full blur-md opacity-60"
                      style={{ background: 'var(--grad-1)', transform: 'scale(1.5)' }} />
                  )}
                  <Icon
                    name={tab.icon}
                    size={20}
                    className="relative z-10 transition-colors duration-200"
                    style={{ color: isActive ? '#A78BFA' : '#6B7280' } as React.CSSProperties}
                  />
                </div>
                <span
                  className="text-[9px] font-medium leading-none transition-colors duration-200 truncate max-w-[44px] text-center"
                  style={{ color: isActive ? '#A78BFA' : '#6B7280' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
