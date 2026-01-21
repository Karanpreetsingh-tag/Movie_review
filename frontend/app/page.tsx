'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import MovieCard from './components/MovieCard'

/* ================= TYPES ================= */

type Movie = {
  id: string
  title: string
  description: string | null
  release_year: number | null
  image_url: string | null
}

type Review = {
  id: string
  movie_id: string
  rating: number
  comment: string
}

/* ================= COMPONENT ================= */

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [user, setUser] = useState<any>(null)

  const [reviewInputs, setReviewInputs] = useState<{
    [movieId: string]: { rating: number; comment: string }
  }>({})

  /* ================= AUTH ================= */

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  /* ================= DATA FETCH ================= */

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: moviesData } = await supabase.from('movies').select('*')
    const { data: reviewsData } = await supabase.from('reviews').select('*')

    setMovies(moviesData || [])
    setReviews(reviewsData || [])
  }

  /* ================= HELPERS ================= */

  const getReviewsForMovie = (movieId: string) =>
    reviews.filter(r => r.movie_id === movieId)

  const getAverageRating = (movieId: string) => {
    const movieReviews = getReviewsForMovie(movieId)
    if (movieReviews.length === 0) return null

    const total = movieReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )

    return (total / movieReviews.length).toFixed(1)
  }

  /* ================= REVIEW FORM ================= */

  const handleRatingChange = (movieId: string, rating: number) => {
    setReviewInputs(prev => ({
      ...prev,
      [movieId]: {
        rating,
        comment: prev[movieId]?.comment || ''
      }
    }))
  }

  const handleCommentChange = (movieId: string, comment: string) => {
    setReviewInputs(prev => ({
      ...prev,
      [movieId]: {
        rating: prev[movieId]?.rating || 5,
        comment
      }
    }))
  }

  const addReview = async (movieId: string) => {
    if (!user) {
      alert('Please login to submit a review')
      return
    }

    const input = reviewInputs[movieId]
    if (!input || !input.comment) {
      alert('Please write a comment')
      return
    }

    const { error } = await supabase.from('reviews').insert({
      movie_id: movieId,
      rating: input.rating,
      comment: input.comment
    })

    if (error) {
      alert('Error submitting review')
      return
    }

    setReviewInputs(prev => {
      const copy = { ...prev }
      delete copy[movieId]
      return copy
    })

    fetchData()
  }

  /* ================= UI ================= */

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: 'auto' }}>
      <h1>🎬 Movie Review App</h1>

      {/* AUTH INFO */}
      <div style={{ marginBottom: 24 }}>
        {user ? (
          <>
            <p>
              ✅ Logged in as <strong>{user.email}</strong>
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p>❌ You are not logged in</p>
            <a href="/auth">
              <button>Login / Sign Up</button>
            </a>
          </>
        )}
      </div>

      {/* MOVIE CARDS */}
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          reviews={getReviewsForMovie(movie.id)}
          averageRating={getAverageRating(movie.id)}
          ratingValue={reviewInputs[movie.id]?.rating || 5}
          commentValue={reviewInputs[movie.id]?.comment || ''}
          onRatingChange={rating =>
            handleRatingChange(movie.id, rating)
          }
          onCommentChange={comment =>
            handleCommentChange(movie.id, comment)
          }
          onSubmit={() => addReview(movie.id)}
        />
      ))}
    </main>
  )
}
