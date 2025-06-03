import { Box, Button, Typography } from "@mui/material";
import logo from "../assets/bh-logo-blue-n.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import dropdown from "../assets/drop_down.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/');
    }  

    return (
        <Box component="nav" marginBottom={2} display="flex" alignItems="center" padding="1rem" sx={{ width: "73%" }}>
            <Box display="flex" alignItems="center" flexGrow={1} >
                <Box component="img" src={logo} alt="Logo" sx={{ height: 55, marginRight: 4, marginTop: 2 }} />

                {/* Nav Buttons */}
                <Box display="flex" gap={3} marginTop={2} >
                    <Button color="inherit" sx={{ textTransform: 'none' }}>Expert Sourcing</Button>
                    <Button color="inherit" sx={{ textTransform: 'none' }}>Contract Manufacturing</Button>
                    <Button sx={{ color: "#00B2C9", fontWeight: "bold", textTransform: "none" }}>Buy</Button>
                    <Button color="inherit" sx={{ textTransform: 'none' }}>Financing</Button>

                    {/* Dropdown for About Us */}
                    <Box sx={{ position: "relative", "&:hover .dropdown": { display: "block" } }}>
                        <Button sx={{ textTransform: 'none' }} color="inherit" 
                        // endIcon={<ArrowDropDownIcon />}
                        >
                            About Us
                            <img src={dropdown} alt="dropdown icon" style={{ width: "15px", marginLeft: "10px", flexShrink: "0"}}/>
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

                <Box marginLeft="auto" marginTop={2} >
                    <Button variant="outlined" onClick={handleLogout} sx={{ textTransform: "none", borderRadius: "16px", border: "1px solid #00B2C9", color: "#00B2C9" }}>Log out</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Navbar;