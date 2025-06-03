import { Box, Typography } from "@mui/material";
import { useCategory } from "../context/CategoryContext";

const CategorySection = () => {
    const { selectedCategory, productsNumber } = useCategory();

    return (
        <Box
            display="flex"
            alignItems="flex-start"
            sx={{
                width: "75%",
                mt: 4,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: "320px",
                    height: "fit-content",
                    flexShrink: 0,
                    mt: 2
                }}
            >
                <Typography fontSize={18} display="inline" mr={1}>
                    {selectedCategory?.name === "All Categories" ? "Products" : selectedCategory?.name}
                </Typography>
                <Typography fontSize={18} display="inline" color="#7F8CAA">
                    {`(${productsNumber} Products)`}
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    mt: 0,
                    pl: 1,
                    display: "flex",
                    alignItems: "center",
                    mt: 2
                }}
            >
                <Typography display="inline" sx={{ color: "#7F8CAA", mr: 1 }}>
                    Buy
                </Typography>
                <Typography display="inline" color="#29B574">
                    {selectedCategory?.name === "All Categories" ? "" : `/ ${selectedCategory?.name}`}
                </Typography>
            </Box>

            <Box
                sx={{
                    background: "linear-gradient(to right,rgb(4, 221, 167),rgb(0, 121, 201))",
                    p: 1,
                    px: 7,
                    borderRadius: 3,
                    flexShrink: 0,
                    minWidth: "fit-content"
                }}
            >
                <Typography sx={{ color: "white" }}>
                    Placing bulk orders on BuyHive is Safe & easy
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white"
                    }}
                >
                    Click to learn how it works!
                </Typography>
            </Box>
        </Box>
    );
};

export default CategorySection;