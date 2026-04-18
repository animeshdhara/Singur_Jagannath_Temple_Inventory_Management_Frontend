import React, { useState } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUser } from '../context/UserContext'
import StorefrontIcon from '@mui/icons-material/Storefront'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Demo credentials for testing
  const DEMO_USERS = {
    'admin@singarmandir.com': { password: 'admin123', name: 'Admin User', role: 'Manager' },
    'manager@singarmandir.com': { password: 'manager123', name: 'Manager', role: 'Manager' },
    'staff@singarmandir.com': { password: 'staff123', name: 'Staff Member', role: 'Staff' },
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Email and password are required')
        setLoading(false)
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email')
        setLoading(false)
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check demo credentials (replace with actual API call later)
      if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
        const demoUser = DEMO_USERS[email]
        const userData = {
          name: demoUser.name,
          email: email,
          phone: '+91 9876543210',
          shopName: 'Singur Jagannath Temple',
          role: demoUser.role,
          joinDate: new Date().toLocaleDateString(),
        }

        // Generate mock token (replace with actual token from backend)
        const mockToken = `token_${Date.now()}_${Math.random()}`

        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberedEmail', email)
        }

        // Call login function from UserContext
        login(userData, mockToken)

        toast.success(`Welcome, ${userData.name}!`)
        navigate('/')
      } else {
        setError('Invalid email or password')
        toast.error('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      toast.error('Login failed')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail) => {
    setEmail(demoEmail)
    setPassword(DEMO_USERS[demoEmail].password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <CardContent sx={{ padding: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  marginBottom: 2,
                }}
              >
                <StorefrontIcon
                  sx={{
                    fontSize: 40,
                    color: '#667eea',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Singur Mandir
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 600 }}>
                Inventory Management System
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Login to access your dashboard
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ marginBottom: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  marginBottom: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
                disabled={loading}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea',
                      },
                    }}
                  />
                }
                label="Remember me"
                sx={{ marginBottom: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  fontSize: '16px',
                  marginBottom: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3a91 100%)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>

            {/* Divider */}
            <Box sx={{ textAlign: 'center', marginY: 3 }}>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Demo Credentials
              </Typography>
            </Box>

            {/* Demo Account Buttons */}
            <Stack spacing={1.5}>
              {Object.keys(DEMO_USERS).map((demoEmail) => (
                <Paper
                  key={demoEmail}
                  sx={{
                    padding: 1.5,
                    cursor: 'pointer',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderColor: '#667eea',
                    },
                  }}
                  onClick={() => handleDemoLogin(demoEmail)}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {DEMO_USERS[demoEmail].name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                    {demoEmail} / {DEMO_USERS[demoEmail].password}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            {/* Footer */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                marginTop: 3,
                color: '#999',
              }}
            >
              For demo purposes only. Use the credentials above to login.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
