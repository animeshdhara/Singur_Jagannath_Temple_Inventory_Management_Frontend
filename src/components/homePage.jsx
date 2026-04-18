import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WarningIcon from '@mui/icons-material/Warning'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../services/api'

function HomePage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    totalRevenue: 0
  })
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetchDashboardData(controller)
    
    return () => controller.abort()
  }, [])

  const fetchDashboardData = async (controller) => {
    try {
      setLoading(true)
      const res = await API.get('/products', { signal: controller.signal })
      const products = res.data

      // Calculate stats
      const totalProducts = products.length
      const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
      const lowStockProducts = products.filter(p => (p.stock || 0) < 10)
      const lowStockCount = lowStockProducts.length
      const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)

      setStats({
        totalProducts,
        totalStock,
        lowStockCount,
        totalRevenue
      })

      setLowStockProducts(lowStockProducts.slice(0, 5))
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 40, color, opacity: 0.2 }} />
        </Box>
      </CardContent>
    </Card>
  )

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Icon sx={{ fontSize: 50, color, mb: 2 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Welcome Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          p: 4,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Welcome to Inventory Management
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Manage your products, track stocks, and generate invoices efficiently
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Quick Stats
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={InventoryIcon}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Stock"
            value={stats.totalStock}
            icon={ShoppingCartIcon}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount}
            icon={WarningIcon}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inventory Value"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={TrendingUpIcon}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Add Product"
            description="Add new item to inventory"
            icon={AddIcon}
            onClick={() => navigate('/addItem')}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="View Stock"
            description="Check inventory status"
            icon={InventoryIcon}
            onClick={() => navigate('/showStocks')}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Create Bill"
            description="Generate invoice"
            icon={ReceiptIcon}
            onClick={() => navigate('/showBill')}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="View Reports"
            description="Check revenue & analytics"
            icon={LeaderboardIcon}
            onClick={() => navigate('/showReveneu')}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon sx={{ color: '#f57c00' }} />
            Low Stock Alert
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    Current Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8f9ff',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={product.stock}
                        sx={{
                          backgroundColor: '#ffebee',
                          color: '#f57c00',
                          fontWeight: 'bold',
                          border: '1px solid #f57c00',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">₹{product.price}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          textTransform: 'none',
                        }}
                        onClick={() => navigate('/updateItem')}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  )
}

export default HomePage