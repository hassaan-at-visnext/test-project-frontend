import { useState, useEffect } from 'react';
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
import { useCategory } from '../../context/CategoryContext';
import { useAuth, authAxios } from '../../context/AuthContext';
import { useSearch } from "../../context/SearchContext";
import { useFilter } from '../../context/FilterContext';
import boxes from "../../assets/icons8-boxes-90.png";
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  cursor: 'pointer',
  boxShadow: 'none',
  border: 'none',
  '&:hover': {
    boxShadow: theme.shadows[8],
    '& .add-to-cart-btn': {
      opacity: 1,
    }
  }
}));

const ProductImage = styled(CardMedia)({
  width: '80%',
  height: '220px',
  objectFit: 'cover',
  margin: '0 auto'
});

const AddToCartButton = styled(Button)({
  backgroundColor: '#00B2C9',
  color: 'white',
  '&:hover': {
    backgroundColor: '#009BB0',
  },
  borderRadius: '5px',
  textTransform: 'none',
  fontWeight: 600,
  width: '100%',
  marginTop: '12px',
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.1s ease-in-out',
});

const CustomPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    '&.Mui-selected': {
      backgroundColor: '#F2F2F2',
      color: 'black',
      border: "1px solid darkgrey"
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

const ProductTable = ({ onProductClick }) => {
  const { searchTerm } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    page: 1,
    limit: 9
  });

  const { selectedCategory, selectedSubcategory, setNumberOfProducts } = useCategory();
  const { filters } = useFilter();

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Update number of products for context
  useEffect(() => {
    setNumberOfProducts(pagination.totalItems);
  }, [pagination.totalItems, setNumberOfProducts]);

  // Fetch products when category, subcategory, filters, or page changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory, selectedSubcategory, filters, searchTerm, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, searchTerm, selectedCategory, selectedSubcategory]);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    // Pagination
    params.append('page', currentPage.toString());
    params.append('limit', pagination.limit.toString());
    
    // Price range
    if (filters.minPrice > 0) {
      params.append('from', filters.minPrice.toString());
    }
    if (filters.maxPrice > 0) {
      params.append('to', filters.maxPrice.toString());
    }
    
    // MOQ
    if (filters.moq && filters.moq.toString().trim() !== '') {
      params.append('moq', filters.moq.toString());
    }
    
    // Product certifications
    if (filters.selectedCertifications && filters.selectedCertifications.length > 0) {
      params.append('product_certifications', filters.selectedCertifications.join(','));
    }
    
    // Supplier certifications
    if (filters.selectedSupplierCertifications && filters.selectedSupplierCertifications.length > 0) {
      params.append('supplier_certifications', filters.selectedSupplierCertifications.join(','));
    }
    
    // Manufacturer location
    if (filters.selectedManufacturerLocations && filters.selectedManufacturerLocations.length > 0) {
      params.append('manufacturer_location', filters.selectedManufacturerLocations.join(','));
    }
    
    // Stock in USA
    if (filters.stockInUSA) {
      params.append('stock_availability_in_us', 'true');
    }
    
    return params.toString();
  };

  // Apply search term filtering on client side (since it's not in API)
  const applySearchFilter = (productsData) => {
    if (!searchTerm.trim()) {
      return productsData;
    }
    
    return productsData.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const isAllCategoriesSelected = () => {
    if (!selectedCategory) return false;
    return selectedCategory.category_id === null && selectedCategory.name === "All Categories";
  };

  const fetchAllProducts = async () => {
    try {
      const queryParams = buildQueryParams();
      const response = await authAxios.get(`${API_BASE_URL}/products/all?${queryParams}`);

      if (response.data.success) {
        let productsData = response.data.data || [];
        
        // Apply search filter on client side
        if (searchTerm.trim()) {
          productsData = applySearchFilter(productsData);
        }
        
        setProducts(productsData);
        setPagination({
          totalPages: response.data.totalPages || 0,
          totalItems: response.data.totalItems || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 9
        });
      } else {
        setProducts([]);
        setPagination({ totalPages: 0, totalItems: 0, page: 1, limit: 9 });
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 409)) {
        return;
      }
      throw err;
    }
  };

  const fetchProductsByCategory = async () => {
    try {
      // Get all categories first
      const categoriesResponse = await authAxios.get(`${API_BASE_URL}/categories`);

      if (!categoriesResponse.data.success) {
        throw new Error('Failed to fetch categories');
      }

      const categories = categoriesResponse.data.data;
      const selectedCategoryName = typeof selectedCategory === 'string'
        ? selectedCategory
        : selectedCategory?.name ?? '';

      const category = categories.find(cat =>
        cat.name.toLowerCase().trim() === selectedCategoryName.toLowerCase().trim()
      );

      if (!category) {
        throw new Error(`Category "${selectedCategory}" not found`);
      }

      const queryParams = buildQueryParams();
      const response = await authAxios.get(`${API_BASE_URL}/products/category/${category.category_id}?${queryParams}`);

      if (response.data.success) {
        let productsData = response.data.data || [];
        
        // Apply search filter on client side
        if (searchTerm.trim()) {
          productsData = applySearchFilter(productsData);
        }
        
        setProducts(productsData);
        setPagination({
          totalPages: response.data.totalPages || 0,
          totalItems: response.data.totalItems || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 9
        });
      } else {
        setProducts([]);
        setPagination({ totalPages: 0, totalItems: 0, page: 1, limit: 9 });
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 409)) {
        return;
      }
      throw err;
    }
  };

  const fetchProductsBySubcategory = async () => {
    try {
      const subcategoryId = selectedSubcategory?.subcategory_id;

      if (!subcategoryId) {
        throw new Error('No subcategory selected or subcategory ID not found');
      }

      // Get child subcategories
      const childSubcategoriesResponse = await authAxios.get(`${API_BASE_URL}/subcategories/${subcategoryId}`);

      if (!childSubcategoriesResponse.data.success) {
        throw new Error('Failed to fetch child subcategories');
      }

      const childSubcategories = childSubcategoriesResponse.data.data || [];

      if (childSubcategories.length === 0) {
        setProducts([]);
        setPagination({ totalPages: 0, totalItems: 0, page: 1, limit: 9 });
        return;
      }

      let allProducts = [];
      let totalItems = 0;

      // Fetch products for each child subcategory
      for (const childSubcategory of childSubcategories) {
        try {
          const queryParams = buildQueryParams();
          const response = await authAxios.get(`${API_BASE_URL}/products/subcategory/${childSubcategory.subcategory_id}?${queryParams}`);
          
          if (response.data.success && response.data.data) {
            allProducts = [...allProducts, ...response.data.data];
            totalItems += response.data.totalItems || 0;
          }
        } catch (subError) {
          console.error(`Error fetching products for subcategory ${childSubcategory.subcategory_id}:`, subError);
        }
      }

      // Apply search filter on client side
      if (searchTerm.trim()) {
        allProducts = applySearchFilter(allProducts);
      }

      setProducts(allProducts);
      setPagination({
        totalPages: Math.ceil(allProducts.length / pagination.limit),
        totalItems: allProducts.length,
        page: currentPage,
        limit: pagination.limit
      });

    } catch (err) {
      console.error('Error fetching products by subcategory:', err);
      setProducts([]);
      setPagination({ totalPages: 0, totalItems: 0, page: 1, limit: 9 });
      
      if (err.response && (err.response.status === 401 || err.response.status === 409)) {
        return;
      }
      throw err;
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isAllCategoriesSelected()) {
        await fetchAllProducts();
      } else if (selectedSubcategory) {
        await fetchProductsBySubcategory();
      } else {
        await fetchProductsByCategory();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // For client-side pagination when dealing with subcategories
  const getPaginatedProducts = () => {
    if (selectedSubcategory) {
      const startIndex = (currentPage - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      return products.slice(startIndex, endIndex);
    }
    return products;
  };

  const currentProducts = getPaginatedProducts();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    alert(`Added ${product.name} to cart!`);
  };

  const handleCardClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate display indices
  const startIndex = selectedSubcategory 
    ? (currentPage - 1) * pagination.limit 
    : (pagination.page - 1) * pagination.limit;
  const endIndex = selectedSubcategory 
    ? Math.min(startIndex + pagination.limit, products.length)
    : Math.min(startIndex + pagination.limit, pagination.totalItems);

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
  if (!loading && currentProducts.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, backgroundColor: 'white', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="text.secondary">
              {searchTerm.trim() 
                ? `No products found matching "${searchTerm}"`
                : `No products found for this ${selectedSubcategory ? 'subcategory' : 'category'}`
              }
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ paddingBottom: 4, backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <ViewModuleIcon style={{ fontSize: 35 }} />
        <CustomPagination
          count={pagination.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>

      {/* Product Count */}
      <Box textAlign="center" mb={4}>
        <Typography variant="body2" color="text.secondary">
          {startIndex + 1}-{endIndex} of {pagination.totalItems} products
          {searchTerm.trim() && (
            <span> matching "{searchTerm}"</span>
          )}
        </Typography>
      </Box>

      {/* Product Grid */}
      <Box display="flex" flexWrap="wrap" mb={4}>
        {currentProducts.map((product) => (
          <CustomGridItem key={product.product_id}>
            <StyledCard onClick={() => handleCardClick(product.product_id)}>
              <Box position="relative">
                <ProductImage
                  className="product-image"
                  component="img"
                  image={product.image || 'https://via.placeholder.com/300x220?text=Product+Image'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x220?text=Product+Image';
                  }}
                  style={{ margin: "12px auto 0 auto" }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box mb={1}>
                  <Chip
                    label={product.stock_availability_in_us ? '🇺🇸 Stock in USA' : ''}
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

                <Typography variant="h6" component="h6" fontWeight="75" fontSize={17} sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.name}
                </Typography>

                <Box flexGrow={1}>
                  <Typography marginY={1} variant="body2" color="text.secondary">
                    MOQ: {product.moq?.toLocaleString() || 'N/A'} units
                  </Typography>
                  <Typography variant="body1" component="p" fontWeight="bold" color="black" mb={1}>
                    $ {product.price} / Unit
                  </Typography>
                </Box>

                <AddToCartButton
                  className="add-to-cart-btn"
                  variant="contained"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </AddToCartButton>
              </CardContent>
            </StyledCard>
          </CustomGridItem>
        ))}
      </Box>

      {/* Bottom Pagination */}
      <Box display="flex" justifyContent="right" mt={4}>
        <CustomPagination
          count={pagination.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default ProductTable;