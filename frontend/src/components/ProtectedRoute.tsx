import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7f9fb',
        color: '#131b2e',
        fontFamily: 'sans-serif'
      }}>
        <h3>Carregando sessão...</h3>
      </div>
    );
  }

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
};
