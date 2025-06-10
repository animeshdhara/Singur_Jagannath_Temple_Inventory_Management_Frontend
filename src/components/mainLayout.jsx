import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import SideBar from './sidebar';
import DropDownMenu from './dropDownMenu';
import Profile from './profile';


const drawerWidth = 240;

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, padding: '1px' }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap>
            Logo
          </Typography>
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
          p: 3,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar /> {/* Push content below AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
