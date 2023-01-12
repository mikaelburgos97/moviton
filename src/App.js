import { useState, useEffect } from "react";
import axios from 'axios';
import YouTube from "react-youtube";
import './App.css'


function App(){
  
  const baseUrl = 'https://api.themoviedb.org/3';
  const apiKey = '8c2b063e3e3a3f79022e564d800d12dd';
  const baseImgUrl = 'https://image.tmdb.org/t/p/original';

  // State varibales;

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState( {title: 'Loading movies'} );
  const [playing, setPlaying] = useState(false);


  // function for a 'GET' call to the API;
  const fetchMovies = async(searchKey) => {
    const type = searchKey ? 'search' : 'discover';
    const {data: { results },
  } = await axios.get(`${baseUrl}/${type}/movie`, {
    params: {
      api_key: apiKey,
      query: searchKey
    }
  })
    setMovies(results)
    setMovie(results[0])

    if(results.length){
      await fetchMovie(results[0].i)
    }
  }

  

  // function to get a movie only and show the youtube player for the trailer
  const fetchMovie = async(id)=> {
    const {data} = await axios.get(`${baseUrl}/movie/${id}`, {
      params: {
        api_key: apiKey,
        append_to_response: 'videos'
      }
    })

    if(data.videos && data.videos.results){
      const trailer = data.videos.results.find(
        (vid) => vid.name === 'Oficial Trailer'
      );
      setTrailer(trailer ? trailer : data.videos.results[0])
    }
    setMovie(data)
  }

  const selectMovie = async(movie) => {
    fetchMovie(movie.id)
    setMovie(movie)
    window.scrollTo(0,0)
  }

  // to search movies 
  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  useEffect(()=> {
    fetchMovies();
  }, [])

  return (
    <div>
      <h2 className="text-center mt-5 mb-5 ">MOVITON</h2>
      {/* Search */}
      <form className="container mb-4" onSubmit={searchMovies}>
        <input type='text' placeholder="Search Movie..." onChange={(e)=> setSearchKey(e.target.value)}/>
        <button className="btn btn-primary">Search</button>
      </form>

      {/* Here will be the banner container and the player */}

      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${baseImgUrl}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* container to show movie */}
      
      <div className="container mt-3">
        <div className="row">
          {movies.map(movie => (
            <div key={movie.id} className='col-md-4 mb-3' onClick={()=> selectMovie(movie)}>
              <img src={`${baseImgUrl + movie.poster_path}`} alt="" height={600} width='100%' />
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App;


{/* 
 */}