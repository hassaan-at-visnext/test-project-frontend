import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Pagination,
  Container,
  Paper,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import boxes from "../../assets/icons8-boxes-90.png";

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    '& .hover-overlay': {
      opacity: 1,
    },
    '& .product-image': {
      transform: 'scale(1.05)',
    }
  }
}));

const HoverOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 2,
});

const ProductImage = styled(CardMedia)({
  transition: 'transform 0.3s ease-in-out',
  width: '100%',
  height: '220px',
  objectFit: 'cover',
});

const AddToCartButton = styled(Button)({
  backgroundColor: '#00B2C9',
  color: 'white',
  '&:hover': {
    backgroundColor: '#009BB0',
  },
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 600,
});

const CustomPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    '&.Mui-selected': {
      backgroundColor: '#00B2C9',
      color: 'white',
      '&:hover': {
        backgroundColor: '#009BB0',
      }
    }
  }
});

// Custom Grid Item with exact 33.33% width
const CustomGridItem = styled(Box)({
  width: '33.333333%',
  padding: '12px',
  boxSizing: 'border-box',
  '@media (max-width: 900px)': {
    width: '50%',
  },
  '@media (max-width: 600px)': {
    width: '100%',
  },
});

const ProductTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3x4 grid

  // Expanded sample data with more products
  const products = [
    {
      product_id: 3,
      name: "KN95 Protective Mask",
      price: "1.20",
      moq: 6000,
      stock: 9500,
      availability: true,
      subcategory_id: 42,
      description: "High-efficiency KN95 mask with 5-layer protection, soft ear loops, and adjustable nose bridge.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/524988735/Images/1617516013158993854.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 4,
      name: "Surgical Gown",
      price: "2.80",
      moq: 3000,
      stock: 5400,
      availability: true,
      subcategory_id: 43,
      description: "Disposable surgical gown made of SMS fabric, fluid-resistant, with knit cuffs and belt.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://www.penninehealthcare.co.uk/wp-content/uploads/2021/11/AE12772-AE12777-AE12778-AE12779-AE12780-AE12781_1-1024x1024.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 5,
      name: "Face Shield",
      price: "0.80",
      moq: 7000,
      stock: 12000,
      availability: true,
      subcategory_id: 43,
      description: "Anti-fog face shield with elastic band and foam headband for full facial protection.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/1594109791/Images/16103431541142702878.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 2,
      name: "Warning Clothing",
      price: "1.90",
      moq: 4000,
      stock: 8760,
      availability: true,
      subcategory_id: 43,
      description: "Disposable non-woven membrane waterproof shoe cover",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/875911896/Images/1600931702339907497.jpg",
      created_at: "2025-05-26T07:09:15.715Z",
      updated_at: "2025-05-26T07:09:15.715Z"
    },
    {
      product_id: 6,
      name: "N95 Respirator",
      price: "1.50",
      moq: 5000,
      stock: 10051,
      availability: true,
      subcategory_id: 42,
      description: "50 Kimtech N95 Pouch Respirators made by Kimberly-Clark, Universal Size",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/765516787/Images/16100801891628794223.jpg",
      created_at: "2025-05-26T06:59:56.821Z",
      updated_at: "2025-05-26T06:59:56.821Z"
    },
    {
      product_id: 7,
      name: "KN95 Protective Mask Pro",
      price: "1.20",
      moq: 6000,
      stock: 9500,
      availability: true,
      subcategory_id: 42,
      description: "High-efficiency KN95 mask with 5-layer protection, soft ear loops, and adjustable nose bridge.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/524988735/Images/1617516013158993854.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 8,
      name: "Premium Surgical Gown",
      price: "2.80",
      moq: 3000,
      stock: 5400,
      availability: true,
      subcategory_id: 43,
      description: "Disposable surgical gown made of SMS fabric, fluid-resistant, with knit cuffs and belt.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://www.penninehealthcare.co.uk/wp-content/uploads/2021/11/AE12772-AE12777-AE12778-AE12779-AE12780-AE12781_1-1024x1024.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 9,
      name: "Anti-Fog Face Shield",
      price: "0.80",
      moq: 7000,
      stock: 12000,
      availability: true,
      subcategory_id: 43,
      description: "Anti-fog face shield with elastic band and foam headband for full facial protection.",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/1594109791/Images/16103431541142702878.jpg",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 12,
      name: "Safety Shoe Cover",
      price: "1.90",
      moq: 4000,
      stock: 8760,
      availability: true,
      subcategory_id: 43,
      description: "Disposable non-woven membrane waterproof shoe cover",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/875911896/Images/1600931702339907497.jpg",
      created_at: "2025-05-26T07:09:15.715Z",
      updated_at: "2025-05-26T07:09:15.715Z"
    },
    {
      product_id: 11,
      name: "Professional N95",
      price: "1.50",
      moq: 5000,
      stock: 10051,
      availability: true,
      subcategory_id: 42,
      description: "50 Kimtech N95 Pouch Respirators made by Kimberly-Clark, Universal Size",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://tbh-production.s3.ap-southeast-1.amazonaws.com/Product/765516787/Images/16100801891628794223.jpg",
      created_at: "2025-05-26T06:59:56.821Z",
      updated_at: "2025-05-26T06:59:56.821Z"
    },
    {
      product_id: 13,
      name: "Medical Gloves",
      price: "0.15",
      moq: 10000,
      stock: 50000,
      availability: true,
      subcategory_id: 44,
      description: "Disposable nitrile medical gloves, powder-free, textured fingertips",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 14,
      name: "Isolation Gown",
      price: "3.50",
      moq: 2000,
      stock: 3200,
      availability: true,
      subcategory_id: 43,
      description: "Level 3 isolation gown with full back coverage and knit cuffs",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 15,
      name: "Hand Sanitizer",
      price: "2.25",
      moq: 1000,
      stock: 15000,
      availability: true,
      subcategory_id: 45,
      description: "70% Alcohol hand sanitizer gel, 500ml bottle with pump dispenser",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 16,
      name: "Safety Goggles",
      price: "4.50",
      moq: 1500,
      stock: 2800,
      availability: true,
      subcategory_id: 43,
      description: "Anti-fog safety goggles with elastic strap and ventilation",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 17,
      name: "Disposable Caps",
      price: "0.25",
      moq: 8000,
      stock: 25000,
      availability: true,
      subcategory_id: 43,
      description: "Non-woven disposable bouffant caps, lightweight and breathable",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 18,
      name: "Thermometer Digital",
      price: "12.99",
      moq: 500,
      stock: 1200,
      availability: true,
      subcategory_id: 46,
      description: "Non-contact infrared thermometer with LCD display",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 19,
      name: "Medical Tape",
      price: "1.75",
      moq: 2000,
      stock: 8500,
      availability: true,
      subcategory_id: 47,
      description: "Hypoallergenic medical tape, 1 inch width, strong adhesive",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    },
    {
      product_id: 20,
      name: "Pulse Oximeter",
      price: "25.00",
      moq: 200,
      stock: 750,
      availability: true,
      subcategory_id: 46,
      description: "Fingertip pulse oximeter with OLED display, measures SpO2 and pulse rate",
      product_certifications: ["FDA", "ASTM", "CE", "SGS"],
      supplier_certifications: ["DUNS", "DRS", "GMP", "ISO 9001"],
      manufacturer_location: "United States",
      stock_availability_in_us: true,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=220&fit=crop",
      created_at: "2025-05-26T07:18:44.052Z",
      updated_at: "2025-05-26T07:18:44.052Z"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        {/* Header with Title and Pagination */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <img src={boxes} style={{ width: "30px"}}  />          
          {/* Pagination - Top Right */}
          <CustomPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>

        {/* Product Count Info */}
        <Box textAlign="center" mb={4}>
          <Typography variant="body2" color="text.secondary">
            {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
          </Typography>
        </Box>
        
        {/* Product Grid - Custom Layout for exact 33.33% width */}
        <Box display="flex" flexWrap="wrap" mb={4}>
          {currentProducts.map((product) => (
            <CustomGridItem key={product.product_id}>
              <StyledCard>
                {/* Product Image */}
                <Box position="relative">
                  <ProductImage
                    className="product-image"
                    component="img"
                    image={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x220?text=Product+Image';
                    }}
                  />
                  
                  {/* Hover Overlay with Add to Cart Button */}
                  <HoverOverlay className="hover-overlay">
                    <AddToCartButton
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                      size="large"
                    >
                      Add to Cart
                    </AddToCartButton>
                  </HoverOverlay>
                </Box>
                
                {/* Product Details */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Stock Status */}
                  <Box mb={1}>
                    <Chip
                      label={product.stock_availability_in_us ? 'In Stock' : 'Stock in USA'}
                      size="small"
                      sx={{ 
                        backgroundColor: 'transparent',
                        color: 'black',
                        fontWeight: 500,
                        border: 'none',
                        pl: 0
                      }}
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h3" fontWeight="600" mb={2} sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </Typography>
                  
                  <Box flexGrow={1}>
                    <Typography variant="h6" component="p" fontWeight="bold" color="black" mb={1}>
                      ${product.price}/Piece
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      MOQ: {product.moq.toLocaleString()} units
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </CustomGridItem>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductTable;