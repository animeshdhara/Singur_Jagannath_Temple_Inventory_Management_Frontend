import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { Autocomplete, TextField, Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const GenerateBarcode = () => {
  const barcodeRef = useRef();
  const [labelsPerRow, setLabelsPerRow] = useState(3);// default value for 3 labels.
  const [products, setProducts] = useState([
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
  ]);
  const barcodeLength = 12; // 12 digit barcode.
  const [barcodes, setBarcodes] = useState([]);

  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(25);
  const [barcodeFontSize, setBarcodeFontSize] = useState(10);// for 3 labels

  const handleLabelChange = (e) => {
    const count = parseInt(e.target.value);
    setLabelsPerRow(count);
    setProducts(Array.from({ length: count }, () => ({
      barcode: '',
      name: '',
      price: '',
    })));

    setWidth(width === 1 ? 1.5 : 1);
    setHeight(height === 25 ? 30 : 25);
    setBarcodeFontSize(barcodeFontSize === 10 ? 12 : 10);
    setBarcodes([]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
    const newBaarcodes = [...barcodes];
    if (field === 'barcode' && value.length === barcodeLength) {
      newBaarcodes.push(value);
      setBarcodes(newBaarcodes);
    }
  };

  const uploadedProducts = [{ name: 'rice', price: '40' }, { name: 'dal', price: '20' }];
  const setSelectedProduct = (index, value) => {
    console.log('selected product', value);

    const updated = [...products];
    updated[index]['name'] = value.name;
    updated[index]['price'] = value.price;

    console.log('new product list:', updated);

    setProducts(updated);

  }

  const handleBarcodePrint = () => {
    console.log('printing barcode');
    window.print();
  }

  return (
    <div>
      <div className="p-4">


        <div className="w-full flex flex-col items-center h-32 border rounded-md">
          {/* <h2 className="text-lg font-bold font-serif mb-4 text-center">Barcode Preview</h2> */}
          <div className='print-section w-[100mm] bg-gray-200 flex flex-nowrap justify-evenly items-center mb-2 print:static print:mx-auto print:bg-white 
                print:flex print:flex-col print:items-center print:justify-center' id='printable-area'>
            {barcodes.map((code, index) => (
              <Barcode
                value={code}
                width={width}
                height={height}
                fontSize={barcodeFontSize}
                key={index}
              />
            ))}
          </div>
        </div>

        <h2 className="text-lg font-bold font-serif mb-4 text-center">Barcode Preview</h2>

        <div className="w-2/3">
          <div className="mb-4">
            <label className="mr-2 font-serif font-bold">Labels per Row:</label>
            <select
              value={labelsPerRow}
              onChange={handleLabelChange}
              className="border px-3 py-1 rounded cursor-pointer bg-gray-200"
            >
              <option value={2}>2 Labels</option>
              <option value={3}>3 Labels</option>
            </select>
          </div>

          <div className='flex flex-col '>
            {products.map((item, idx) => (
              <div
                key={idx}
                className="mb-4 flex gap-3"
              >
                <p className="font-semibold mb-2 w-1/6 pt-2">Product {idx + 1}</p>
                <input
                  placeholder="Barcode"
                  value={item.barcode}
                  onChange={(e) => handleInputChange(idx, 'barcode', e.target.value)}
                  className="w-2/6 border mb-2 rounded p-2"
                  maxLength={barcodeLength}
                />
                <Autocomplete
                  options={uploadedProducts}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, newValue) => setSelectedProduct(idx, newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                          width: '200px'
                        },
                      }}
                    />
                  )}
                />
                <input
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleInputChange(idx, 'price', e.target.value)}
                  className="w-1/6 border mb-2 rounded p-2"
                  type="number"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>



      </div>
      <div className='text-center'>

        <Button variant='contained' color='success' onClick={handleBarcodePrint}>
          <PrintIcon className='mr-1' /> Print Barcode
        </Button>

      </div>
    </div>
  );
};

export default GenerateBarcode;

