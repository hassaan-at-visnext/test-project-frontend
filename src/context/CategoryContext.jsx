import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    const setCategoryOnly = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
    };

    const setCategoryAndSubcategory = (category, subcategory) => {
        setSelectedCategory(category);
        setSelectedSubcategory(subcategory);
    };

    return (
        <CategoryContext.Provider value={{
            selectedCategory,
            selectedSubcategory,
            setCategoryOnly,
            setCategoryAndSubcategory
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);