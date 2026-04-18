import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { toast } from 'react-toastify'
import API from '../services/api'

function ShowReveneu() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller)
    return () => controller.abort()
  }, [])

  const fetchProducts = async (controller) => {
    try {
      setLoading(true)
      const res = await API.get('/products', { signal: controller.signal })
      
      // Check if response explicitly indicates failure
      if (res.data?.success === false) {
        console.error('API returned success=false for products')
        toast.error(res.data?.message || 'Failed to fetch products')
        return
      }
      
      // Handle both array and object response formats
      const products = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      setProducts(products)
    } catch (error) {
      if (
        error.name === 'AbortError' ||
        error.name === 'CanceledError' ||
        error.code === 'ECONNABORTED' ||
        error.message === 'canceled'
      ) return

      console.error('Fetch products error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch products')

    } finally {
      setLoading(false)
    }
  }

  const topProducts = [...products]
    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
    .slice(0, 5)

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const avgPricePerItem = totalProducts > 0 ? (totalInventoryValue / totalStock) : 0

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Icon sx={{ fontSize: 40, color, opacity: 0.2 }} />
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TrendingUpIcon /> Revenue & Reports
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Inventory analytics and insights
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssignmentIcon}
            title="Total Inventory Value"
            value={`₹${totalInventoryValue.toLocaleString()}`}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={InventoryIcon}
            title="Total Products"
            value={totalProducts}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ShoppingCartIcon}
            title="Total Stock Units"
            value={totalStock}
            color="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            title="Avg Price per Unit"
            value={`₹${avgPricePerItem.toFixed(2)}`}
            color="#7b1fa2"
          />
        </Grid>
      </Grid>

      {/* Top Products */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Top 5 Products by Value
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">Total Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="center">Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts.map((product, index) => {
              const productValue = product.price * product.stock
              const percentage = (productValue / totalInventoryValue) * 100
              return (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={`#${index + 1}`} size="small" />
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Chip label={product.stock} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    ₹{productValue.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: '40px', textAlign: 'right', fontWeight: 'bold' }}>
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Box */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Total Products in Catalog:</strong> {totalProducts}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Total Units in Stock:</strong> {totalStock}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Total Inventory Value:</strong> ₹{totalInventoryValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Average Price per Unit:</strong> ₹{avgPricePerItem.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ShowReveneu