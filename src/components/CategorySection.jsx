import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCategory } from "../context/CategoryContext";

const CategorySection = () => {
    const { selectedCategory, productsNumber } = useCategory();
    const theme = useTheme();
    
    // Custom breakpoint at 1024px
    const isAbove1024 = useMediaQuery('(min-width:1022px)');

    return (
        <Box
            display="flex"
            flexDirection={isAbove1024 ? "row" : "column"}
            alignItems={isAbove1024 ? "flex-start" : "stretch"}
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
                    width: isAbove1024 ? "320px" : "100%",
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

            {/* Breadcrumb */}
            <Box
                sx={{
                    flex: 1,
                    pl: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    width: isAbove1024 ? "auto" : "100%",
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
                    width: isAbove1024 ? "auto" : "100%",
                    mt: isAbove1024 ? 0 : 2,
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