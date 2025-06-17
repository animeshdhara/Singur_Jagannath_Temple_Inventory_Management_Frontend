import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ProductInputRow from './productInputRow';

const GenerateBarcode = () => {
  const [uploadedProducts, setUploadedProducts] = useState([{ name: 'Bhagabad Gita', price: '250' }, { name: 'Japa Mala', price: '60' }, { name: 'Dhoti', price: '500' }]);


  const [labelsPerRow, setLabelsPerRow] = useState(3);// default value for 3 labels.
  const [products, setProducts] = useState([
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
    { barcode: '', name: '', price: '' },
  ]);
  const [barcodes, setBarcodes] = useState([]);

  const [width, setWidth] = useState(0.8);
  const [height, setHeight] = useState(25);
  const [barcodeFontSize, setBarcodeFontSize] = useState(10);// for 3 labels
  const [labelChange, setLabelChange] = useState(false);



  const handleLabelChange = (e) => {
    setLabelChange(!labelChange);

    const count = parseInt(e.target.value);
    setLabelsPerRow(count);
    setProducts(Array.from({
      length: count,
    }, () => ({
      barcode: '',
      name: '',
      price: '',
    })))
    setWidth(width === 0.8 ? 1.5 : 0.8);
    setHeight(height === 25 ? 30 : 25);
    setBarcodeFontSize(barcodeFontSize === 10 ? 12 : 10);
    setBarcodes([]);
  };



  const handleAddProduct = (idx, product) => {
    console.log("selected product: ", product);
    //Updating products 
    const updatedProduct = [...products];
    updatedProduct[idx] = product;
    setProducts(updatedProduct);

    //Updating the barcodes 
    const updatedBarcodes = [...barcodes];
    updatedBarcodes.push(product.barcode);
    setBarcodes(updatedBarcodes);

  };

  const handleEditProduct = (idx, product) => {
    const updated = [...products];
    updated[idx] = product;
    setProducts(updated);

    const updatedBarcode = [...barcodes];
    updatedBarcode[idx] = product.barcode;
    setBarcodes(updatedBarcode);


    setTimeout(() => {
      console.log("product : ",products);
      console.log("barcode : ",barcodes);
      
    }, 2000);
  }


  const handleBarcodePrint = () => {
    console.log('printing barcode');
    window.print();
  }

  return (
    <div>
      <div className="p-4">

        <div className="w-full flex flex-col items-center h-32 border rounded-md">
          <div className='print-section w-[100mm] bg-gray-400 flex flex-nowrap justify-evenly items-center mb-2 print:static print:mx-auto print:bg-white 
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

          <div className='flex flex-col'>
            {products.map((item, idx) => (
              <div key={idx} className="mb-4 flex gap-3 items-center">
                <ProductInputRow index={idx} uploadedProducts={uploadedProducts} onAdd={handleAddProduct} onEdit={handleEditProduct} />
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

