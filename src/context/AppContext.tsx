import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Table, Order, MenuItem, Reservation, Ingredient, Payment } from '../types';
import { users, tables as initialTables, orders as initialOrders, menuItems as initialMenuItems, reservations as initialReservations, ingredients as initialIngredients, payments as initialPayments } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tableList, setTableList] = useState<Table[]>(initialTables);
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [menuItemList, setMenuItemList] = useState<MenuItem[]>(initialMenuItems);
  const [reservationList, setReservationList] = useState<Reservation[]>(initialReservations);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>(initialIngredients);
  const [paymentList, setPaymentList] = useState<Payment[]>(initialPayments);
  const [allUsers, setAllUsers] = useState<User[]>(users);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      tables: tableList,
      setTables: setTableList,
      orders: orderList,
      setOrders: setOrderList,
      menuItems: menuItemList,
      setMenuItems: setMenuItemList,
      reservations: reservationList,
      setReservations: setReservationList,
      ingredients: ingredientList,
      setIngredients: setIngredientList,
      payments: paymentList,
      setPayments: setPaymentList,
      allUsers,
      setAllUsers,
      sidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
