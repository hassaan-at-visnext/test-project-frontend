import { Box, Button, Table, TableCell, TableContainer, TableRow, TableHead, TableBody, Paper, Collapse, Menu, MenuItem, TextField, Typography } from "@mui/material";
import boxes from "../assets/categories.png";
import dropdown from "../assets/drop_down.png";
import { useEffect, useState, useRef } from "react";
import { useAuth, authAxios } from "../context/AuthContext";
import { useCategory } from "../context/CategoryContext";
import { useSearch } from "../context/SearchContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const Searchbar = () => {
    const tableRef = useRef(null);
    const containerRef = useRef(null);
    const { isAuthenticated } = useAuth();
    const { selectedCategory, selectedSubcategory, setCategoryOnly, setCategoryAndSubcategory } = useCategory();

    const { searchTerm, setSearchTerm } = useSearch();

    const [anchorEl, setAnchorEl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryDropdown, setSelectedCategoryDropdown] = useState({ category_id: null, name: "All Categories" });
    const open = Boolean(anchorEl);

    // Sticky state
    const [isSticky, setIsSticky] = useState(false);

    // Categories-and-subcategories dropdown work 
    const [openTable, setOpenTable] = useState(false);
    const [columns, setColumns] = useState([]);
    const [maxRows, setMaxRows] = useState(0);

    // Validation schema with Yup
    const validationSchema = Yup.object({
        searchInput: Yup.string()
            .matches(/^[a-zA-Z0-9\s]*$/, "Only letters, numbers, and spaces are allowed")
            .transform((value) => {
                // Remove leading spaces
                return value ? value.replace(/^\s+/, '') : '';
            })
            .max(100, "Search term must be less than 100 characters")
    });

    // Initial values for Formik
    const initialValues = {
        searchInput: ''
    };

    // Sticky scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_URI = "http://localhost:5000/api/v1/categories-subcategories";
                const response = await authAxios.get(API_URI);

                if (response.data.success && Array.isArray(response.data.data)) {
                    const transformed = response.data.data.map(cat => ({
                        categoryId: cat.category_id,
                        categoryName: cat.name,
                        subcategories: cat.subcategories.map(sub => ({
                            subcategoryId: sub.subcategory_id,
                            subcategoryName: sub.name
                        }))
                    }));

                    setColumns(transformed);

                    const max = Math.max(...transformed.map(col => col.subcategories.length));
                    setMaxRows(max);
                }
            } catch (error) {
                // Auth errors are handled by interceptor, only handle other errors
                if (error.response && (error.response.status === 401 || error.response.status === 409)) {
                    return; // Let interceptor handle auth errors
                }
                console.error("Error fetching categories-subcategories: ", error);
                setColumns([]);
                setMaxRows(0);
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const API_URI = "http://localhost:5000/api/v1/categories"
                const response = await authAxios.get(API_URI);

                if (response.data.success && Array.isArray(response.data.data)) {
                    // Store complete category data with both category_id and name
                    const categoryData = response.data.data.filter(cat =>
                        cat &&
                        typeof cat === 'object' &&
                        cat.name &&
                        cat.category_id
                    );

                    // Add "All Categories" option at the beginning
                    const allCategories = [
                        { category_id: null, name: "All Categories" },
                        ...categoryData
                    ];

                    setCategories(allCategories);
                } else {
                    console.error("Failed to fetch categories:", response.data);
                    // Set fallback categories if API fails
                    setCategories([{ category_id: null, name: "All Categories" }]);
                }
            } catch (error) {
                // Auth errors are handled by interceptor, only handle other errors
                if (error.response && (error.response.status === 401 || error.response.status === 409)) {
                    return; // Let interceptor handle auth errors
                }
                console.error("API error: ", error);
                // Set fallback categories if API fails
                setCategories([{ category_id: null, name: "All Categories" }]);
            }
        }

        // Only fetch if authenticated
        if (isAuthenticated) {
            fetchCategories();
        } else {
            // Set default if not authenticated
            setCategories([{ category_id: null, name: "All Categories" }]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                setOpenTable(false);
            }
        }
        if (openTable) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openTable]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleCategorySelect = (category) => {
        setSelectedCategoryDropdown(category);
        setCategoryOnly(category);
        handleClose();
    }

    const handleTableCategoryClick = (categoryName) => {
        const category = columns.find(col => col.categoryName === categoryName);
        if (category) {
            const categoryObj = {
                category_id: category.categoryId,
                name: category.categoryName
            };
            setSelectedCategoryDropdown(categoryObj);
            setCategoryOnly(categoryObj);
            setOpenTable(false);
        }
    };

    const handleSubcategoryClick = (subcategory) => {
        const parentCategory = columns.find(col =>
            col.subcategories.some(sub => sub.subcategoryName === subcategory.subcategoryName)
        );

        if (parentCategory) {
            const categoryObj = {
                category_id: parentCategory.categoryId,
                name: parentCategory.categoryName
            };

            const subcategoryObj = {
                subcategory_id: subcategory.subcategoryId,
                subcategoryName: subcategory.subcategoryName
            };

            setSelectedCategoryDropdown(categoryObj);
            setCategoryAndSubcategory(categoryObj, subcategoryObj);
            setOpenTable(false);

        }
    };

    // Helper to display the current selection
    const displaySelectedCategory = () => {
        if (selectedSubcategory && selectedCategory) {
            return selectedCategory.name;
        }
        return selectedCategory?.name || "All Categories";
    };

    // Handle search form submission
    const handleSearchSubmit = (values) => {
        const trimmedValue = values.searchInput.replace(/^\s+/, ''); // Remove leading spaces
        setSearchTerm(trimmedValue);
        setOpenTable(false);
    };

    // Custom input handler to prevent special characters and leading spaces
    const handleInputChange = (e, setFieldValue) => {
        let value = e.target.value;

        // Remove any special characters except spaces
        value = value.replace(/[^a-zA-Z0-9\s]/g, '');

        // Remove leading spaces for display
        const displayValue = value.replace(/^\s+/, '');

        setFieldValue('searchInput', displayValue);

        // If the search bar is cleared, immediately clear the search term
        if (displayValue === '') {
            setSearchTerm('');
        }
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                width: '100%',
                backgroundColor: isSticky ? '#F2F2F2' : 'white',
                position: isSticky ? 'sticky' : 'relative',
                top: isSticky ? 0 : 'auto',
                zIndex: 1001,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box ref={tableRef} display="flex" flexDirection="column" marginTop={0} p={2} borderRadius={2} sx={{ backgroundColor: "#F2F2F2", border: "1px solid #F2F2F2", width: "75%", position: "relative", zIndex: 1000 }}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSearchSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleSubmit }) => (
                        <Form>
                            <Box display="flex" >
                                <Button color="inherit" onClick={() => setOpenTable(!openTable)} sx={{ backgroundColor: openTable ? '#ffffff' : 'transparent', marginX: "15px", textTransform: 'none', borderRadius: "20px", fontSize: "1.1rem" }}>
                                    <img src={boxes} alt="icon" style={{ width: "20px", marginRight: "5px" }} />
                                    Categories
                                </Button>

                                <Box sx={{ position: 'relative', flexGrow: 1, marginX: "20px" }} >
                                    <Field name="searchInput">
                                        {({ field }) => (
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                placeholder="What are you looking for?"
                                                value={values.searchInput}
                                                onChange={(e) => handleInputChange(e, setFieldValue)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleSubmit();
                                                    }
                                                }}
                                                error={touched.searchInput && Boolean(errors.searchInput)}
                                                helperText={touched.searchInput && errors.searchInput}
                                                sx={{
                                                    marginX: "20px",
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: "20px",
                                                        backgroundColor: "white",
                                                        "& fieldset": {
                                                            borderRadius: "20px",
                                                            border: "1px solid darkgrey"
                                                        },
                                                        "&:hover fieldset": {
                                                            border: "1px solid darkgrey"
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            border: "1px solid darkgrey"
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>

                                    {/* Vertical separator line */}
                                    <Box sx={{ position: 'absolute', right: '220px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '60%', backgroundColor: '#ccc' }} />

                                    {/* Categories dropdown button */}
                                    <Button color="inherit" sx={{ position: 'absolute', right: "8px", top: "50%", transform: "translateY(-50%)", textTransform: 'none', fontSize: "0.9rem", minWidth: '130px', height: "32px", padding: "4px 8px", display: "flex", alignItems: 'center', gap: '8px' }}
                                        onClick={handleClick}
                                        aria-controls={open ? 'categories-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Typography variant="body2" sx={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: displaySelectedCategory() === "All Categories" ? "grey.500" : "text.primary", flex: 1 }}>
                                            {displaySelectedCategory()}
                                        </Typography>
                                        <img src={dropdown} alt="dropdown icon" style={{ width: "15px", marginLeft: "10px", flexShrink: "0" }} />
                                    </Button>
                                    <Menu id="categories-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'categories-button' }} sx={{ '& .MuiPaper-root': { borderRadius: '10px', marginTop: '5px', boxShadow: "none", border: "1px solid darkgrey", backgroundColor: "#F5F5F5" } }}>
                                        {categories.map((category) => (
                                            <MenuItem
                                                key={category.category_id || 'all-categories'}
                                                onClick={() => handleCategorySelect(category)}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    color: category.name === "All Categories" ? 'grey.500' : 'text.primary',
                                                    '&:hover': { backgroundColor: "lightgrey" }
                                                }}
                                            >
                                                {category.name || "Invalid Category"}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: "12%", marginX: "10px", backgroundColor: "#00B2C9", border: "1px solid #00B2C9", textTransform: "none", borderRadius: "20px" }}>
                                    Search
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>

                {/* Categories-subcategories dropdown */}
                <Box sx={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 1000, backgroundColor: "#F2F2F2", borderRadius: "0 0 8px 8px", boxShadow: openTable ? "0 4px 8px rgba(0,0,0,0.1)" : "none", overflow: "hidden" }}>
                    <Collapse in={openTable}>
                        <TableContainer component={Paper} elevation={0} sx={{ maxWidth: "100%", overflowX: "auto", backgroundColor: "#F2F2F2", mx: "auto" }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((col, index) => (
                                            <TableCell
                                                key={index}
                                                onClick={() => handleTableCategoryClick(col.categoryName)}
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: "0.8rem",
                                                    borderBottom: "none",
                                                    cursor: "pointer",
                                                    '&:hover': { color: "#29B574" }
                                                }}
                                            >
                                                {col.categoryName}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.from({ length: maxRows }).map((_, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {columns.map((col, colIndex) => {
                                                const sub = col.subcategories[rowIndex];
                                                return (
                                                    <TableCell
                                                        key={colIndex}
                                                        onClick={() => sub && handleSubcategoryClick(sub)}
                                                        sx={{
                                                            fontSize: "0.7rem",
                                                            paddingY: "0.125rem",
                                                            borderBottom: "none",
                                                            cursor: sub ? "pointer" : "default",
                                                            '&:hover': sub ? { color: "#29B574" } : {}
                                                        }}
                                                    >
                                                        {sub ? sub.subcategoryName : ""}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </Box>
            </Box>
        </Box>
    );
};

export default Searchbar;