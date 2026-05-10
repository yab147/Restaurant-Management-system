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
  // Restore persisted auth state on mount and fetch initial data
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Failed to parse stored user:', e);
        localStorage.removeItem('currentUser');
      }
    }

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
        // persist user + optional token
        try {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('authToken', data.token);
        } catch (e) {
          console.warn('Failed to persist auth data:', e);
        }
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
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    } catch (e) {
      console.warn('Error clearing local storage on logout', e);
    }
  };

  // Keep localStorage in sync if currentUser changes elsewhere
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
      else localStorage.removeItem('currentUser');
    } catch (e) {
      console.warn('Failed to sync currentUser to localStorage:', e);
    }
  }, [currentUser]);
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