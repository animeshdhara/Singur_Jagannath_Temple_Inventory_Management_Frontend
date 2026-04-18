import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import API from '../services/api'

function AddItemForm() {

  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    price: '',
    stock: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      await API.post("/products", formData)
      toast.success("Product Added Successfully")
      setFormData({
        barcode: '',
        name: '',
        price: '',
        stock: ''
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding product"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        padding: 2
      }}
    >
      <Card
        sx={{
          width: {
            xs: "100%",
            sm: "500px"
          },
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: '#fff'
          }}
        >
          <AddIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Add New Product
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Enter product details below
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  required
                  placeholder="Enter product barcode"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter product name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  name="price"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="stock"
                  type="number"
                  inputProps={{ step: "1", min: "0" }}
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: "50px",
                    mt: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <AddIcon />}
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </Button>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AddItemForm