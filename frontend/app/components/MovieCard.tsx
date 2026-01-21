'use client'

type Review = {
  id: string
  movie_id: string
  rating: number
  comment: string
}

type Movie = {
  id: string
  title: string
  description: string | null
  release_year: number | null
  image_url: string | null
}

type Props = {
  movie: Movie
  reviews: Review[]
  averageRating: string | null
  ratingValue: number
  commentValue: string
  onRatingChange: (rating: number) => void
  onCommentChange: (comment: string) => void
  onSubmit: () => void
}

export default function MovieCard({
  movie,
  reviews,
  averageRating,
  ratingValue,
  commentValue,
  onRatingChange,
  onCommentChange,
  onSubmit
}: Props) {
  return (
    <div style={styles.card}>
      {/* HEADER ROW */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>
            {movie.title}
            {movie.release_year ? ` (${movie.release_year})` : ''}
          </h2>
        </div>

        {movie.image_url && (
          <img
            src={movie.image_url}
            alt={movie.title}
            style={styles.thumbnail}
          />
        )}
      </div>

      <p style={styles.description}>{movie.description}</p>

      <p>
        ⭐ Average Rating:{' '}
        {averageRating ? `${averageRating} / 5` : 'No ratings yet'}
      </p>

      <h4>Reviews</h4>
      {reviews.length === 0 && <p>No reviews yet.</p>}

      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            {'⭐'.repeat(review.rating)}{' '}
            <span style={{ color: '#555' }}>
              ({review.rating}/5) — {review.comment}
            </span>
          </li>
        ))}
      </ul>

      <h4>Add Review</h4>

      <select
        value={ratingValue}
        onChange={e => onRatingChange(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <br /><br />

      <textarea
        placeholder="Write your review..."
        value={commentValue}
        onChange={e => onCommentChange(e.target.value)}
        rows={3}
        style={{ width: '100%' }}
      />

      <br /><br />

      <button onClick={onSubmit}>Submit Review</button>
    </div>
  )
}

/* ================= STYLES ================= */

const styles = {
  card: {
    background: '#ffffff',
    color: '#333',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10
  },
  thumbnail: {
    width: 90,
    height: 130,
    objectFit: 'cover' as const,
    borderRadius: 8,
    flexShrink: 0
  },
  description: {
    color: '#555',
    marginBottom: 10
  }
}
