import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../shared/context/AuthContext';
const AppContext = createContext(null);
export const AppProvider = ({
  children
}) => {
  const { currentUser, login, signup, logout, sidebarOpen, setSidebarOpen } = useAuth();
  const [tableList, setTableList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [menuItemList, setMenuItemList] = useState([]);
  const [menuCategoryList, setMenuCategoryList] = useState([]);
  const [reservationList, setReservationList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [salesDataList, setSalesDataList] = useState([]);
  const [topItemsList, setTopItemsList] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    // Fetch all initial data from the backend API
    const fetchData = async () => {
      try {
        const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
        const endpoints = ['/api/tables', '/api/menu', '/api/menu-categories', '/api/orders', '/api/reservations', '/api/ingredients', '/api/payments', '/api/users'];
        const base = 'http://localhost:3001';
        const results = await Promise.all(endpoints.map(ep => fetch(base + ep, { headers }).then(res => res.json()).catch(err => { console.error('Fetch error', ep, err); return null; })));
        const [tables, menu, categories, orders, reservations, ingredients, payments, users] = results;

        if (Array.isArray(tables)) setTableList(tables);
        if (Array.isArray(menu)) setMenuItemList(menu);
        if (Array.isArray(categories)) setMenuCategoryList(categories);
        if (Array.isArray(orders)) setOrderList(orders);
        if (Array.isArray(reservations)) setReservationList(reservations);
        if (Array.isArray(ingredients)) setIngredientList(ingredients);
        if (Array.isArray(payments)) setPaymentList(payments);
        if (Array.isArray(users)) setAllUsers(users);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };
    fetchData();
  }, []);
  return <AppContext.Provider value={{
    currentUser,
    login,
    signup,
    logout,
    tables: tableList,
    setTables: setTableList,
    orders: orderList,
    setOrders: setOrderList,
    menuItems: menuItemList,
    setMenuItems: setMenuItemList,
    menuCategories: menuCategoryList,
    setMenuCategories: setMenuCategoryList,
    reservations: reservationList,
    setReservations: setReservationList,
    ingredients: ingredientList,
    setIngredients: setIngredientList,
    payments: paymentList,
    setPayments: setPaymentList,
    allUsers,
    setAllUsers,
    salesData: salesDataList,
    setSalesData: setSalesDataList,
    topItems: topItemsList,
    setTopItems: setTopItemsList,
    sidebarOpen,
    setSidebarOpen
  }}>
    {children}
  </AppContext.Provider>;
};
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};