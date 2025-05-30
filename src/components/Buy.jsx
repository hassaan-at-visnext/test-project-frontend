import { Box } from "@mui/material";
import { useState } from "react";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import ProductPageLayout from "./products/ProductPageLayout";
import Product from "./products/Product";
import Footer from "./Footer";

const Buy = () => {
    const [selectedProductId, setSelectedProductId] = useState(null);

    const handleProductClick = (productId) => {
        setSelectedProductId(productId);
    };

    const handleBackToProducts = () => {
        setSelectedProductId(null);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Navbar />
            <Searchbar />
            {selectedProductId ? (
                <Product 
                    productId={selectedProductId} 
                    onBackToProducts={handleBackToProducts}
                />
            ) : (
                <ProductPageLayout onProductClick={handleProductClick} />
            )}
            <Footer />
        </Box>
    );
};

export default Buy;