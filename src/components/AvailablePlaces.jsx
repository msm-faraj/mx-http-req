import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailabePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  async function fetchPlaces() {
    setIsFetching(true);

    try {
      const places = await fetchAvailabePlaces();
      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
        setIsFetching(false);
      });
    } catch (error) {
      setError({ message: error.message || 'My custom error message' });
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message}></Error>;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
