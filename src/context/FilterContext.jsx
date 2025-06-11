import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        minPrice: 0,  
        maxPrice: 5000,  
        moq: '',
        selectedCertifications: [],
        selectedSupplierCertifications: [],
        selectedManufacturerLocations: [],
        stockInUSA: false
    });

    const updateFilters = (newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    };

    const resetFilters = () => {
        setFilters({
            minPrice: 0,
            maxPrice: 2400,
            moq: '',
            selectedCertifications: [],
            selectedSupplierCertifications: [],
            selectedManufacturerLocations: [],
            stockInUSA: false
        });
    };

    return (
        <FilterContext.Provider value={{
            filters,
            updateFilters,
            resetFilters
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};