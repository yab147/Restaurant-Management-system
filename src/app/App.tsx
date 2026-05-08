import { useState } from "react";
import { Sidebar } from "./components/Dashboard/Sidebar";
import { Overview } from "./components/Dashboard/Overview";
import { Orders } from "./components/Dashboard/Orders";
import { MenuManagement } from "./components/Dashboard/MenuManagement";
import { Reservations } from "./components/Dashboard/Reservations";
import { Staff } from "./components/Dashboard/Staff";
import { Analytics } from "./components/Dashboard/Analytics";
import { Settings } from "./components/Dashboard/Settings";
import { Welcome } from "./pages/Welcome";
import { LoginDialog } from "./pages/LoginDialog";
import { CustomerWelcome } from "./pages/CustomerWelcome";
import { CustomerLoginDialog } from "./pages/CustomerLoginDialog";
import { CustomerMenu } from "./pages/CustomerMenu";

interface StaffUser {
  name: string;
  email: string;
}

interface CustomerUser {
  name: string;
  email: string;
  phone: string;
}

export default function App() {
  const [userType, setUserType] = useState<"none" | "staff" | "customer">("none");
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCustomerLoginDialog, setShowCustomerLoginDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleStaffLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleStaffLoginSuccess = (userData: StaffUser) => {
    setStaffUser(userData);
    setUserType("staff");
    setShowLoginDialog(false);
  };

  const handleStaffLogout = () => {
    setUserType("none");
    setStaffUser(null);
    setActiveTab("overview");
  };

  const handleCustomerLoginClick = () => {
    setShowCustomerLoginDialog(true);
  };

  const handleCustomerLoginSuccess = (userData: CustomerUser) => {
    setCustomerUser(userData);
    setUserType("customer");
    setShowCustomerLoginDialog(false);
  };

  const handleCustomerLogout = () => {
    setUserType("none");
    setCustomerUser(null);
  };

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

  // Customer Flow
  if (userType === "customer") {
    return (
      <>
        <CustomerMenu
          user={customerUser || undefined}
          onLogout={handleCustomerLogout}
        />
      </>
    );
  }

  // Staff Flow
  if (userType === "staff") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={staffUser}
          onLogout={handleStaffLogout}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    );
  }

  // Welcome/Landing
  return (
    <>
      <CustomerWelcome
        onCustomerLogin={handleCustomerLoginClick}
        onCustomerRegister={handleCustomerLoginClick}
        onStaffLogin={handleStaffLoginClick}
      />
      <CustomerLoginDialog
        isOpen={showCustomerLoginDialog}
        onClose={() => setShowCustomerLoginDialog(false)}
        onLoginSuccess={handleCustomerLoginSuccess}
      />
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginSuccess={handleStaffLoginSuccess}
      />
    </>
  );
}
