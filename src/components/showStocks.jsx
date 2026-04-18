import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  TextField,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../services/api'

function ShowStocks() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller)
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const fetchProducts = async (controller) => {
    try {
      setLoading(true)
      const res = await API.get('/products', { signal: controller.signal })
      
      // Only show error if response explicitly indicates failure
      if (res.data?.success === false) {
        console.error('API returned success=false for products')
        toast.error(res.data?.message || 'Failed to fetch products')
        return
      }
      
      // Handle array response (direct list of products)
      if (Array.isArray(res.data)) {
        setProducts(res.data)
        setFilteredProducts(res.data)
      }
      // Handle object response with data property
      else if (res.data?.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data)
        setFilteredProducts(res.data.data)
      }
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

  const getStockStatus = (stock) => {
    if (stock < 5) return { label: 'Critical', color: '#d32f2f' }
    if (stock < 10) return { label: 'Low', color: '#f57c00' }
    if (stock < 20) return { label: 'Medium', color: '#fbc02d' }
    return { label: 'Healthy', color: '#388e3c' }
  }

  const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock || 0), 0)
  const totalStock = filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Inventory Stock
        </Typography>
        <Typography variant="body2" color="textSecondary">
          View and manage product inventory levels
        </Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Paper
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Stock
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {totalStock} units
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#fff',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Inventory Value
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            ₹{totalValue.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Search Bar */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: '#f8f9ff',
          borderLeft: '4px solid #667eea'
        }}
      >
        <SearchIcon sx={{ color: '#667eea' }} />
        <TextField
          fullWidth
          placeholder="Search by product name or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ ml: 1 }}
        />
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9ff' }}>
          <Typography variant="body1" color="textSecondary">
            {searchTerm ? 'No products found matching your search' : 'No products available'}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Barcode</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">
                  Stock
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="center">
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">
                  Value
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock)
                return (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8f9ff',
                      },
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {product.barcode}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`₹${product.price}`}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {product.stock}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        sx={{
                          backgroundColor: status.color + '20',
                          color: status.color,
                          fontWeight: 'bold',
                          border: `1px solid ${status.color}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 'bold', color: '#667eea' }}>
                        ₹{(product.price * product.stock).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/updateItem/${product._id}`)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default ShowStocks