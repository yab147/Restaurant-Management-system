import React, { createContext, useContext, useState, useEffect } from 'react';
const AppContext = createContext(null);
export const AppProvider = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState(null);
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    // Fetch all initial data from the backend API
    const fetchData = async () => {
      try {
        const [tables, menu, categories, orders, reservations, ingredients, payments, users] = await Promise.all([fetch('http://localhost:3001/api/tables').then(res => res.json()), fetch('http://localhost:3001/api/menu').then(res => res.json()), fetch('http://localhost:3001/api/menu-categories').then(res => res.json()), fetch('http://localhost:3001/api/orders').then(res => res.json()), fetch('http://localhost:3001/api/reservations').then(res => res.json()), fetch('http://localhost:3001/api/ingredients').then(res => res.json()), fetch('http://localhost:3001/api/payments').then(res => res.json()), fetch('http://localhost:3001/api/users').then(res => res.json())]);

        // Safety checks since the DB might return errors or objects if something fails
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
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    return null;
  };
  const signup = async (name, email, password, phone) => {
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone
        })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };
  const logout = () => {
    setCurrentUser(null);
  };
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