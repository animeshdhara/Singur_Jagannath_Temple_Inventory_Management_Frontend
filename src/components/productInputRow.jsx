import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';

const ProductInputRow = ({index, uploadedProducts, onAdd, onEdit }) => {
    const barcodeRef = useRef();
    const productRef = useRef();
    const priceRef = useRef();
    const [disableAddButton, setDisableAddButton] = useState(false);
    const [editButtonClicked, setEditButtonClicked] = useState(false);


    const handleAdd = () => {
        const barcode = barcodeRef.current.value;
        const price = priceRef.current.value;
        const name = productRef.current.dataset.productname || '';

        if (!barcode) {
            toast.error("Please enter barcode!");
            return;
        }
        if (barcode.length < 12) {
            toast.error("Barcode too short. Minimum 12 characters required.");
            return;
        }

        if (!name || !price) {
            toast.error("Please select an item!");
            return;
        }

        if (editButtonClicked) {
            setEditButtonClicked(false);
            onEdit(index, { barcode, name, price });
        }
        else {
            onAdd(index, { barcode, name, price });
        }

        setDisableAddButton(!disableAddButton);
    };

    return (
        <div className="mb-4 flex gap-3 items-center">
            <input
                disabled={disableAddButton}
                ref={barcodeRef}
                placeholder="Barcode"
                className="w-2/6 border mb-2 rounded p-2"
                maxLength={20}
                minLength={12}
            />

            <Autocomplete
                disabled={disableAddButton}
                options={uploadedProducts}
                getOptionLabel={(option) => option.name}
                onChange={(e, newValue) => {
                    if (newValue) {
                        productRef.current.value = newValue.name;
                        productRef.current.dataset.productname = newValue.name;
                        priceRef.current.value = newValue.price;
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Product"
                        variant="outlined"
                        size="small"
                        inputRef={productRef}
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
                ref={priceRef}
                placeholder="Price"
                className="w-1/6 border mb-2 rounded p-2"
                type="number"
                readOnly
            />

            <Button

                disabled={disableAddButton}
                variant='contained'
                color='success'
                onClick={handleAdd}
            >
                <AddIcon />
            </Button>
            {
                disableAddButton && <Button
                    color='info'
                    variant='contained'
                    onClick={() => { setDisableAddButton(!disableAddButton); setEditButtonClicked(!editButtonClicked) }}><ModeEditIcon /></Button>
            }
        </div>
    );
};

export default ProductInputRow;