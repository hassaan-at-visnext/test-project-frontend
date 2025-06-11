import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useAuth, authAxios } from '../../context/AuthContext';

const StyledButton = styled(Button)({
  backgroundColor: '#00B2C9',
  color: 'white',
  '&:hover': {
    backgroundColor: '#009BB0',
  },
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
});

const BackButton = styled(IconButton)({
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginBottom: '20px',
});

const ProductImage = styled('img')({
  width: '100%',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
});

const InfoCard = styled(Card)({
  height: '100%',
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const Product = ({ productId, onBackToProducts }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken, isAuthenticated } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (productId && isAuthenticated) {
      fetchProductDetail();
    }
  }, [productId, isAuthenticated]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAxios.get(`${API_BASE_URL}/products/${productId}`);

      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.response?.data?.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  // const handleAddToCart = async () => {
  //   try {
  //     // TODO: Replace with actual cart endpoint
  //     const response = await authAxios.post(`${API_BASE_URL}/cart/add`, {
  //       productId: product.id,
  //       quantity: 1
  //     });
      
  //     if (response.data.success) {
  //       alert(`Added ${product.name} to cart!`);
  //     } else {
  //       alert('Failed to add item to cart');
  //     }
  //   } catch (err) {
  //     console.error('Error adding to cart:', err);
  //     alert('Error adding item to cart');
  //   }
  // };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} sx={{ color: '#00B2C9' }} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <BackButton onClick={onBackToProducts}>
            <ArrowBackIcon />
          </BackButton>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="error" mb={2}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={fetchProductDetail}
              sx={{ backgroundColor: '#00B2C9', '&:hover': { backgroundColor: '#009BB0' } }}
            >
              Retry
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // No product found
  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <BackButton onClick={onBackToProducts}>
            <ArrowBackIcon />
          </BackButton>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="text.secondary">
              Product not found.
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        {/* Back Button */}
        <BackButton onClick={onBackToProducts}>
          <ArrowBackIcon />
        </BackButton>

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <ProductImage
              src={product.image || 'https://via.placeholder.com/400x400?text=Product+Image'}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Stock Status */}
              <Box mb={2}>
                <Chip
                  icon={<InventoryIcon />}
                  label={product.stock_availability_in_us ? 'In Stock - USA' : 'Available'}
                  color={product.stock_availability_in_us ? 'success' : 'default'}
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Product Name */}
              <Typography variant="h4" component="h1" fontWeight="700" mb={2}>
                {product.name}
              </Typography>

              {/* Price */}
              <Typography variant="h3" component="p" fontWeight="bold" color="#00B2C9" mb={2}>
                ${product.price}<span style={{ fontSize: '1.2rem', fontWeight: 400 }}>/Piece</span>
              </Typography>

              {/* MOQ */}
              <Typography variant="h6" color="text.secondary" mb={3}>
                Minimum Order Quantity: {product.moq?.toLocaleString() || 'N/A'} units
              </Typography>

              {/* Manufacturer Location */}
              {product.manufacturer_location && (
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon sx={{ color: '#666', mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Manufactured in: {product.manufacturer_location}
                  </Typography>
                </Box>
              )}

              {/* Add to Cart Button */}
              <Box mb={4}>
                <StyledButton
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  // onClick={handleAddToCart}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Add to Cart
                </StyledButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Product Description - Full width below image and details */}
        {product.description && (
          <Box mt={4}>
            <InfoCard>
              <CardContent>
                <Typography variant="h6" fontWeight="600" mb={2}>
                  Product Description
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
              </CardContent>
            </InfoCard>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Product;