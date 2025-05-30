import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Container,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useCategory } from '../../context/CategoryContext';
import { useAuth } from '../../context/AuthContext';
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
    '& .product-image': {
      transform: 'scale(1.05)',
    },
    '& .add-to-cart-btn': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

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
  width: '100%',
  marginTop: '12px',
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease-in-out',
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;

  const { selectedCategory, selectedSubcategory } = useCategory();
  const { Authorization } = useAuth();

  // API Base URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (selectedCategory && Authorization) {
      fetchProducts();
    }
  }, [selectedCategory, selectedSubcategory, Authorization]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      if (selectedSubcategory) {
        await fetchProductsBySubcategory();
      } else {
        await fetchProductsByCategory();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async () => {
    try {
      // Get all categories first
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { 'Authorization': Authorization }
      });

      if (!categoriesResponse.data.success) {
        throw new Error('Failed to fetch categories');
      }

      const categories = categoriesResponse.data.data;
      // const category = categories.find(cat => 
      //   cat.name.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      // );
      // Safely extract the category name
      const selectedCategoryName =
        typeof selectedCategory === 'string'
          ? selectedCategory
          : selectedCategory?.name ?? '';

      // Compare with normalized names
      const category = categories.find(cat =>
        cat.name.toLowerCase().trim() === selectedCategoryName.toLowerCase().trim()
      );


      if (!category) {
        throw new Error(`Category "${selectedCategory}" not found`);
      }

      // Fetch products by category ID
      const productsResponse = await axios.get(`${API_BASE_URL}/products/category/${category.category_id}`, {
        headers: { 'Authorization': Authorization }
      });

      if (productsResponse.data.success) {
        setProducts(productsResponse.data.data || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      throw err;
    }
  };

  const fetchProductsBySubcategory = async () => {
    try {
      // Get categories with subcategories
      const categoriesSubcategoriesResponse = await axios.get(`${API_BASE_URL}/categories-subcategories`, {
        headers: { 'Authorization': Authorization }
      });

      if (!categoriesSubcategoriesResponse.data.success) {
        throw new Error('Failed to fetch categories and subcategories');
      }

      const data = categoriesSubcategoriesResponse.data.data;
      let subcategoryId = null;

      // Find the subcategory ID
      for (const category of data) {
        // if (category.name.toLowerCase().trim() === selectedCategory.toLowerCase().trim()) {
        const selectedCategoryName =
          typeof selectedCategory === 'string'
            ? selectedCategory
            : selectedCategory?.name ?? '';

        if (category.name.toLowerCase().trim() === selectedCategoryName.toLowerCase().trim()) {

          const subcategory = category.subcategories?.find(sub =>
            sub.name.toLowerCase().trim() === selectedSubcategory.toLowerCase().trim()
          );

          if (subcategory) {
            subcategoryId = subcategory.subcategory_id;
            break;
          }
        }
      }

      if (!subcategoryId) {
        throw new Error(`Subcategory "${selectedSubcategory}" not found in category "${selectedCategory}"`);
      }

      // Fetch products by subcategory ID
      const productsResponse = await axios.get(`${API_BASE_URL}/products/subcategory/${subcategoryId}`, {
        headers: { 'Authorization': Authorization }
      });

      if (productsResponse.data.success) {
        setProducts(productsResponse.data.data || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      throw err;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    // TODO: Implement actual cart functionality
    alert(`Added ${product.name} to cart!`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="error" mb={2}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={fetchProducts}
              sx={{ backgroundColor: '#00B2C9', '&:hover': { backgroundColor: '#009BB0' } }}
            >
              Retry
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // No products found
  if (!loading && products.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="text.secondary">
              No products found for this {selectedSubcategory ? 'subcategory' : 'category'}.
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <img src={boxes} style={{ width: "30px" }} alt="Products" />
          {totalPages > 1 && (
            <CustomPagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          )}
        </Box>

        {/* Product Count */}
        <Box textAlign="center" mb={4}>
          <Typography variant="body2" color="text.secondary">
            {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length} products
          </Typography>
        </Box>

        {/* Product Grid */}
        <Box display="flex" flexWrap="wrap" mb={4}>
          {currentProducts.map((product) => (
            <CustomGridItem key={product.product_id}>
              <StyledCard>
                <Box position="relative">
                  <ProductImage
                    className="product-image"
                    component="img"
                    image={product.image || 'https://via.placeholder.com/300x220?text=Product+Image'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x220?text=Product+Image';
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                      MOQ: {product.moq?.toLocaleString() || 'N/A'} units
                    </Typography>
                  </Box>

                  <AddToCartButton
                    className="add-to-cart-btn"
                    variant="contained"
                    onClick={() => handleAddToCart(product)}
                    size="large"
                  >
                    Add to Cart
                  </AddToCartButton>
                </CardContent>
              </StyledCard>
            </CustomGridItem>
          ))}
        </Box>

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CustomPagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ProductTable;