import { Box, Typography, useMediaQuery, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { useCategory } from "../context/CategoryContext";
import FilteredSidebar from "./products/FilteredSidebar";

const CategorySection = () => {
    const { selectedCategory, productsNumber } = useCategory();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // Custom breakpoint at 1022px
    const isAbove1022 = useMediaQuery('(min-width:1022px)');

    const handleToggleFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };

    return (
        <Box
            display="flex"
            flexDirection={isAbove1022 ? "row" : "column"}
            alignItems={isAbove1022 ? "flex-start" : "stretch"}
            sx={{
                width: { xs: "91%", md: "91%", lg: "77%" },
                mx: "auto",
                mt: 4,
                gap: 2,
            }}
        >
            {/* Category Name */}
            <Box
                sx={{
                    width: isAbove1022 ? "320px" : "100%",
                    flexShrink: 0,
                    mt: 2,
                }}
            >
                <Typography fontSize={18} display="inline" mr={1}>
                    {selectedCategory?.name === "All Categories" ? "Products" : selectedCategory?.name}
                </Typography>
                <Typography fontSize={18} display="inline" color="#7F8CAA">
                    {`(${productsNumber} Products)`}
                </Typography>
            </Box>

            {/* Show Filters Button - Only visible on mobile when filters are hidden */}
            {!isAbove1022 && (
                <Box sx={{ width: "100%", mt: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleToggleFilters}
                        sx={{
                            border: "1px solid darkgrey",
                            borderRadius: 10,
                            py: 1.5,
                            color: "text.primary",
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: "normal",
                            "&:hover": {
                                border: "1px solid darkgrey",
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                    >
                        {showMobileFilters ? "Close Filters" : "Show Filters"}
                    </Button>
                    
                    {/* Mobile Filters Dropdown */}
                    <Collapse in={showMobileFilters}>
                        <Box
                            sx={{
                                mt: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: "white",
                            }}
                        >
                            <FilteredSidebar />
                        </Box>
                    </Collapse>
                </Box>
            )}

            {/* Breadcrumb */}
            <Box
                sx={{
                    flex: 1,
                    pl: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    width: isAbove1022 ? "auto" : "100%",
                }}
            >
                <Typography display="inline" sx={{ color: "#7F8CAA", mr: 1 }}>
                    Buy
                </Typography>
                <Typography display="inline" color="#29B574">
                    {selectedCategory?.name === "All Categories" ? "" : `/ ${selectedCategory?.name}`}
                </Typography>
            </Box>

            {/* Info Box */}
            <Box
                sx={{
                    background: "linear-gradient(to right,rgb(4, 221, 167),rgb(0, 121, 201))",
                    p: 1,
                    px: 7,
                    borderRadius: 3,
                    flexShrink: 0,
                    minWidth: "fit-content",
                    width: isAbove1022 ? "auto" : "100%",
                    mt: isAbove1022 ? 0 : 2,
                }}
            >
                <Typography sx={{ color: "white", textAlign: "center" }}>
                    Placing bulk orders on BuyHive is Safe & easy
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                    }}
                >
                    Click to learn how it works!
                </Typography>
            </Box>
        </Box>
    );
};

export default CategorySection; 