import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerList from './ContainerList';

const TemplateAPICall = () => {
  // State to store the API data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to call the API
    const fetchData = async () => {
      try {
        // Make the API call using axios

        const response = await axios.get('http://localhost:5001/api/containers');

        setData(response.data); // Store the response data
        setLoading(false);      // Set loading to false after data is fetched
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <ContainerList containers={data.body}/>
    </div>
  );
};

export default TemplateAPICall;
