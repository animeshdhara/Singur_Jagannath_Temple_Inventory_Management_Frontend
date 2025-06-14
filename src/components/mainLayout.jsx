import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from './sidebar';
import DropDownMenu from './dropDownMenu';
import Profile from './profile';

const drawerWidth = 240;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleGenerateBarcode = () => {
    navigate('/generate-barcode');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, padding: '1px' }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap onClick={()=>navigate('/')} className='cursor-pointer'>
            Logo
          </Typography>
          <Button
            sx={{
              backgroundColor: '#0d47a1',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#08306b',
              },
              borderRadius: '8px',
              position: "absolute",
              right: "320px"
            }}
            onClick={handleGenerateBarcode}
          >
            Generate Barcode
          </Button>
          <DropDownMenu />
          <Box sx={{ flexGrow: 1 }} />
          <Profile />
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <SideBar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          // ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
