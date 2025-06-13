import {
    Checkbox,
    Box,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    TextField,
    Typography,
    Alert,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAuth, authAxios } from "../../context/AuthContext";
import { useCategory } from "../../context/CategoryContext";
import { useFilter } from "../../context/FilterContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const FilteredSidebar = () => {

    const certifications = [
        "FDA",
        "ASTM",
        "CE",
        "GB",
        "Certification of Conformity",
        "Certification of Compliance",
        "Intertek",
        "EN",
        "SGS",
    ];

    const supplierCertificaitons = [
        "DUNS",
        "DRS",
        "ISO 9001",
        "ISO 13485",
        "ISO 9001:2015",
        "GMP"
    ];

    const ManufacturerLocation = [
        "Hong Kong S.A.R",
        "India",
        "Vietnam",
        "United States",
        "China",
        "Canada",
        "Australia",
        "United Kingdom",
        "Korea"
    ];

    // Validation schema
    const validationSchema = Yup.object({
        searchTerm: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed")
            .transform(value => value ? value.trimStart() : ''),
        searchCerts: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed")
            .transform(value => value ? value.trimStart() : ''),
        searchLocation: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed")
            .transform(value => value ? value.trimStart() : ''),
        searchSupplierCerts: Yup.string()
            .transform(value => value ? value.trimStart() : ''),
        minPrice: Yup.string()
            .matches(/^\d*$/, "Only numbers are allowed")
            .transform(value => value ? value.trimStart() : ''),
        maxPrice: Yup.string()
            .matches(/^\d*$/, "Only numbers are allowed")
            .transform(value => value ? value.trimStart() : ''),
        moq: Yup.string()
            .matches(/^\d*$/, "Only numbers are allowed")
            .transform(value => value ? value.trimStart() : ''),
    });

    // Categories and Subcategories states start 
    const [searchTerm, setSearchTerm] = useState('');
    const [allCategoriesData, setAllCategoiresData] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Categories and Subcategories states end

    // Context usage 
    const { isAuthenticated } = useAuth();
    const { selectedCategory, setCategoryAndSubcategory } = useCategory();
    const { filters, updateFilters } = useFilter();

    // Supplier Certifications States & Logic starts
    const [searchSupplierCerts, setSearchSupplierCerts] = useState("");
    // Supplier Certifications States & Logic ends

    // Certifications States & logic starts 
    const [searchCerts, setSearchCerts] = useState("");
    const [showAllCerts, setShowAllCerts] = useState(false);

    // Manufacturer Location Logic start
    const [searchLocation, setSearchLocation] = useState("");
    const [showAllLocations, setShowAllLocations] = useState(false);

    // Get filtered data functions
    const filteredCerts = certifications.filter(cert => cert.toLowerCase().includes(searchCerts.toLowerCase()));
    const displayedCerts = showAllCerts ? filteredCerts : filteredCerts.slice(0, 6);

    const filteredLocations = ManufacturerLocation.filter(loc =>
        loc.toLowerCase().includes(searchLocation.toLowerCase())
    );
    const displayedLocations = showAllLocations ? filteredLocations : filteredLocations.slice(0, 6);

    const filteredSupplierCerts = supplierCertificaitons.filter(cert =>
        cert.toLowerCase().includes(searchSupplierCerts.toLowerCase())
    );

    // Initial form values
    const initialValues = {
        searchTerm: searchTerm,
        searchCerts: searchCerts,
        searchLocation: searchLocation,
        searchSupplierCerts: searchSupplierCerts,
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
        moq: filters.moq || '',
    };

    const handleCertCheckboxChange = (event) => {
        const { name, checked } = event.target;
        const newCertifications = checked
            ? [...filters.selectedCertifications, name]
            : filters.selectedCertifications.filter((cert) => cert !== name);

        updateFilters({ selectedCertifications: newCertifications });
    };

    // Manufacturer Location Logic
    const handleLocationCheckboxChange = (event) => {
        const { name, checked } = event.target;
        const newLocations = checked
            ? [...filters.selectedManufacturerLocations, name]
            : filters.selectedManufacturerLocations.filter(item => item !== name);

        updateFilters({ selectedManufacturerLocations: newLocations });
    };

    // Handle supplier certifications
    const handleSupplierCertChange = (event) => {
        const { name, checked } = event.target;
        const newSupplierCerts = checked
            ? [...filters.selectedSupplierCertifications, name]
            : filters.selectedSupplierCertifications.filter((item) => item !== name);

        updateFilters({ selectedSupplierCertifications: newSupplierCerts });
    };

    // Handle stock in USA
    const handleStockChange = (e) => {
        updateFilters({ stockInUSA: e.target.checked });
    };

    // Handle price changes with debouncing
    const handlePriceChange = (field, value, setFieldValue) => {
        setFieldValue(field, value);

        // Debounce the filter update
        const timeoutId = setTimeout(() => {
            updateFilters({ [field]: value || 0 });
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Handle MOQ changes with debouncing
    const handleMOQChange = (value, setFieldValue) => {
        setFieldValue('moq', value);

        // Debounce the filter update
        const timeoutId = setTimeout(() => {
            updateFilters({ moq: value });
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    useEffect(() => {
        const fetchCategoriesData = async () => {
            setLoading(true);
            setError(null);

            try {
                const API_URI = "http://localhost:5000/api/v1/categories-subcategories"
                const response = await authAxios.get(API_URI);

                const data = response.data;
                if (data.success) {
                    setAllCategoiresData(data.data);
                } else {
                    setError('Failed to fetch categories data');
                }
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 409)) {
                    return;
                }
                console.error("Error fetching categories-subcategories: ", err);
                setError('Failed to fetch categories data');
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            fetchCategoriesData();
        }
    }, [isAuthenticated]);

    // Reset Search when category changes
    useEffect(() => {
        if (selectedCategory) {
            setSearchTerm('');
        }
    }, [selectedCategory]);

    // Filter subcategories based on search and selected category
    useEffect(() => {
        if (!allCategoriesData.length || !selectedCategory) {
            setFilteredSubcategories([]);
            return;
        }

        const categoryData = allCategoriesData.find(
            cat => cat.category_id === selectedCategory.category_id
        );

        if (!categoryData || !categoryData.subcategories) {
            setFilteredSubcategories([]);
            return;
        }

        const filtered = searchTerm.trim()
            ? categoryData.subcategories.filter(subcategory =>
                subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : categoryData.subcategories;

        setFilteredSubcategories(filtered);
    }, [selectedCategory, allCategoriesData, searchTerm]);

    const handleSubcategoryClick = (subcategory) => {
        if (setCategoryAndSubcategory) {
            setCategoryAndSubcategory(selectedCategory, subcategory);
        }
    };

    // Render functions for categories/subcategories
    const renderSubcategories = () => {
        if (!filteredSubcategories.length) return null;

        const subcategoriesToShow = showAll ? filteredSubcategories : filteredSubcategories.slice(0, 6);

        return (
            <Box>
                <List dense>
                    {subcategoriesToShow.map((subcategory) => (
                        <ListItem
                            key={subcategory.subcategory_id}
                            sx={{
                                cursor: 'pointer'
                            }}
                            onClick={() => handleSubcategoryClick(subcategory)}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2">
                                        {subcategory.name}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                {filteredSubcategories.length > 6 && (
                    <Box mt={1}>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ color: "#29B574", cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? 'Show Less' : 'Show All'}
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };

    const renderNoResults = () => {
        if (!selectedCategory) {
            return (
                <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                        Please select a category from the navbar to search subcategories
                    </Typography>
                </Box>
            );
        }

        if (searchTerm.trim() && filteredSubcategories.length === 0) {
            return (
                <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                        No subcategories found for "{searchTerm}" in {selectedCategory.name}
                    </Typography>
                </Box>
            );
        }

        if (!searchTerm.trim() && filteredSubcategories.length === 0) {
            return (
                <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                        No subcategories available for {selectedCategory.name}
                    </Typography>
                </Box>
            );
        }

        return null;
    };

    const renderCategoriesContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            );
        }

        return (
            <Box>
                {selectedCategory && (
                    <Box mb={0}>
                        <Typography variant="subtitle2" color="success.main" >
                            {selectedCategory.name}
                        </Typography>
                    </Box>
                )}

                {renderSubcategories()}
                {renderNoResults()}
            </Box>
        );
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => { }} // Not needed as we handle changes in real-time
            enableReinitialize
        >
            {({ values, errors, touched, setFieldValue }) => (
                <Form>
                    {/* More Categories Search Bar */}
                    {selectedCategory && selectedCategory.category_id !== null && (
                        <>
                            <Field name="searchTerm">
                                {({ field, meta }) => (
                                    <TextField
                                        {...field}
                                        size="small"
                                        fullWidth
                                        placeholder="More Categories"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const trimmedValue = e.target.value.trimStart();
                                            if (/^[a-zA-Z\s]*$/.test(trimmedValue) || trimmedValue === '') {
                                                setSearchTerm(trimmedValue);
                                                setFieldValue('searchTerm', trimmedValue);
                                            }
                                        }}
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "20px",
                                                backgroundColor: "#F2F2F2",
                                                "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                                "&:hover fieldset": { border: "1px solid darkgrey" },
                                                "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        inputProps={{
                                            style: { textAlign: "center" }
                                        }}
                                    />
                                )}
                            </Field>
                            {/* Categories Content */}
                            {renderCategoriesContent()}
                        </>
                    )}

                    {/* PriceFilter Starts*/}
                    <Box mt={3}>
                        <Typography gutterBottom>
                            Price
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Field name="minPrice">
                                {({ field, meta }) => (
                                    <TextField
                                        {...field}
                                        // value={filters.minPrice || ''}
                                        value={filters.minPrice ?? ''}
                                        onChange={(e) => {
                                            const trimmedValue = e.target.value.trimStart();
                                            if (/^\d*$/.test(trimmedValue) || trimmedValue === '') {
                                                handlePriceChange('minPrice', trimmedValue, setFieldValue);
                                            }
                                        }}
                                        placeholder="from"
                                        size="small"
                                        error={meta.touched && !!meta.error}
                                        sx={{
                                            width: "45%",
                                            borderRadius: "50px",
                                            backgroundColor: "#F2F2F2",
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: "20px",
                                                "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                                "&:hover fieldset": { border: "1px solid darkgrey" },
                                                "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                            }
                                        }}
                                        inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
                                        InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                    />
                                )}
                            </Field>

                            <Typography variant="body1">-</Typography>

                            <Field name="maxPrice">
                                {({ field, meta }) => (
                                    <TextField
                                        {...field}
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => {
                                            const trimmedValue = e.target.value.trimStart();
                                            if (/^\d*$/.test(trimmedValue) || trimmedValue === '') {
                                                handlePriceChange('maxPrice', trimmedValue, setFieldValue);
                                            }
                                        }}
                                        placeholder="to"
                                        size="small"
                                        error={meta.touched && !!meta.error}
                                        sx={{
                                            width: "45%",
                                            borderRadius: "50px",
                                            backgroundColor: "#F2F2F2",
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: "50px",
                                                "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                                "&:hover fieldset": { border: "1px solid darkgrey" },
                                                "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                            }
                                        }}
                                        inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
                                        InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }}
                                    />
                                )}
                            </Field>
                        </Box>
                        {(errors.minPrice && touched.minPrice) && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {errors.minPrice}
                            </Typography>
                        )}
                        {(errors.maxPrice && touched.maxPrice) && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {errors.maxPrice}
                            </Typography>
                        )}
                    </Box>
                    {/* PriceFilter Ends */}

                    {/* MOQ Filter Starts */}
                    <Box mt={3}>
                        <Typography gutterBottom>
                            MOQ
                        </Typography>
                        <Field name="moq">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    value={filters.moq || ''}
                                    onChange={(e) => {
                                        const trimmedValue = e.target.value.trimStart();
                                        if (/^\d*$/.test(trimmedValue) || trimmedValue === '') {
                                            handleMOQChange(trimmedValue, setFieldValue);
                                        }
                                    }}
                                    size="small"
                                    placeholder="less than"
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                    sx={{
                                        width: '100%',
                                        borderRadius: "50px",
                                        backgroundColor: "#F2F2F2",
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: "50px",
                                            backgroundColor: "#F2F2F2",
                                            "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                            "&:hover fieldset": { border: "1px solid darkgrey" },
                                            "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                        }
                                    }}
                                    inputProps={{ style: { textAlign: 'center' }, inputMode: 'numeric', pattern: '\\d*' }}
                                />
                            )}
                        </Field>
                    </Box>
                    {/* MOQ Filter Ends */}

                    {/* Product Certification start */}
                    <Box mt={3}>
                        <Typography gutterBottom>Product Certification</Typography>
                        <Field name="searchCerts">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    placeholder="Product Certifications..."
                                    value={searchCerts}
                                    onChange={(e) => {
                                        const trimmedValue = e.target.value.trimStart();
                                        if (/^[a-zA-Z\s]*$/.test(trimmedValue) || trimmedValue === '') {
                                            setSearchCerts(trimmedValue);
                                            setFieldValue('searchCerts', trimmedValue);
                                        }
                                    }}
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "20px",
                                            backgroundColor: "#F2F2F2",
                                            "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                            "&:hover fieldset": { border: "1px solid darkgrey" },
                                            "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                    inputProps={{
                                        style: { textAlign: "center" }
                                    }}
                                />
                            )}
                        </Field>

                        <FormGroup sx={{ mt: 2 }}>
                            {displayedCerts.map((cert) => (
                                <FormControlLabel
                                    key={cert}
                                    control={
                                        <Checkbox
                                            name={cert}
                                            checked={filters.selectedCertifications.includes(cert)}
                                            onChange={handleCertCheckboxChange}
                                        />
                                    }
                                    label={cert}
                                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem" }, marginBottom: "0px" }}
                                />
                            ))}
                        </FormGroup>

                        {filteredCerts.length > 6 && (
                            <Typography
                                variant="body2"
                                style={{ color: "#29B574" }}
                                onClick={() => setShowAllCerts((prev) => !prev)}
                                sx={{ mt: 1, color: "primary.main", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}
                            >
                                {showAllCerts ? "Show Less" : `Show All (${filteredCerts.length})`}
                            </Typography>
                        )}
                    </Box>
                    {/* Product Certification ends */}

                    {/* Supplier Certifications Start */}
                    <Box mt={3}>
                        <Typography gutterBottom>Supplier Certification</Typography>
                        <Field name="searchSupplierCerts">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    placeholder="Supplier Certifications..."
                                    value={searchSupplierCerts}
                                    onChange={(e) => {
                                        const trimmedValue = e.target.value.trimStart();
                                        setSearchSupplierCerts(trimmedValue);
                                        setFieldValue('searchSupplierCerts', trimmedValue);
                                    }}
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "20px",
                                            backgroundColor: "#F2F2F2",
                                            "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                            "&:hover fieldset": { border: "1px solid darkgrey" },
                                            "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                    inputProps={{
                                        style: { textAlign: "center" }
                                    }}
                                />
                            )}
                        </Field>

                        <FormGroup sx={{ mt: 2 }}>
                            {filteredSupplierCerts.map(cert => (
                                <FormControlLabel
                                    key={cert}
                                    control={
                                        <Checkbox
                                            name={cert}
                                            checked={filters.selectedSupplierCertifications.includes(cert)}
                                            onChange={handleSupplierCertChange}
                                        />
                                    }
                                    label={cert}
                                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem" }, marginBottom: "0px" }}
                                />
                            ))}
                        </FormGroup>
                    </Box>
                    {/* Supplier Certifications Ends */}

                    {/* Manufacturer Location starts */}
                    <Box mt={3}>
                        <Typography gutterBottom>Manufacturer Location</Typography>
                        <Field name="searchLocation">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    placeholder="Country/Region"
                                    value={searchLocation}
                                    onChange={(e) => {
                                        const trimmedValue = e.target.value.trimStart();
                                        if (/^[a-zA-Z\s]*$/.test(trimmedValue) || trimmedValue === '') {
                                            setSearchLocation(trimmedValue);
                                            setFieldValue('searchLocation', trimmedValue);
                                        }
                                    }}
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "20px",
                                            backgroundColor: "#F2F2F2",
                                            "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" },
                                            "&:hover fieldset": { border: "1px solid darkgrey" },
                                            "&.Mui-focused fieldset": { border: "1px solid darkgrey" }
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                    inputProps={{
                                        style: { textAlign: "center" }
                                    }}
                                />
                            )}
                        </Field>

                        <FormGroup sx={{ mt: 2 }}>
                            {displayedLocations.map((loc) => (
                                <FormControlLabel
                                    key={loc}
                                    control={
                                        <Checkbox
                                            name={loc}
                                            checked={filters.selectedManufacturerLocations.includes(loc)}
                                            onChange={handleLocationCheckboxChange}
                                        />
                                    }
                                    label={loc}
                                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem" }, marginBottom: "0px" }}
                                />
                            ))}
                        </FormGroup>

                        {filteredLocations.length > 6 && (
                            <Typography
                                variant="body2"
                                onClick={() => setShowAllLocations((prev) => !prev)}
                                sx={{
                                    color: "primary.main",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    fontSize: "0.85rem"
                                }}
                                style={{ color: "#29B574" }}
                            >
                                {showAllLocations ? "Show Less" : `Show All (${filteredLocations.length})`}
                            </Typography>
                        )}
                    </Box>
                    {/* Manufacturer Location ends */}

                    {/* Stock Availability starts */}
                    <Box mt={3}>
                        <Typography gutterBottom>Stock Availability</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters.stockInUSA}
                                    onChange={handleStockChange}
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="subtitle2">
                                    🇺🇸 Stock in USA
                                </Typography>
                            }
                        />
                    </Box>
                    {/* Stock Availability ends */}
                </Form>
            )}
        </Formik>
    )
}

export default FilteredSidebar;