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

  // Categories cache state
  const [categoriesCache, setCategoriesCache] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { selectedCategory, selectedSubcategory, setNumberOfProducts } = useCategory();
  const { filters } = useFilter();

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Fetch and cache categories
  const fetchAndCacheCategories = async () => {
    if (categoriesCache) {
      return categoriesCache; // Return cached data if available
    }

    if (categoriesLoading) {
      // If already loading, wait for it to complete
      return new Promise((resolve) => {
        const checkCache = () => {
          if (categoriesCache) {
            resolve(categoriesCache);
          } else if (!categoriesLoading) {
            resolve(null);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    setCategoriesLoading(true);
    try {
      const categoriesResponse = await authAxios.get(`${API_BASE_URL}/categories`);
      
      if (!categoriesResponse.data.success) {
        throw new Error('Failed to fetch categories');
      }

      const categories = categoriesResponse.data.data;
      setCategoriesCache(categories);
      return categories;
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Update number of products for context
  useEffect(() => {
    setNumberOfProducts(pagination.totalItems);
  }, [pagination.totalItems, setNumberOfProducts]);

  // Fetch products when category, subcategory, filters, search, or page changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory, selectedSubcategory, filters, searchTerm, currentPage]);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, searchTerm, selectedCategory, selectedSubcategory]);

  // Build query parameters for API call
  const buildQueryParams = (singleManufacturerLocation = null) => {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', currentPage.toString());
    params.append('limit', pagination.limit.toString());

    // Search term - only add if there's a search term
    if (searchTerm && searchTerm.trim()) {
      params.append('productName', searchTerm.trim());
    }

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

    // Manufacturer location - Handle single location for individual API calls
    if (singleManufacturerLocation) {
      params.append('manufacturer_location', singleManufacturerLocation);
    } else if (filters.selectedManufacturerLocations && filters.selectedManufacturerLocations.length === 1) {
      // If only one location is selected, use it normally
      params.append('manufacturer_location', filters.selectedManufacturerLocations[0]);
    }

    // Stock in USA
    if (filters.stockInUSA) {
      params.append('stock_availability_in_us', 'true');
    }

    return params.toString();
  };

  const isAllCategoriesSelected = () => {
    if (!selectedCategory) return false;
    return selectedCategory.category_id === null && selectedCategory.name === "All Categories";
  };

  const getCategoryId = async (categoryName) => {
    try {
      const categories = await fetchAndCacheCategories();

      const category = categories.find(cat =>
        cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
      );

      if (!category) {
        throw new Error(`Category "${categoryName}" not found`);
      }

      return category.category_id;
    } catch (err) {
      console.error('Error fetching category ID:', err);
      throw err;
    }
  };

  const fetchAllProducts = async () => {
    try {
      // Check if multiple manufacturer locations are selected
      const hasMultipleManufacturerLocations = filters.selectedManufacturerLocations &&
        filters.selectedManufacturerLocations.length > 1;

      if (hasMultipleManufacturerLocations) {
        // Make parallel API calls for each manufacturer location
        const promises = filters.selectedManufacturerLocations.map(location => {
          const queryParams = buildQueryParams(location);
          return authAxios.get(`${API_BASE_URL}/products/all?${queryParams}`);
        });

        const responses = await Promise.all(promises);

        // Combine all results
        let allProducts = [];

        responses.forEach(response => {
          if (response.data.success && response.data.data) {
            allProducts = [...allProducts, ...response.data.data];
          }
        });

        // Remove duplicates based on product_id (if any)
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.product_id === product.product_id)
        );

        setProducts(uniqueProducts);
        setPagination({
          totalPages: Math.ceil(uniqueProducts.length / pagination.limit),
          totalItems: uniqueProducts.length,
          page: currentPage,
          limit: pagination.limit
        });

      } else {
        // Single or no manufacturer location - use normal API call
        const queryParams = buildQueryParams();
        const response = await authAxios.get(`${API_BASE_URL}/products/all?${queryParams}`);

        if (response.data.success) {
          const productsData = response.data.data || [];

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
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 409)) {
        return;
      }
      throw err;
    }
  };

  const fetchProductsBySearch = async () => {
    try {
      if (!searchTerm || !searchTerm.trim()) {
        return;
      }

      // Determine which category ID to use for search
      let categoryId;

      if (isAllCategoriesSelected()) {
        try {
          const categories = await fetchAndCacheCategories();
          if (categories && categories.length > 0) {
            categoryId = categories[0].category_id;
          } else {
            throw new Error('No categories available for search');
          }
        } catch (err) {
          console.error('Error fetching categories for search:', err);
          categoryId = 1; // Fallback to category ID 1
        }
      } else if (selectedCategory) {
        const selectedCategoryName = typeof selectedCategory === 'string'
          ? selectedCategory
          : selectedCategory?.name ?? '';

        categoryId = await getCategoryId(selectedCategoryName);
      } else {
        throw new Error('No category selected for search');
      }

      // Check if multiple manufacturer locations are selected
      const hasMultipleManufacturerLocations = filters.selectedManufacturerLocations &&
        filters.selectedManufacturerLocations.length > 1;

      if (hasMultipleManufacturerLocations) {
        // Make parallel API calls for each manufacturer location
        const promises = filters.selectedManufacturerLocations.map(location => {
          const queryParams = buildQueryParams(location);
          return authAxios.get(`${API_BASE_URL}/products/search/${categoryId}?${queryParams}`);
        });

        const responses = await Promise.all(promises);

        // Combine all results
        let allProducts = [];
        let totalItems = 0;

        responses.forEach(response => {
          if (response.data.success && response.data.data) {
            allProducts = [...allProducts, ...response.data.data];
            totalItems += response.data.data.length;
          }
        });

        // Remove duplicates based on product_id (if any)
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.product_id === product.product_id)
        );

        setProducts(uniqueProducts);
        setPagination({
          totalPages: Math.ceil(uniqueProducts.length / pagination.limit),
          totalItems: uniqueProducts.length,
          page: currentPage,
          limit: pagination.limit
        });

      } else {
        // Single or no manufacturer location - use normal API call
        const queryParams = buildQueryParams();
        const response = await authAxios.get(`${API_BASE_URL}/products/search/${categoryId}?${queryParams}`);

        if (response.data.success) {
          const productsData = response.data.data || [];

          setProducts(productsData);
          setPagination({
            totalPages: response.data.totalPages || Math.ceil(productsData.length / pagination.limit),
            totalItems: response.data.totalItems || productsData.length,
            page: response.data.page || currentPage,
            limit: response.data.limit || pagination.limit
          });
        } else {
          setProducts([]);
          setPagination({ totalPages: 0, totalItems: 0, page: 1, limit: 9 });
        }
      }
    } catch (err) {
      console.error('Error fetching products by search:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 409)) {
        return;
      }
      throw err;
    }
  };

  const fetchProductsByCategory = async () => {
    try {
      // If there's a search term, use the search API
      if (searchTerm && searchTerm.trim()) {
        return await fetchProductsBySearch();
      }

      const selectedCategoryName = typeof selectedCategory === 'string'
        ? selectedCategory
        : selectedCategory?.name ?? '';

      const categoryId = await getCategoryId(selectedCategoryName);

      // Check if multiple manufacturer locations are selected
      const hasMultipleManufacturerLocations = filters.selectedManufacturerLocations &&
        filters.selectedManufacturerLocations.length > 1;

      if (hasMultipleManufacturerLocations) {
        // Make parallel API calls for each manufacturer location
        const promises = filters.selectedManufacturerLocations.map(location => {
          const queryParams = buildQueryParams(location);
          return authAxios.get(`${API_BASE_URL}/products/category/${categoryId}?${queryParams}`);
        });

        const responses = await Promise.all(promises);

        // Combine all results
        let allProducts = [];

        responses.forEach(response => {
          if (response.data.success && response.data.data) {
            allProducts = [...allProducts, ...response.data.data];
          }
        });

        // Remove duplicates based on product_id (if any)
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.product_id === product.product_id)
        );

        setProducts(uniqueProducts);
        setPagination({
          totalPages: Math.ceil(uniqueProducts.length / pagination.limit),
          totalItems: uniqueProducts.length,
          page: currentPage,
          limit: pagination.limit
        });

      } else {
        // Single or no manufacturer location - use normal API call
        const queryParams = buildQueryParams();
        const response = await authAxios.get(`${API_BASE_URL}/products/category/${categoryId}?${queryParams}`);

        if (response.data.success) {
          const productsData = response.data.data || [];

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
      // If there's a search term, use the search API
      if (searchTerm && searchTerm.trim()) {
        return await fetchProductsBySearch();
      }

      const subcategoryId = selectedSubcategory?.subcategory_id;

      if (!subcategoryId) {
        throw new Error('No subcategory selected or subcategory ID not found');
      }

      // Check if multiple manufacturer locations are selected
      const hasMultipleManufacturerLocations = filters.selectedManufacturerLocations &&
        filters.selectedManufacturerLocations.length > 1;

      if (hasMultipleManufacturerLocations) {
        // Make parallel API calls for each manufacturer location
        const promises = filters.selectedManufacturerLocations.map(location => {
          const queryParams = buildQueryParams(location);
          return authAxios.get(`${API_BASE_URL}/products/subcategory/${subcategoryId}?${queryParams}`);
        });

        const responses = await Promise.all(promises);

        // Combine all results
        let allProducts = [];

        responses.forEach(response => {
          if (response.data.success && response.data.data) {
            allProducts = [...allProducts, ...response.data.data];
          }
        });

        // Remove duplicates based on product_id (if any)
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.product_id === product.product_id)
        );

        setProducts(uniqueProducts);
        setPagination({
          totalPages: Math.ceil(uniqueProducts.length / pagination.limit),
          totalItems: uniqueProducts.length,
          page: currentPage,
          limit: pagination.limit
        });

      } else {
        // Single or no manufacturer location - use normal API call
        const queryParams = buildQueryParams();
        const response = await authAxios.get(`${API_BASE_URL}/products/subcategory/${subcategoryId}?${queryParams}`);

        if (response.data.success) {
          const productsData = response.data.data || [];

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
      }
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
      // If there's a search term, always use search API
      if (searchTerm && searchTerm.trim()) {
        await fetchProductsBySearch();
      } else if (isAllCategoriesSelected()) {
        await fetchAllProducts();
      } else if (selectedSubcategory) {
        await fetchProductsBySubcategory();
      } else {
        await fetchProductsByCategory();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate display indices for server-side pagination
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(startIndex + products.length - 1, pagination.totalItems);

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
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
            <Box mb={2}>
              <img src={boxes} alt="No products" style={{ width: 80, height: 80, opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" color="text.secondary" textAlign="center">
              {searchTerm && searchTerm.trim()
                ? `No products found matching "${searchTerm}"`
                : `No products found for this ${selectedSubcategory ? 'subcategory' : 'category'}`
              }
            </Typography>
            {searchTerm && searchTerm.trim() && (
              <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
                Try adjusting your search terms or filters
              </Typography>
            )}
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
        {pagination.totalPages > 1 && (
          <CustomPagination
            count={pagination.totalPages}
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
          {pagination.totalItems > 0 ? (
            <>
              {startIndex}-{endIndex} of {pagination.totalItems} products
              {searchTerm && searchTerm.trim() && (
                <span> matching "{searchTerm}"</span>
              )}
            </>
          ) : (
            'No products found'
          )}
        </Typography>
      </Box>

      {/* Product Grid */}
      <Box display="flex" flexWrap="wrap" mb={4}>
        {products.map((product) => (
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
                  {product.stock_availability_in_us && (
                    <Chip
                      label="🇺🇸 Stock in USA"
                      size="small"
                      sx={{
                        backgroundColor: 'transparent',
                        color: 'black',
                        fontWeight: 500,
                        border: 'none',
                        pl: 0
                      }}
                    />
                  )}
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
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CustomPagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductTable;