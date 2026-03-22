import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import Parameters from "@/components/Parameters";
import Charts from "@/components/Charts";
import History from "@/components/History";
import Rewards from "@/components/Rewards";
import Profile from "@/components/Profile";
import BottomNav from "@/components/BottomNav";
import { AppData, defaultAppData, Param } from "@/lib/appData";

export default function Index() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState<AppData>(defaultAppData);

  const addEntry = (paramId: string, value: number) => {
    const now = new Date().toISOString();
    const newEntry = { id: Date.now().toString(), paramId, value, date: now };
    setData(prev => ({
      ...prev,
      entries: [newEntry, ...prev.entries],
      params: prev.params.map(p =>
        p.id === paramId
          ? { ...p, current: p.current + value, total: p.total + value }
          : p
      ),
    }));
  };

  const updateParam = (paramId: string, updates: Partial<Param>) => {
    setData(prev => ({
      ...prev,
      params: prev.params.map(p => p.id === paramId ? { ...p, ...updates } : p),
    }));
  };

  const pages: Record<string, JSX.Element> = {
    dashboard: <Dashboard data={data} onAddEntry={addEntry} />,
    params: <Parameters data={data} onUpdateParam={updateParam} onAddEntry={addEntry} />,
    charts: <Charts data={data} />,
    history: <History data={data} />,
    rewards: <Rewards data={data} />,
    profile: <Profile data={data} setData={setData} />,
  };

  return (
    <div className="min-h-screen bg-background font-golos relative overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--grad-1), transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--grad-2), transparent 70%)' }} />
        <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--grad-4), transparent 70%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 pb-28 pt-4 px-4 max-w-lg mx-auto min-h-screen">
        {pages[activeTab]}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
