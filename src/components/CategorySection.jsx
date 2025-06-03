import { Box, Typography } from "@mui/material";
import { useCategory } from "../context/CategoryContext";

const CategorySection = () => {
        const { selectedCategory, productsNumber } = useCategory();

    return (
        <Box display="flex" sx={{ width: "73%", mt: 2 }}>
            <Box width="320px" sx={{ height: "fit-content", pr: 2 }}>
                <Typography display="inline" mr={1}>{selectedCategory?.name === "All Categories" ? "Products" : selectedCategory?.name}</Typography>
                <Typography display="inline" color="#7F8CAA" >{`(${productsNumber} Products)`}</Typography>
            </Box>

            <Box flex={1} sx={{ mt: 1, pl: 1 }}>
                <Typography display="inline" sx={{ color: "#7F8CAA", mr: 1 }}>Buy</Typography>
                <Typography display="inline" color="#29B574">{selectedCategory?.name === "All Categories" ? "" : `/ ${selectedCategory?.name}`}</Typography>
            </Box>
        </Box>
    );
};

export default CategorySection;
