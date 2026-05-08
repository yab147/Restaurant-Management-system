import { useState } from "react";
import { Sidebar } from "./components/Dashboard/Sidebar";
import { Overview } from "./components/Dashboard/Overview";
import { Orders } from "./components/Dashboard/Orders";
import { MenuManagement } from "./components/Dashboard/MenuManagement";
import { Reservations } from "./components/Dashboard/Reservations";
import { Staff } from "./components/Dashboard/Staff";
import { Analytics } from "./components/Dashboard/Analytics";
import { Settings } from "./components/Dashboard/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "orders":
        return <Orders />;
      case "menu":
        return <MenuManagement />;
      case "reservations":
        return <Reservations />;
      case "staff":
        return <Staff />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
