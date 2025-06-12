import { useMediaQuery, useTheme, Box } from '@mui/material';
import FilteredSidebar from "./FilteredSidebar";
import ProductList from "./ProductList";
import { useState } from "react";

const ProductPageLayout = ({ onProductClick }) => {
    const [filters, setFilters] = useState({});

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const theme = useTheme();
    const isWideScreen = useMediaQuery('(min-width:1023px)');

    return (
        <Box display="flex" sx={{ width: { xs: "91%", md: "91%", lg: "77%" }, mx: "auto" }}>
            {isWideScreen && (
                <Box width="24%" p={2} sx={{  // width=320px
                    border: '1px solid #ccc', borderRadius: 2, padding: 2, marginTop: 2,
                    height: "fit-content"
                }}>
                    <FilteredSidebar onFiltersChange={handleFiltersChange} />
                </Box>
            )}
            <Box flex={1} p={2}>
                <ProductList onProductClick={onProductClick} />
            </Box>
        </Box>
    );
};

export default ProductPageLayout;