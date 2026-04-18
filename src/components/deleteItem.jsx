import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { toast } from 'react-toastify'
import API from '../services/api'

function DeleteItem() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch products on component mount
  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller)
    return () => controller.abort()
  }, [])

  // Filter products when search term changes
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
      setProducts(res.data)
      setFilteredProducts(res.data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error(error.response?.data?.message || 'Failed to fetch products')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (product) => {
    setSelectedProduct(product)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/products/${selectedProduct._id}`)
      toast.success('Product deleted successfully')
      setOpenDialog(false)
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting product')
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedProduct(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Delete Products
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Search and delete products from your inventory
        </Typography>
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
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow
                  key={product._id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f8f9ff',
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'monospace' }}>{product.barcode}</TableCell>
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
                  <TableCell align="right">
                    <Chip
                      label={product.stock}
                      variant={product.stock < 10 ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: product.stock < 10 ? '#ffebee' : '#f0f0f0',
                        color: product.stock < 10 ? '#d32f2f' : '#333',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(product)}
                      sx={{
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(211, 47, 47, 0.5)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DeleteItem