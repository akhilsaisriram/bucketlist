
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from "antd";
import './Test.css';

const Auto_comp = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const autocompleteRef = useRef(null);
  const API_KEY = 'MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH'; // Replace with your actual API key
  const API_URL = `https://api.olamaps.io/places/v1/autocomplete`;

  // Function to fetch autocomplete suggestions
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          input: query,
          api_key: API_KEY,
        },
      });
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelect = (suggestion) => {
    setInput(suggestion.description);
    setSuggestions([]);
    console.log(suggestion)
    if (onSelect) {
      onSelect(suggestion.description, suggestion.geometry.location); // Pass the selected value to the parent
    }
  };

  // Handle clicks outside the component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete" ref={autocompleteRef}>
      <Input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search for a place..."
        className="autocomplete-input"
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="autocomplete-suggestion"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Auto_comp;
