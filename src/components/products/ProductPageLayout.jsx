import { Box } from "@mui/material";
import FilteredSidebar from "./FilteredSidebar";
import ProductList from "./ProductList";
import { useState } from "react";

const ProductPageLayout = () => {
    const [filters, setFilters] = useState({});

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <Box display="flex" sx={{ width: "90%" }}>
            <Box width="320px" p={2} sx={{
                border: '1px solid #ccc', borderRadius: 2, padding: 2, marginTop: 2,
                height: "fit-content"
            }}>
                <FilteredSidebar onFiltersChange={handleFiltersChange} />
            </Box>

            <Box flex={1} p={2}>
                <ProductList />
            </Box>
        </Box>
    )
}

export default ProductPageLayout;