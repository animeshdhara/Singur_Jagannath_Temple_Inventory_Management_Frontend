import React, { useState } from 'react'
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Paper,
} from '@mui/material'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BusinessIcon from '@mui/icons-material/Business'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function Profile() {
  const { user, updateUser, logout } = useUser()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenProfile = () => {
    setOpenProfileModal(true)
    setEditedUser(user)
    handleClose()
  }

  const handleCloseProfile = () => {
    setOpenProfileModal(false)
  }

  const handleSaveProfile = () => {
    updateUser(editedUser)
    toast.success('Profile updated successfully!')
    handleCloseProfile()
  }

  const handleNavigateSettings = () => {
    handleClose()
    navigate('/account-settings')
  }

  const handleLogout = () => {
    logout()
    handleClose()
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  const getInitials = () => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 4px 12px rgba(102, 126, 234, 0.3))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          View Profile
        </MenuItem>
        <MenuItem onClick={handleNavigateSettings}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: '#f5576c' }} />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Profile Modal */}
      <Dialog open={openProfileModal} onClose={handleCloseProfile} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
          My Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              {getInitials()}
            </Avatar>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip
              label={editedUser.role}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 'bold',
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Full Name"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            value={editedUser.phone}
            onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
            }}
          />

          <TextField
            fullWidth
            label="Shop/Business Name"
            value={editedUser.shopName}
            onChange={(e) => setEditedUser({ ...editedUser, shopName: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#667eea' },
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
            }}
          />

          <Paper sx={{ p: 2, mt: 3, backgroundColor: '#f8f9ff', border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              <strong>Member Since:</strong> {editedUser.joinDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Role:</strong> {editedUser.role}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseProfile} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

