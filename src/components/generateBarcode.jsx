import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { Button, Box, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ProductInputRow from './productInputRow';

const GenerateBarcode = () => {

  const [uploadedProducts, setUploadedProducts] = useState([
    { name: 'Bhagabad Gita', price: '250' },
    { name: 'Japa Mala', price: '60' },
    { name: 'Dhoti', price: '500' }
  ]);

  const [labelsPerRow, setLabelsPerRow] = useState(3);

  const [products, setProducts] = useState([
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
  ]);

  const [barcodes, setBarcodes] = useState([]);

  const [width, setWidth] = useState(0.8);
  const [height, setHeight] = useState(25);
  const [barcodeFontSize, setBarcodeFontSize] = useState(10);


  const handleLabelChange = (e) => {

    const count = e.target.value;

    setLabelsPerRow(count);

    setProducts(
      Array.from({ length: count }, () => ({
        barcode: '',
        name: '',
        price: ''
      }))
    );

    setWidth(count === 2 ? 1.5 : 0.8);
    setHeight(count === 2 ? 30 : 25);
    setBarcodeFontSize(count === 2 ? 12 : 10);

    setBarcodes([]);
  };


  const handleAddProduct = (idx, product) => {

    const updatedProducts = [...products];
    updatedProducts[idx] = product;
    setProducts(updatedProducts);

    const updatedBarcodes = [...barcodes];
    updatedBarcodes[idx] = product.barcode;
    setBarcodes(updatedBarcodes);
  };


  const handleEditProduct = (idx, product) => {

    const updatedProducts = [...products];
    updatedProducts[idx] = product;
    setProducts(updatedProducts);

    const updatedBarcodes = [...barcodes];
    updatedBarcodes[idx] = product.barcode;
    setBarcodes(updatedBarcodes);
  };


  const handleBarcodePrint = () => {
    window.print();
  };


  return (
    <Box sx={{ p: 3 }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Generate Barcode Labels
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create and print barcode labels for your products
        </Typography>
      </Box>

      {/* Barcode Preview */}
      <Card sx={{ mb: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Barcode Preview
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#f8f9ff',
              border: '2px dashed #667eea',
              borderRadius: 2,
              minHeight: '200px',
              alignItems: 'center'
            }}
          >

            <Box
              className="print-section"
              sx={{
                width: '100mm',
                display: 'grid',
                gridTemplateColumns: `repeat(${labelsPerRow}, 1fr)`,
                gap: 2,
                alignItems: 'center'
              }}
              id="printable-area"
            >

              {barcodes.map((code, index) => (
                code && (
                  <Box
                    key={index}
                    sx={{
                      textAlign: 'center',
                      p: 1,
                      backgroundColor: '#fff',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Barcode
                      value={code}
                      width={width}
                      height={height}
                      fontSize={barcodeFontSize}
                    />
                  </Box>
                )
              ))}

            </Box>

          </Paper>

          {barcodes.filter(Boolean).length === 0 && (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 3 }}>
              Add products to generate barcode preview
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Label Selector */}
      <Card sx={{ mb: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Labels per Row</InputLabel>
            <Select
              value={labelsPerRow}
              onChange={handleLabelChange}
              label="Labels per Row"
            >
              <MenuItem value={2}>2 Labels per Row</MenuItem>
              <MenuItem value={3}>3 Labels per Row</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
            Selected: {labelsPerRow} labels per row
          </Typography>
        </CardContent>
      </Card>

      {/* Product Inputs */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Add Products
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
        {products.map((item, idx) => (
          <Box key={idx}>
            <ProductInputRow
              index={idx}
              uploadedProducts={uploadedProducts}
              onAdd={handleAddProduct}
              onEdit={handleEditProduct}
            />
          </Box>
        ))}
      </Box>

      {/* Print Button */}
      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          onClick={handleBarcodePrint}
          disabled={barcodes.filter(Boolean).length === 0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: '50px',
            paddingX: 4,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Print Barcode Labels
        </Button>
      </Box>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .print-section {
            width: 100% !important;
          }
        }
      `}</style>

    </Box>
  );
};

export default GenerateBarcode;