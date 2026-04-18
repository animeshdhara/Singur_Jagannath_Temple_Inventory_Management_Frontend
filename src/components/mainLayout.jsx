import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import PrintIcon from '@mui/icons-material/Print';
import StorefrontIcon from '@mui/icons-material/Storefront';

import SideBar from './sidebar';
import Profile from './profile';

const drawerWidth = 260;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleGenerateBarcode = () => {
    navigate('/generate-barcode');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <StorefrontIcon sx={{ fontSize: 32, color: '#fff' }} />
            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 }}
              >
                Inventory
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Management
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Generate Barcode Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
              },
              mr: 2,
              display: { xs: 'none', sm: 'inline-flex' }
            }}
            onClick={handleGenerateBarcode}
          >
            Generate Barcode
          </Button>
          
          {/* Profile */}
          <Profile />

        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <SideBar drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, sm: `${drawerWidth}px` },
          transition: (theme) => theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
          <Outlet />
        </Container>
      </Box>

    </Box>
  );
};

export default MainLayout;