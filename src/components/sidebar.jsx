import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';

const openedMixin = (drawerWidth) => (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, drawerwidth }) => {
    const drawerWidth = drawerwidth || 260;
    return {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      variants: [
        {
          props: ({ open }) => open,
          style: {
            ...openedMixin(drawerWidth)(theme),
            '& .MuiDrawer-paper': {
              ...openedMixin(drawerWidth)(theme),
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)',
              borderRight: '1px solid #e0e0e0',
            },
          },
        },
        {
          props: ({ open }) => !open,
          style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
              ...closedMixin(theme),
              background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)',
              borderRight: '1px solid #e0e0e0',
            },
          },
        },
      ],
    };
  }
);

export default function SideBar({ drawerWidth = 260 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  const sidebarItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Add Item', path: '/addItem', icon: AddIcon },
    { label: 'Update Item', path: '/updateItem', icon: EditIcon },
    { label: 'Delete Item', path: '/deleteItem', icon: DeleteIcon },
    { label: 'Show Stocks', path: '/showStocks', icon: InventoryIcon },
  ];

  const reportItems = [
    { label: 'Create Bill', path: '/showBill', icon: ReceiptIcon },
    { label: 'View Reports', path: '/showReveneu', icon: LeaderboardIcon },
  ];

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const isActive = (path) => location.pathname === path;

  const SidebarItem = ({ item }) => (
    <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={[
          {
            minHeight: 48,
            px: 2.5,
            my: 0.5,
            borderRadius: 1,
            mx: 1,
            transition: (theme) => theme.transitions.create(['all'], {
              duration: theme.transitions.duration.shorter,
            }),
          },
          isActive(item.path)
            ? {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }
            : {
                color: '#333',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  '& .MuiListItemIcon-root': { color: '#667eea' },
                },
              },
          open
            ? { justifyContent: 'initial' }
            : { justifyContent: 'center' },
        ]}
        onClick={() => navigate(item.path)}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
              transition: (theme) => theme.transitions.create(['color', 'margin'], {
                duration: theme.transitions.duration.shorter,
              }),
            },
            open ? { mr: 3 } : { mr: 'auto' },
          ]}
        >
          <item.icon />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          sx={[
            {
              transition: (theme) => theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.shorter,
              }),
            },
            open
              ? { opacity: 1 }
              : { opacity: 0 },
          ]}
          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
        />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
        drawerwidth={drawerWidth}
        sx={{
          '& .MuiDrawer-paper': {
            scrollBehavior: 'smooth',
          },
        }}
      >
        <DrawerHeader>
          {open && (
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              Menu
            </Typography>
          )}
        </DrawerHeader>

        {/* Main Menu */}
        <List sx={{ px: 1 }}>
          {sidebarItems.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </List>

        <Divider sx={{ my: 1.5, mx: 1 }} />

        {/* Reports Section */}
        {open && (
          <Typography
            variant="caption"
            sx={{
              px: 2.5,
              py: 1,
              display: 'block',
              fontWeight: 600,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Reports
          </Typography>
        )}

        <List sx={{ px: 1 }}>
          {reportItems.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
