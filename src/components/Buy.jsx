import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import ProductPageLayout from "./products/ProductPageLayout";
import Footer from "./Footer";


const Buy = () => {

    return (
        // <h1>Huy</h1>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Navbar />
            <Searchbar />
            <ProductPageLayout />
            <Footer />
        </Box>
    )
}

export default Buy;