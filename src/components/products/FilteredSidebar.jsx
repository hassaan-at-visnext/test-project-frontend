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
import { useAuth } from "../../context/AuthContext";
import { useCategory } from "../../context/CategoryContext";
import axios from "axios";

const FilteredSidebar = ({ onFiltersChange }) => {

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


    // Categories and Subcategoires states start 
    const [searchTerm, setSearchTerm] = useState('');
    const [allCategoriesData, setAllCategoiresData] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Categores and Subcategories states end

    // Context usage 
    const { Authorization, isAuthenticated } = useAuth();
    const { selectedCategory, setCategoryAndSubcategory } = useCategory();

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2400);
    const [moq, setMoq] = useState(''); // Fixed: Changed from null to empty string
    const [stockInUSA, setStockInUSA] = useState(false);

    // Supplier Certifications States & Logic starts
    const [checkedSupplierCerts, setCheckedSupplierCerts] = useState([]);
    const [searchSupplierCerts, setSearchSupplierCerts] = useState("");
    // Supplier Certifications States & Logic ends

    // Certifications States & logic starts 
    const [checkedCerts, setCheckedCerts] = useState([]);
    const [searchCerts, setSearchCerts] = useState("");
    const [showAllCerts, setShowAllCerts] = useState(false);

    const filteredCerts = certifications.filter(cert => cert.toLowerCase().includes(searchCerts.toLowerCase()));
    const displayedCerts = showAllCerts ? filteredCerts : filteredCerts.slice(0, 6);

    const handleCertCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedCerts((prev) => checked ? [...prev, name] : prev.filter((cert) => cert !== name));
    };

    const handleSearchCertsChange = (event) => {
        setSearchCerts(event.target.value);
    };
    // Certifications States & logic ends

    // Manufacturer Location Logic start
    // Add at top with other useState declarations
    const [checkedLocations, setCheckedLocations] = useState([]);
    const [searchLocation, setSearchLocation] = useState("");
    const [showAllLocations, setShowAllLocations] = useState(false);

    const filteredLocations = ManufacturerLocation.filter(loc =>
        loc.toLowerCase().includes(searchLocation.toLowerCase())
    );
    const displayedLocations = showAllLocations ? filteredLocations : filteredLocations.slice(0, 6);

    const handleLocationCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedLocations(prev =>
            checked ? [...prev, name] : prev.filter(item => item !== name)
        );
    };

    useEffect(() => {
        const fetchCategoriesData = async () => {
            setLoading(true);
            setError(null);

            try {
                const API_URI = "http://localhost:5000/api/v1/categories-subcategories"
                const response = await axios.get(API_URI, {
                    headers: {
                        Authorization: Authorization
                    }
                });

                // Fixed: axios response already contains data, no need for response.json()
                const data = response.data;
                if (data.success) {
                    setAllCategoiresData(data.data);
                } else {
                    setError('Failed to fetch categories data');
                }
            } catch (err) {
                setError('Failed to fetch categories data');
            } finally {
                setLoading(false);
            }
        }

        fetchCategoriesData();
    }, [Authorization]); // Added Authorization as dependency

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
            cat => cat.category_id === selectedCategory.category_id // Fixed: changed category_id to cat.category_id
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

    // Send filters to Parent Component
    useEffect(() => {
        const filters = {
            minPrice: minPrice.toString().trim(),
            maxPrice: maxPrice.toString().trim(),
            moq: moq ? moq.toString().trim() : '',
            selectedCertifications: checkedCerts,
            selectedSupplierCertifications: checkedSupplierCerts,
            selectedManufacturerLocations: checkedLocations,
            stockInUSA
        };

        if (onFiltersChange) {
            onFiltersChange(filters);
        }
    }, [
        minPrice,
        maxPrice,
        moq,
        checkedCerts,
        checkedSupplierCerts,
        checkedLocations,
        stockInUSA,
        onFiltersChange
    ]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubcategoryClick = (subcategory) => {
        if (setCategoryAndSubcategory) {
            setCategoryAndSubcategory(selectedCategory, subcategory);
        }
        console.log('Selected subcategory:', subcategory);
        console.log('From category:', selectedCategory.name);
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
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
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
                    <Box textAlign="center" mt={1}>
                        <Typography
                            variant="body2"
                            color="primary"
                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
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
                    <Box mb={2}>
                        <Typography variant="subtitle1" color="success.main" fontWeight="bold">
                            {selectedCategory.name}
                        </Typography>
                    </Box>
                )}

                {renderSubcategories()}
                {renderNoResults()}
            </Box>
        );
    };
   

    // Manufacturer Location Logic ends
    return (
        <>
            {/* More Categories Search Bar */}
            <TextField 
                size="small" 
                fullWidth 
                placeholder="More Categories"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#F2F2F2", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
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
            {/* Categories Content */}
            {renderCategoriesContent()}

            {/* PriceFilter Starts*/}
            <Box mt={3}>
                <Typography gutterBottom>
                    Price
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <TextField value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="from" size="small"
                        sx={{ width: "45%", borderRadius: "50px", backgroundColor: "#F2F2F2", '& .MuiOutlinedInput-root': { borderRadius: "20px", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
                        inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
                        InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} />

                    <Typography variant="body1">-</Typography>

                    <TextField value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="to" size="small"
                        sx={{ width: "45%", borderRadius: "50px", backgroundColor: "#F2F2F2", '& .MuiOutlinedInput-root': { borderRadius: "50px", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
                        inputProps={{ inputMode: 'numeric', pattern: '\\d*' }}
                        InputProps={{ endAdornment: <InputAdornment position="end">$</InputAdornment> }} />

                </Box>
            </Box>
            {/* PriceFilter Ends */}

            {/* MOQ Filter Starts */}
            <Box mt={3}>
                <Typography gutterBottom>
                    MOQ
                </Typography>
                <TextField value={moq} onChange={(e) => setMoq(e.target.value)} size="small" placeholder="less than"
                    sx={{ width: '100%', borderRadius: "50px", backgroundColor: "#F2F2F2", '& .MuiOutlinedInput-root': { borderRadius: "50px", backgroundColor: "#F2F2F2", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }} inputProps={{ style: { textAlign: 'center' }, inputMode: 'numeric', pattern: '\\d*' }} />
            </Box>
            {/* MOQ Filter Ends */}

            {/* Product Certification start */}
            <Box mt={3}>
                <Typography gutterBottom>Product Certification</Typography>
                <TextField size="small" fullWidth placeholder="Product Certifications..." value={searchCerts} onChange={handleSearchCertsChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#F2F2F2", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
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
                <FormGroup sx={{ mt: 2 }}>
                    {displayedCerts.filter((cert) => cert.toLowerCase().includes(searchCerts.toLowerCase())).map((cert) => (
                        <FormControlLabel key={cert} control={
                            <Checkbox
                                name={cert}
                                checked={checkedCerts.includes(cert)}
                                onChange={handleCertCheckboxChange}
                            // size="small"
                            />
                        }
                            label={cert}
                            sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.8rem" }, marginBottom: "0px" }}
                        />
                    ))}
                </FormGroup>

                {filteredCerts.length > 6 && (
                    <Typography variant="body2" onClick={() => setShowAllCerts((prev) => !prev)} sx={{ mt: 1, color: "primary.main", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>
                        {showAllCerts ? "Show Less" : `Show All (${filteredCerts.length})`}
                    </Typography>
                )}
            </Box>
            {/* Product Certification ends */}

            {/* Supplier Certifications Start */}
            <Box mt={3}>
                <Typography gutterBottom>Supplier Certification</Typography>
                <TextField size="small" fullWidth placeholder="Supplier Certifications..." value={searchSupplierCerts} onChange={(e) => setSearchSupplierCerts(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#F2F2F2", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
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
                <FormGroup sx={{ mt: 2 }}>
                    {supplierCertificaitons.filter(cert => cert.toLowerCase().includes(searchSupplierCerts.toLowerCase())).map(cert => (
                        <FormControlLabel key={cert} control={<Checkbox name={cert} checked={checkedSupplierCerts.includes(cert)}
                            onChange={(event) => {
                                const { name, checked } = event.target;
                                setCheckedSupplierCerts((prev) => checked ? [...prev, name] : prev.filter((item) => item !== name));
                            }}
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
                <TextField 
                    size="small" 
                    fullWidth 
                    placeholder="Country/Region"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#F2F2F2", "& fieldset": { borderRadius: "20px", border: "1px solid darkgrey" }, "&:hover fieldset": { border: "1px solid darkgrey" }, "&.Mui-focused fieldset": { border: "1px solid darkgrey" } } }}
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
                <FormGroup sx={{ mt: 2 }}>
                    {displayedLocations.map((loc) => (
                        <FormControlLabel
                            key={loc}
                            control={
                                <Checkbox
                                    name={loc}
                                    checked={checkedLocations.includes(loc)}
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
                            mt: 1,
                            color: "primary.main",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "0.85rem"
                        }}
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
                            checked={stockInUSA}
                            onChange={(e) => setStockInUSA(e.target.checked)}
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

        </>
    )
}

export default FilteredSidebar;