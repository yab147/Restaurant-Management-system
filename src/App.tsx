import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type RoleKey = "manager" | "waiter" | "chef" | "cashier";
type ViewState = "landing" | "dashboard";

interface Order {
  id: number;
  table: string;
  guest: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "ready" | "served" | "paid";
  progress: number;
}

interface TableStatus {
  label: string;
  state: "free" | "busy" | "reserved" | "ready";
  guests?: number;
}

interface InventoryItem {
  name: string;
  value: number;
  unit: string;
  threshold: number;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

const roles: Record<
  RoleKey,
  {
    title: string;
    focus: string;
    actions: string[];
    color: string;
  }
> = {
  manager: {
    title: "Manager",
    focus: "Menu, inventory, tables, and daily reports stay visible in one calm workspace.",
    actions: ["Approve menu changes", "Track ingredient stock", "Review sales by shift", "Manage staff schedules"],
    color: "#7d6535",
  },
  waiter: {
    title: "Waiter",
    focus: "Table availability and order status are simple enough to read during a rush.",
    actions: ["Place a table order", "Update serving progress", "Make reservations", "View customer requests"],
    color: "#52604f",
  },
  chef: {
    title: "Chef",
    focus: "The kitchen receives clean tickets with quantities, notes, and preparation priority.",
    actions: ["View active orders", "Mark food ready", "Flag low ingredients", "Update prep status"],
    color: "#8b4513",
  },
  cashier: {
    title: "Cashier",
    focus: "Bills, receipts, and payment methods connect directly to the completed order.",
    actions: ["Process payment", "Generate receipt", "Close paid orders", "Handle refunds"],
    color: "#4a5568",
  },
};

const initialOrders: Order[] = [
  { id: 1, table: "T2", guest: "Family of 4", items: ["Beyaynetu platter", "Tibs", "Injera"], total: 850, status: "preparing", progress: 62 },
  { id: 2, table: "T5", guest: "2 guests", items: ["Tibs and firfir", "Coffee ceremony"], total: 520, status: "ready", progress: 100 },
  { id: 3, table: "T8", guest: "Reservation", items: ["Coffee ceremony set", "Traditional bread"], total: 380, status: "served", progress: 28 },
  { id: 4, table: "T1", guest: "Solo diner", items: ["Kitfo", "Gomen"], total: 420, status: "pending", progress: 15 },
];

const initialInventory: InventoryItem[] = [
  { name: "Teff injera", value: 78, unit: "pieces", threshold: 20 },
  { name: "Berbere", value: 42, unit: "kg", threshold: 10 },
  { name: "Fresh herbs", value: 23, unit: "bundles", threshold: 15 },
  { name: "Coffee beans", value: 35, unit: "kg", threshold: 8 },
];

const initialTables: TableStatus[] = [
  { label: "T1", state: "busy", guests: 1 },
  { label: "T2", state: "busy", guests: 4 },
  { label: "T3", state: "free" },
  { label: "T4", state: "reserved", guests: 3 },
  { label: "T5", state: "ready", guests: 2 },
  { label: "T6", state: "busy", guests: 5 },
  { label: "T7", state: "free" },
  { label: "T8", state: "reserved", guests: 2 },
];

const menuItems: MenuItem[] = [
  { id: 1, name: "Beyaynetu", category: "Main", price: 280, available: true },
  { id: 2, name: "Tibs", category: "Main", price: 350, available: true },
  { id: 3, name: "Kitfo", category: "Main", price: 420, available: true },
  { id: 4, name: "Doro Wat", category: "Main", price: 380, available: true },
  { id: 5, name: "Firfir", category: "Main", price: 220, available: true },
  { id: 6, name: "Coffee Ceremony", category: "Beverage", price: 150, available: true },
  { id: 7, name: "Traditional Bread", category: "Side", price: 45, available: true },
  { id: 8, name: "Gomen", category: "Side", price: 120, available: true },
];

const roleKeys = Object.keys(roles) as RoleKey[];

function LandingPage({ onEnterDashboard }: { onEnterDashboard: () => void }) {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#223126]">
      <section className="relative min-h-screen overflow-hidden">
        <img
          src="/images/holy-restaurant-hero.jpg"
          alt="Natural Ethiopian restaurant interior with injera and traditional dishes"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172116]/90 via-[#172116]/55 to-[#172116]/10" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 text-white lg:px-10">
          <a href="#top" className="text-xl font-semibold tracking-[0.28em] uppercase">
            Holy
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/80 md:flex">
            <a className="transition hover:text-white" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-white" href="#operations">
              Operations
            </a>
            <a className="transition hover:text-white" href="#roles">
              Roles
            </a>
          </div>
        </nav>

        <div id="top" className="relative z-10 mx-auto flex min-h-[calc(100vh-92px)] max-w-7xl items-center px-6 pb-20 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.32em] text-[#d6c49a]">
              Dire Dawa, Ethiopia
            </p>
            <h1 className="font-serif text-7xl font-semibold leading-none tracking-tight md:text-8xl lg:text-9xl">
              Holy
            </h1>
            <h2 className="mt-8 max-w-2xl text-3xl font-medium leading-tight md:text-5xl">
              A natural restaurant management system for warm service and steady operations.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
              Manage tables, orders, kitchen flow, payments, inventory, and reports with a calm interface built around Holy's dining room.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onEnterDashboard}
                className="inline-flex items-center justify-center bg-[#d6c49a] px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#172116] transition hover:bg-[#ead9ae]"
              >
                Open dashboard
              </button>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center border border-white/45 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10"
              >
                See workflow
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1.1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 z-10 h-1 w-full origin-left bg-[#d6c49a]"
        />
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7d6535]">Order processing</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            From table request to receipt without noise.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5d675b]">
            Holy's workflow keeps the customer, waiter, kitchen, cashier, and system connected while inventory and reports update in the background.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          {[
            "Place order",
            "Check table",
            "Prepare food",
            "Process payment",
            "Update inventory",
          ].map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              className="border-t border-[#9f8f6a]/45 pt-5"
            >
              <span className="text-sm font-semibold text-[#a27731]">0{index + 1}</span>
              <h3 className="mt-4 text-2xl font-medium">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-[#667064]">
                {index === 0 && "Waiters create clean tickets for dine-in, reservation, or takeaway guests."}
                {index === 1 && "The system confirms seats, table status, and menu availability."}
                {index === 2 && "Chefs see quantities and notes, then mark each dish ready."}
                {index === 3 && "Cashiers accept cash, card, or mobile payment and generate a bill."}
                {index === 4 && "Ingredient stock, alerts, and daily reports refresh after completed orders."}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="operations" className="bg-[#223126] px-6 py-24 text-[#f4f0e8] lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d6c49a]">Live operations</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">A dashboard shaped for Holy's floor.</h2>
            </div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">{today}</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] bg-[#f4f0e8] p-5 text-[#223126] shadow-2xl shadow-black/20 md:p-7">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold">Dining room</h3>
                  <p className="mt-1 text-sm text-[#687165]">Table status updates in real time.</p>
                </div>
                <span className="text-sm font-semibold text-[#7d6535]">8 tables</span>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {initialTables.map((table) => (
                  <motion.button
                    key={table.label}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`min-h-28 rounded-3xl border p-4 text-left transition ${
                      table.state === "free"
                        ? "border-[#8a9a79]/45 bg-[#dfe8d2]"
                        : table.state === "busy"
                          ? "border-[#c4925c]/45 bg-[#f0d7b4]"
                          : table.state === "ready"
                            ? "border-[#b4a35b]/45 bg-[#efe7b8]"
                            : "border-[#a78383]/45 bg-[#ead3cd]"
                    }`}
                  >
                    <span className="text-2xl font-semibold">{table.label}</span>
                    <span className="mt-7 block text-sm capitalize text-[#52604f]">{table.state}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 md:p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Kitchen queue</h3>
                <span className="text-sm text-[#d6c49a]">4 active</span>
              </div>
              <div className="mt-7 space-y-5">
                {initialOrders.map((order) => (
                  <div key={order.id} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold">{order.table} - {order.items[0]}</p>
                        <p className="mt-1 text-sm text-white/55">{order.guest}</p>
                      </div>
                      <span className="text-sm text-[#d6c49a]">{order.status}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${order.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#d6c49a]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {initialInventory.map((item) => (
              <div key={item.name} className="border-t border-white/15 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-3xl font-semibold text-[#d6c49a]">{item.value}</p>
                </div>
                <p className="mt-2 text-sm text-white/50">{item.unit} available</p>
                {item.value <= item.threshold && (
                  <p className="mt-1 text-xs text-red-400">Low stock alert</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7d6535]">Role access</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Everyone sees the right work.</h2>
            <p className="mt-5 text-lg leading-8 text-[#5d675b]">
              Admin permissions keep Holy's data safe while each team member gets the tools they need for the shift.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#e7dfcf] p-4 md:p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {roleKeys.map((role) => (
                <button
                  key={role}
                  className="rounded-full px-4 py-3 text-sm font-semibold transition bg-[#f4f0e8] text-[#52604f] hover:bg-white"
                >
                  {roles[role].title}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-[#f4f0e8] p-6 md:p-8">
              <h3 className="text-3xl font-semibold">Multiple Roles</h3>
              <p className="mt-4 text-lg leading-8 text-[#5d675b]">
                Each role has specific permissions and views tailored to their responsibilities.
              </p>
              <div className="mt-8 space-y-4">
                {["Role-based access control", "Real-time updates", "Data integrity", "Reporting & analytics"].map((feature) => (
                  <div key={feature} className="flex items-center gap-4 border-t border-[#c7bda7] pt-4">
                    <span className="h-2 w-2 rounded-full bg-[#7d6535]" />
                    <p className="font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#172116] px-6 py-12 text-center text-white/60">
        <p className="text-sm">© 2026 Holy Restaurant • Dire Dawa, Ethiopia</p>
      </footer>
    </main>
  );
}

function Dashboard({ onBack }: { onBack: () => void }) {
  const [activeRole, setActiveRole] = useState<RoleKey>("manager");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [tables, setTables] = useState<TableStatus[]>(initialTables);
  const [inventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);

  const activeRoleData = roles[activeRole];

  const handleAddToOrder = (item: MenuItem) => {
    if (!cart.find((c) => c.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    setCart(cart.filter((c) => c.id !== itemId));
  };

  const handleSubmitOrder = () => {
    if (selectedTable && cart.length > 0) {
      const newOrder: Order = {
        id: orders.length + 1,
        table: selectedTable,
        guest: `${cart.length} items`,
        items: cart.map((i) => i.name),
        total: cart.reduce((sum, i) => sum + i.price, 0),
        status: "pending",
        progress: 10,
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setSelectedTable(null);
      setTables(tables.map((t) => 
        t.label === selectedTable ? { ...t, state: "busy" as const, guests: cart.length } : t
      ));
    }
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => 
      o.id === orderId ? { 
        ...o, 
        status: newStatus,
        progress: newStatus === "pending" ? 10 : newStatus === "preparing" ? 50 : newStatus === "ready" ? 85 : newStatus === "served" ? 95 : 100
      } : o
    ));
  };

  const handlePayment = (orderId: number) => {
    handleUpdateOrderStatus(orderId, "paid");
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setTables(tables.map((t) => 
        t.label === order.table ? { ...t, state: "free" as const } : t
      ));
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8]">
      <header className="sticky top-0 z-50 border-b border-[#c7bda7] bg-[#f4f0e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-semibold text-[#52604f] transition hover:text-[#223126]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-semibold tracking-[0.28em] uppercase text-[#223126]">Holy</h1>
          </div>
          <div className="flex items-center gap-3">
            {roleKeys.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeRole === role
                    ? "bg-[#223126] text-white"
                    : "bg-[#e7dfcf] text-[#52604f] hover:bg-[#d4c9b8]"
                }`}
              >
                {roles[role].title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-semibold text-[#223126]">{activeRoleData.title} Dashboard</h2>
          <p className="mt-2 text-[#5d675b]">{activeRoleData.focus}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeRole === "manager" && (
            <motion.div
              key="manager"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#5d675b]">Total Orders Today</p>
                  <p className="mt-2 text-4xl font-semibold text-[#223126]">{orders.length}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#5d675b]">Active Tables</p>
                  <p className="mt-2 text-4xl font-semibold text-[#223126]">{tables.filter((t) => t.state === "busy").length}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#5d675b]">Revenue (ETB)</p>
                  <p className="mt-2 text-4xl font-semibold text-[#223126]">{orders.reduce((sum, o) => sum + o.total, 0)}</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-[#5d675b]">Low Stock Items</p>
                  <p className="mt-2 text-4xl font-semibold text-red-600">{inventory.filter((i) => i.value <= i.threshold).length}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Inventory Overview</h3>
                  <div className="mt-6 space-y-4">
                    {inventory.map((item) => (
                      <div key={item.name}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#52604f]">{item.name}</span>
                          <span className={`text-sm ${item.value <= item.threshold ? "text-red-600" : "text-[#52604f]"}`}>
                            {item.value} {item.unit}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7dfcf]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (item.value / 100) * 100)}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${item.value <= item.threshold ? "bg-red-500" : "bg-[#7d6535]"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Recent Activity</h3>
                  <div className="mt-6 space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b border-[#e7dfcf] pb-3 last:border-0">
                        <div>
                          <p className="font-medium text-[#223126]">{order.table} - {order.items[0]}</p>
                          <p className="text-sm text-[#5d675b]">{order.status}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#7d6535]">{order.total} ETB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeRole === "waiter" && (
            <motion.div
              key="waiter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 lg:grid-cols-3"
            >
              <div className="lg:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Table Status</h3>
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {tables.map((table) => (
                      <button
                        key={table.label}
                        onClick={() => setSelectedTable(table.state === "free" || table.state === "busy" ? table.label : null)}
                        disabled={table.state === "reserved"}
                        className={`min-h-24 rounded-2xl border p-4 text-left transition ${
                          selectedTable === table.label
                            ? "ring-2 ring-[#7d6535]"
                            : ""
                        } ${
                          table.state === "free"
                            ? "border-[#8a9a79]/45 bg-[#dfe8d2]"
                            : table.state === "busy"
                              ? "border-[#c4925c]/45 bg-[#f0d7b4]"
                              : table.state === "ready"
                                ? "border-[#b4a35b]/45 bg-[#efe7b8]"
                                : "border-[#a78383]/45 bg-[#ead3cd] opacity-60"
                        }`}
                      >
                        <span className="text-xl font-semibold">{table.label}</span>
                        <span className="mt-4 block text-sm capitalize text-[#52604f]">
                          {table.state} {table.guests && `(${table.guests})`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTable && (
                  <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-[#223126]">Menu - {selectedTable}</h3>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {menuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAddToOrder(item)}
                          disabled={!item.available || !!cart.find((c) => c.id === item.id)}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                            cart.find((c) => c.id === item.id)
                              ? "border-[#7d6535] bg-[#f4f0e8]"
                              : "border-[#e7dfcf] hover:border-[#7d6535]"
                          } ${!item.available ? "opacity-50" : ""}`}
                        >
                          <div>
                            <p className="font-medium text-[#223126]">{item.name}</p>
                            <p className="text-sm text-[#5d675b]">{item.category}</p>
                          </div>
                          <span className="font-semibold text-[#7d6535]">{item.price} ETB</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Current Order</h3>
                  {cart.length === 0 ? (
                    <p className="mt-4 text-sm text-[#5d675b]">Select items from the menu</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm text-[#223126]">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#7d6535]">{item.price}</span>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="rounded-full p-1 text-red-500 hover:bg-red-50"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-[#e7dfcf] pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#223126]">Total</span>
                          <span className="text-lg font-semibold text-[#7d6535]">{cart.reduce((sum, i) => sum + i.price, 0)} ETB</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSubmitOrder}
                        disabled={!selectedTable || cart.length === 0}
                        className="mt-4 w-full rounded-xl bg-[#7d6535] py-3 font-semibold text-white transition hover:bg-[#6b552d] disabled:opacity-50"
                      >
                        Submit Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeRole === "chef" && (
            <motion.div
              key="chef"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Active Orders</h3>
                  <div className="mt-6 space-y-4">
                    {orders.filter((o) => o.status !== "paid").map((order) => (
                      <div key={order.id} className="rounded-xl border border-[#e7dfcf] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-[#223126]">{order.table}</p>
                            <p className="text-sm text-[#5d675b]">{order.guest}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                            order.status === "ready" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-3 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-sm text-[#52604f]">• {item}</p>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Start Preparing
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === "ready" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "served")}
                              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                            >
                              Mark Served
                            </button>
                          )}
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7dfcf]">
                          <motion.div
                            animate={{ width: `${order.progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full bg-[#7d6535]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Inventory Alerts</h3>
                  <div className="mt-6 space-y-4">
                    {inventory.filter((i) => i.value <= i.threshold).map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
                        <div>
                          <p className="font-medium text-red-700">{item.name}</p>
                          <p className="text-sm text-red-600">{item.value} {item.unit} remaining</p>
                        </div>
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Low Stock</span>
                      </div>
                    ))}
                    {inventory.filter((i) => i.value <= i.threshold).length === 0 && (
                      <p className="text-sm text-[#5d675b]">All ingredients are well stocked</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeRole === "cashier" && (
            <motion.div
              key="cashier"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Orders Ready for Payment</h3>
                  <div className="mt-6 space-y-4">
                    {orders.filter((o) => o.status === "served").map((order) => (
                      <div key={order.id} className="rounded-xl border border-[#e7dfcf] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-[#223126]">{order.table}</p>
                            <p className="text-sm text-[#5d675b]">{order.guest}</p>
                          </div>
                          <span className="text-2xl font-semibold text-[#7d6535]">{order.total} ETB</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-sm text-[#52604f]">• {item}</p>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handlePayment(order.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Process Payment
                          </button>
                          <button className="rounded-lg border border-[#e7dfcf] px-4 py-2 text-sm font-semibold text-[#52604f] hover:bg-[#f4f0e8]">
                            Print Bill
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.filter((o) => o.status === "served").length === 0 && (
                      <p className="text-sm text-[#5d675b]">No orders ready for payment</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#223126]">Today's Summary</h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-[#f4f0e8] p-4">
                      <span className="text-[#52604f]">Total Orders</span>
                      <span className="text-xl font-semibold text-[#223126]">{orders.length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#f4f0e8] p-4">
                      <span className="text-[#52604f]">Paid Orders</span>
                      <span className="text-xl font-semibold text-[#223126]">{orders.filter((o) => o.status === "paid").length}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#f4f0e8] p-4">
                      <span className="text-[#52604f]">Total Revenue</span>
                      <span className="text-xl font-semibold text-[#7d6535]">{orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.total, 0)} ETB</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-[#f4f0e8] p-4">
                      <span className="text-[#52604f]">Pending Payment</span>
                      <span className="text-xl font-semibold text-[#223126]">{orders.filter((o) => o.status === "served").reduce((sum, o) => sum + o.total, 0)} ETB</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<ViewState>("landing");

  return (
    <>
      {view === "landing" ? (
        <LandingPage onEnterDashboard={() => setView("dashboard")} />
      ) : (
        <Dashboard onBack={() => setView("landing")} />
      )}
    </>
  );
}
