import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: 'Admin User',
          email: 'admin@singarmandir.com',
          phone: '+91 9876543210',
          shopName: 'Singur Jagannath Temple',
          role: 'Manager',
          joinDate: new Date().toLocaleDateString(),
        }
  })

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('authToken') !== null
  })

  // Update user and save to localStorage
  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Login function (to be used with backend)
  const login = (userData, token) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('authToken', token)
  }

  // Logout function
  const logout = () => {
    setUser({
      name: 'Admin User',
      email: 'admin@singarmandir.com',
      phone: '+91 9876543210',
      shopName: 'Singur Jagannath Temple',
      role: 'Manager',
      joinDate: new Date().toLocaleDateString(),
    })
    setIsLoggedIn(false)
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    isLoggedIn,
    updateUser,
    login,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
