import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    // const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState({ category_id: null, name: "All Categories" });
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [productsNumber, setProductsNumber] = useState(0);

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

    return (
        <CategoryContext.Provider value={{
            selectedCategory,
            selectedSubcategory,
            productsNumber,
            setCategoryOnly,
            setCategoryAndSubcategory,
            setNumberOfProducts
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);