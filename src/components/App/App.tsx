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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  const [movies, setMovies] = useState<Movie[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    openModal();
  };

  const handleSearch = async (searchQuery: string) => {
    setMovies([]);
    setIsLoading(true);
    setIsError(false);

    try {
      const { results } = await fetchMovies({ query: searchQuery });

      if (results.length === 0) {
        toast.error('No movies found for your request.');
        return;
      }

      setMovies(results);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
