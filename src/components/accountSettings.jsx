import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Avatar,
  Paper,
  Alert,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'react-toastify'
import { useUser } from '../context/UserContext'

function AccountSettings() {
  const { user, updateUser } = useUser()
  const [tabValue, setTabValue] = useState(0)
  const [editedUser, setEditedUser] = useState(user)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    lowStock: true,
    salesAlert: true,
  })

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSaveProfile = () => {
    if (!editedUser.name || !editedUser.email) {
      toast.error('Name and Email are required')
      return
    }
    updateUser(editedUser)
    toast.success('Profile updated successfully!')
  }

  const handleChangePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('All password fields are required')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    toast.success('Password changed successfully!')
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications))
    toast.success('Notification settings saved!')
  }

  const getInitials = () => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonIcon /> Account Settings
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Manage your profile, security, and preferences
        </Typography>
      </Box>

      {/* Profile Summary Card */}
      <Card sx={{ mb: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
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
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {user.email}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Member since {user.joinDate}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
            <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Shop/Business Name"
                    value={editedUser.shopName}
                    onChange={(e) => setEditedUser({ ...editedUser, shopName: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Save Profile
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Security Tab */}
          {tabValue === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Keep your account secure by using a strong password
              </Alert>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Change Password
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleChangePassword}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Two-Factor Authentication
              </Typography>

              <Paper sx={{ p: 2, backgroundColor: '#f8f9ff', border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Enable 2FA
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Add an extra layer of security
                    </Typography>
                  </Box>
                  <Switch defaultChecked={false} />
                </Box>
              </Paper>
            </Box>
          )}

          {/* Notifications Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Notification Preferences
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, backgroundColor: '#f8f9ff', border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Email Notifications
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Receive updates via email
                      </Typography>
                    </Box>
                    <Switch
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#f8f9ff', border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Low Stock Alerts
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Get notified when inventory is low
                      </Typography>
                    </Box>
                    <Switch
                      checked={notifications.lowStock}
                      onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#f8f9ff', border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Sales Alerts
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Get notified on important sales
                      </Typography>
                    </Box>
                    <Switch
                      checked={notifications.salesAlert}
                      onChange={(e) => setNotifications({ ...notifications, salesAlert: e.target.checked })}
                    />
                  </Box>
                </Paper>

                <Button
                  variant="contained"
                  onClick={handleSaveNotifications}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    mt: 2,
                  }}
                >
                  Save Preferences
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AccountSettings
