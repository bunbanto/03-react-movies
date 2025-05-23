import css from './MovieModal.module.css';
import { useEffect, useCallback } from 'react';
import type { Movie } from '../../types/movie';
import { createPortal } from 'react-dom';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const handleBackDropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    function handleEscKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (movie == null) {
    return createPortal(
      <div
        onClick={handleBackDropClick}
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
      >
        <div className={css.modal}>
          <button
            onClick={onClose}
            className={css.closeButton}
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className={css.content}>
            <h2>Oops!, something gonna wrong.</h2>
            <p>No movie data available.</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }
  return createPortal(
    <div
      onClick={handleBackDropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(2)}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
