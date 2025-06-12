import { Box, Button, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material";
import logo from "../assets/bh-logo-blue-n.png";
import menuIcon from "../assets/menu.png"; // import your menu icon
import { PersonOutline } from "@mui/icons-material";
import dropdown from "../assets/drop_down.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import { Drawer } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Navbar = () => {
    const navigate = useNavigate();
    const { logout, firstName } = useAuth();

    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:1020px)');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [aboutOpen, setAboutOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <Box component="nav" marginBottom={2} display="flex" alignItems="center" padding="1rem" sx={{ width: { xs: "95%", md: "95%", lg: "77%" }, mx: "auto" }}>
                <Box display="flex" alignItems="center" flexGrow={1} width="100%">

                    {/* Logo */}
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 55, marginRight: 4, marginTop: 2 }} />

                    {/* Nav Buttons – hidden on small screens */}
                    {!isMobile && (
                        <Box display="flex" gap={3} marginTop={2}>
                            <Button color="inherit" sx={{ textTransform: 'none' }}>Expert Sourcing</Button>
                            <Button color="inherit" sx={{ textTransform: 'none' }}>Contract Manufacturing</Button>
                            <Button sx={{ color: "#00B2C9", fontWeight: "bold", textTransform: "none" }}>Buy</Button>
                            <Button color="inherit" sx={{ textTransform: 'none' }}>Financing</Button>

                            {/* Dropdown */}
                            <Box sx={{ position: "relative", "&:hover .dropdown": { display: "block" } }}>
                                <Button sx={{ textTransform: 'none' }} color="inherit">
                                    About Us
                                    <img src={dropdown} alt="dropdown icon" style={{ width: "15px", marginLeft: "10px", flexShrink: "0" }} />
                                </Button>
                                <Box className="dropdown" sx={{ display: "none", position: "absolute", zIndex: 1100, top: "100%", left: 0, bgcolor: "background.paper", border: "1px solid lightgrey", minWidth: 150, borderRadius: 1 }}>
                                    <Box sx={{ padding: "0.5rem 1rem", cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}>
                                        <Typography variant="body2">Our Story</Typography>
                                    </Box>
                                    <Box sx={{ padding: "0.5rem 1rem", cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}>
                                        <Typography variant="body2">How to Buy</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Right Section */}
                    <Box marginLeft="auto" marginTop={2} display="flex" alignItems="center" gap={1} flexWrap="nowrap">
                        {!isMobile && (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<PersonOutline />}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "20px",
                                        border: "1px solid #00B2C9",
                                        color: "#00B2C9",
                                        minWidth: 40,
                                        px: 2,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {firstName}
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleLogout}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: "20px",
                                        border: "1px solid rgb(4, 221, 167)",
                                        color: "rgb(4, 221, 167)",
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Log out
                                </Button>
                            </>
                        )}

                        {/* Basket icon — always visible */}
                        <IconButton sx={{ color: "rgb(4, 221, 167)", p: 0 }}>
                            <ShoppingBasketOutlinedIcon sx={{ fontSize: 35 }} />
                        </IconButton>

                        {/* Menu icon — only on small screens */}
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)}>
                                <Box component="img" src={menuIcon} alt="Menu" sx={{ width: 28, height: 28 }} />
                            </IconButton>

                        )}
                    </Box>
                </Box>
            </Box>

            {/* Drawer for mobile view */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: '100%',        // Full width (important)
                        height: '100%',       // Full height
                        maxWidth: '100%',     // Prevent MUI from capping width
                        position: 'fixed',
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'white',
                        boxSizing: 'border-box', // Prevent sizing issues
                    }
                }}
            >
                {/* Close Button */}
                <Box display="flex" justifyContent="flex-end" p={2}>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                        <CloseIcon sx={{ color: "rgb(4, 221, 167)", fontSize: 30 }} />
                    </IconButton>
                </Box>

                {/* Add your drawer content below */}
                <Box display="flex" flexDirection="column" p={2} gap={2} ml={3}>
                    <Button color="inherit" sx={{ fontSize: '1.1rem', textTransform: 'none', justifyContent: 'flex-start' }}>
                        Expert Sourcing
                    </Button>
                    <Button color="inherit" sx={{ fontSize: '1.1rem', textTransform: 'none', justifyContent: 'flex-start' }}>
                        Contract Manufacturing
                    </Button>
                    <Button sx={{ fontSize: '1.1rem', color: "#00B2C9", fontWeight: "bold", textTransform: "none", justifyContent: 'flex-start' }}>
                        Buy
                    </Button>
                    <Button color="inherit" sx={{ fontSize: '1.1rem', textTransform: 'none', justifyContent: 'flex-start' }}>
                        Financing
                    </Button>

                    <Box>
                        <Button
                            onClick={() => setAboutOpen(!aboutOpen)}
                            color="inherit"
                            sx={{
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                justifyContent: 'flex-start',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            About Us
                            {aboutOpen ? <ExpandLessIcon sx={{ ml: 1 }} /> : <ExpandMoreIcon sx={{ ml: 1 }} />}
                        </Button>

                        {aboutOpen && (
                            <Box pl={2} display="flex" flexDirection="column" gap={1}>
                                <Button color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                                    Our Story
                                </Button>
                                <Button color="inherit" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                                    How to Buy
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
                {/* Divider Line */}
                <Box sx={{ width: '90%', borderBottom: '1px solid lightgrey', my: 2, mx: "auto" }} />

                {/* Auth Buttons */}
                <Box ml={5} mt={2} display="flex" flexDirection="row" gap={1} >
                    <Button
                        variant="outlined"
                        startIcon={<PersonOutline />}
                        sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            border: "1px solid #00B2C9",
                            color: "#00B2C9",
                            justifyContent: 'flex-start',
                            width: 'fit-content',
                            fontSize: '1rem'
                        }}
                    >
                        {firstName}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            border: "1px solid rgb(4, 221, 167)",
                            color: "rgb(4, 221, 167)",
                            justifyContent: 'flex-start',
                            width: 'fit-content',
                            fontSize: '1rem'
                        }}
                    >
                        Log out
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
