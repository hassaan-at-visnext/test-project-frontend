import { createContext, useContext, useState, useEffect } from "react";
import { useAuth, authAxios } from "./AuthContext";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    // const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState({ category_id: null, name: "All Categories" });
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [productsNumber, setProductsNumber] = useState(0);
    
    // Categories data state
    const [allCategoriesData, setAllCategoriesData] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    const { isAuthenticated } = useAuth();

    const setCategoryOnly = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
    };

    const setCategoryAndSubcategory = (category, subcategory) => {
        setSelectedCategory(category);
        setSelectedSubcategory(subcategory);
    };

    const setNumberOfProducts = (productsNo) => {
        setProductsNumber(productsNo);
    }

    // Fetch categories data
    useEffect(() => {
        const fetchCategoriesData = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);

            try {
                const API_URI = "http://localhost:5000/api/v1/categories-subcategories"
                const response = await authAxios.get(API_URI);

                const data = response.data;
                if (data.success) {
                    setAllCategoriesData(data.data);
                } else {
                    setCategoriesError('Failed to fetch categories data');
                }
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 409)) {
                    return;
                }
                console.error("Error fetching categories-subcategories: ", err);
                setCategoriesError('Failed to fetch categories data');
            } finally {
                setCategoriesLoading(false);
            }
        }

        if (isAuthenticated) {
            fetchCategoriesData();
        }
    }, [isAuthenticated]);

    return (
        <CategoryContext.Provider value={{
            selectedCategory,
            selectedSubcategory,
            productsNumber,
            allCategoriesData,
            categoriesLoading,
            categoriesError,
            setCategoryOnly,
            setCategoryAndSubcategory,
            setNumberOfProducts
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);