import React, { useState, useRef, useEffect } from 'react'
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
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PrintIcon from '@mui/icons-material/Print'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import HistoryIcon from '@mui/icons-material/History'
import { useReactToPrint } from 'react-to-print'
import API from '../services/api'
import { toast } from 'react-toastify'

function ShowBill() {
  const [billItems, setBillItems] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [products, setProducts] = useState([])
  const [openFinalBill, setOpenFinalBill] = useState(false)
  const [bills, setBills] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const barcodeInputRef = useRef(null)
  const printRef = useRef()

  // Fetch products on mount
  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products', { signal: controller.signal })
        
        // Check if response explicitly indicates failure
        if (res.data?.success === false) {
          toast.error(res.data?.message || 'Failed to load products')
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
      } 
    }
    const fetchBills = async () => {
      try {
        const res = await API.get('/bills')
        
        // Check if response explicitly indicates failure
        if (res.data?.success === false) {
          toast.error(res.data?.message || 'Failed to load bills')
          return
        }
        
        // Handle both array and object response formats
        const bills = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        setBills(bills)
      } catch (error) {
        // Check for various abort/cancel error types
        if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ECONNABORTED' || error.message === 'canceled') {
          return
        }
        console.error('Fetch bills error:', error)
        toast.error('Failed to load bills')
      }
    }
    fetchProducts()
    fetchBills()
    return () => controller.abort()
  }, [])

  // Auto-focus barcode input on component load and after adding item
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }, [billItems])

  const handleBarcodeSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setBarcodeInput(value)
  }

  const handleAddItemByBarcode = (e) => {
    if (e.key !== 'Enter' || !barcodeInput.trim()) return

    e.preventDefault()

    // Search product by barcode or name
    const product = products.find(p => 
      p._id === barcodeInput || 
      p.barcode === barcodeInput || 
      p.name.toLowerCase().includes(barcodeInput)
    )

    if (product) {
      // Check if item already exists in bill
      const existingItem = billItems.find(item => item._id === product._id)
      
      if (existingItem) {
        // Increment quantity if same product scanned again
        const updatedItems = billItems.map(item =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: item.price * (item.quantity + 1)
              }
            : item
        )
        setBillItems(updatedItems)
      } else {
        // Add new item
        const item = {
          _id: product._id,
          id: Date.now(),
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          quantity: 1,
          total: product.price
        }
        setBillItems([...billItems, item])
      }

      // Clear input and refocus for next scan
      setBarcodeInput('')
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus()
      }
      toast.success(`${product.name} added!`)
    } else {
      toast.error(`Product not found: ${barcodeInput}`)
      setBarcodeInput('')
    }
  }

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id)
      return
    }
    const updatedItems = billItems.map(item =>
      item._id === id
        ? {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity
          }
        : item
    )
    setBillItems(updatedItems)
  }

  const handleRemoveItem = (id) => {
    setBillItems(billItems.filter(item => item._id !== id))
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const handleClearBill = () => {
    setBillItems([])
    setBarcodeInput('')
    setCustomerName('')
    setCustomerPhone('')
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus()
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  })

  const handleFinalizeBill = () => {
    if (billItems.length === 0) {
      toast.error('Add items to generate bill')
      return
    }
    setOpenFinalBill(true)
  }

  const handleCreateBill = async () => {
    try {
      // Save bill to backend
      const billData = {
        customerName,
        customerPhone,
        items: billItems,
        subtotal,
        gst,
        total,
        date: new Date()
      }
      const billRes = await API.post('/bills', billData)
      
      // Check if bill creation failed
      if (billRes.data?.success === false) {
        toast.error(billRes.data?.message || 'Error creating bill')
        return
      }
      
      // Refresh bills list
      const billsRes = await API.get('/bills')
      
      // Check if fetch bills failed
      if (billsRes.data?.success === false) {
        toast.error(billsRes.data?.message || 'Error loading bills')
        return
      }
      
      // Handle both array and object response formats
      const bills = Array.isArray(billsRes.data) ? billsRes.data : (billsRes.data?.data || [])
      setBills(bills)
      
      setOpenFinalBill(false)
      handlePrint()
      
      // Reset bill
      setTimeout(() => {
        handleClearBill()
      }, 1000)
      
      toast.success('Bill created successfully!')
    } catch (error) {
      console.error('Create bill error:', error)
      toast.error(error.response?.data?.message || 'Error creating bill')
    }
  }

  const handleDeleteBill = async (billId) => {
    try {
      const response = await API.delete(`/bills/${billId}`)
      
      // Check if response explicitly indicates failure
      if (response.data?.success === false) {
        toast.error(response.data?.message || 'Error deleting bill')
        return
      }
      
      setBills(bills.filter(bill => bill._id !== billId))
      toast.success('Bill deleted successfully!')
    } catch (error) {
      console.error('Delete bill error:', error)
      toast.error(error.response?.data?.message || 'Error deleting bill')
    }
  }

  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0)
  const gst = subtotal * 0.18
  const total = subtotal + gst

  return (
    <Box sx={{ p: 3, maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ReceiptIcon /> Billing System
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create bills and manage billing history
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<ReceiptIcon />} label="Create Bill" />
          <Tab icon={<HistoryIcon />} label="Bill History" />
        </Tabs>
      </Box>

      {/* Create Bill Tab */}
      {tabValue === 0 && (
        <>
          <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
            {/* Left Column - Scanning & Items */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Barcode Scanner */}
          <Card sx={{ mb: 2, boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
                  🔍 Barcode/Product Name
                </Typography>
                <TextField
                  inputRef={barcodeInputRef}
                  fullWidth
                  placeholder="Scan barcode or type product name... Press ENTER"
                  value={barcodeInput}
                  onChange={handleBarcodeSearch}
                  onKeyDown={handleAddItemByBarcode}
                  autoComplete="off"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Chip
                  label={`Items: ${billItems.length}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  label={`Total: ₹${total.toFixed(2)}`}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Bill Items Table */}
          <Card sx={{ flex: 1, overflow: 'auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
            {billItems.length > 0 ? (
              <TableContainer>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Qty</TableCell>
                      <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billItems.map((item, index) => (
                      <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#f8f9ff' } }}>
                        <TableCell sx={{ fontWeight: '500' }}>
                          {item.name}
                          <Typography variant="caption" display="block" color="textSecondary">
                            {item.barcode}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 0)}
                            inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₹{item.total.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  👆 Scan a barcode or enter product name to start
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Right Column - Bill Preview */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Card ref={printRef} sx={{ flex: 1, overflow: 'auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Invoice Header */}
              <Box sx={{ mb: 3, textAlign: 'center', pb: 2, borderBottom: '2px solid #667eea' }}>
                <ReceiptIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea' }}>
                  INVOICE
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Singur Jagannath Temple
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                  {new Date().toLocaleString()}
                </Typography>
              </Box>

              {/* Customer Info Section */}
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px dashed #e0e0e0' }} className="no-print">
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Customer Details (Optional)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </Box>

              {billItems.length > 0 ? (
                <>
                  {/* Items Summary */}
                  <Box sx={{ mb: 2 }}>
                    {billItems.map((item) => (
                      <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, pb: 1, borderBottom: '1px solid #f0f0f0' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {item.quantity} × ₹{item.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₹{item.total.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Totals */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography>Subtotal</Typography>
                      <Typography sx={{ fontWeight: '600' }}>₹{subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>GST (18%)</Typography>
                      <Typography sx={{ fontWeight: '600', color: '#f57c00' }}>₹{gst.toFixed(2)}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff'
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        TOTAL
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ₹{total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 2, color: '#999' }}>
                    Thank you for your purchase!
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                  Add items to preview
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearBill}
          disabled={billItems.length === 0}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          Clear Bill
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleFinalizeBill}
          disabled={billItems.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            height: '45px',
            textTransform: 'none',
            fontWeight: 'bold',
            px: 4,
          }}
        >
          Create & Print Bill
        </Button>
      </Box>
        </>
      )}

      {/* Bill History Tab */}
      {tabValue === 1 && (
        <Card sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Bill History
            </Typography>
            {bills.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Items</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="right">Total</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill._id} hover>
                        <TableCell>
                          {new Date(bill.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {bill.customerName || 'N/A'}
                          {bill.customerPhone && (
                            <Typography variant="caption" display="block" color="textSecondary">
                              {bill.customerPhone}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{bill.items?.length || 0} items</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          ₹{bill.total?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteBill(bill._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No bills found
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Final Bill Dialog */}
      <Dialog open={openFinalBill} onClose={() => setOpenFinalBill(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Bill</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Items:</strong> {billItems.length}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>GST (18%):</strong> ₹{gst.toFixed(2)}
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea' }}>
                ₹{total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFinalBill(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBill}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Print & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </Box>
  )
}

export default ShowBill