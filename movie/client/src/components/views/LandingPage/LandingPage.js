import React, {useEffect, useState} from 'react'
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../Config';
import MainImage from './Sections/MainImage';
import GridCard from "../Commons/GridCard";
import {Row} from 'antd';

function LandingPage() {


  const [Movies, setMovies] = useState([])
  const [MainMovieImage, setMainMovieImage] = useState(null)
  const [CurrentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    fetchMovies(endpoint)
  }, [])

  const fetchMovies = (endpoint) => {
    fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        // setMovies([...response.results])
        // 이렇게 작성하면 "Load More" 버튼을 클릭시 최초 로드된 위치에 데이터들이 덮어져 버림.
        // 최초 로드된 위치의 아래에 계속 해서 페이지를 렌더링 시키고 싶다면 " setMovies([...Movies, ...response.results])" 이렇게 사용
        setMovies([...Movies, ...response.results])
        setMainMovieImage(response.results[0])
        setCurrentPage(response.page)
      })
  }

  const loadMoreItems = () => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
    fetchMovies(endpoint)
  }

  return (
    <div style={{width: '100%', margin: '0'}}>

      {/* Main Image */}
      {MainMovieImage &&
      <MainImage
        image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
        title={MainMovieImage.original_title}
        text={MainMovieImage.overview}
      />
      }


      <div style={{width: '85%', margin: '1rem auto'}}>

        <h2>Movies by latest</h2>
        <hr/>

        {/* Movie Grid Cards */}

        <Row gutter={[16, 16]}>

          {Movies && Movies.map((movie, index) => (
            <React.Fragment key={index}>
              <GridCard
                landingPage
                image={movie.poster_path ?
                  `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}
                movieId={movie.id}
                movieName={movie.original_title}
              />
            </React.Fragment>
          ))}

        </Row>

      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={loadMoreItems}> Load More</button>
      </div>

    </div>
  )
}

export default LandingPage
