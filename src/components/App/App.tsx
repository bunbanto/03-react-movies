import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  const [movies, setMovies] = useState<Movie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movieId: number) => {
    const result = movies.find(movie => movie.id === movieId);
    if (result) {
      setSelectedMovie(result);
    }
    openModal();
  };

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoad(true);
    setIsError(false);
    try {
      const data = await fetchMovies({ query });
      if (data.length == 0) {
        throw new Error('No movies found for your request.');
      }
      setMovies([...data]);
    } catch (error) {
      toast.error(`${error}`);
      setIsError(true);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {isLoad && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
