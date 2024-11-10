import React from "react";
import SearchBar from "@/components/search/SearchBar";

type SearchQuery = {
    query: string;
}

const ParentComponent = ({query}: SearchQuery) => {
    const handleSearch = async (query) => {
      // You can perform your search logic here
      // For example, calling an API or filtering local data
      try {
        // Example API call
        const response = await fetch(`your-api-endpoint?search=${query}`);
        const results = await response.json();
        console.log('Search results:', results);
        // Do something with the results
      } catch (error) {
        console.error('Search error:', error);
      }
    };
  
    return (
      <SearchBar search={handleSearch} />
    );
  };

export default ParentComponent;