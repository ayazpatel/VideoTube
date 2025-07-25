import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchVideos } from '../../store/slices/videoSlice';
import VideoCard from '../../components/Video/VideoCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, isLoading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(fetchVideos({ page: 1, limit: 12 }));
  }, [dispatch]);

  console.log('🏠 Home component - videos:', videos, 'isLoading:', isLoading, 'error:', error);

  if (isLoading) {
    return <LoadingSpinner text="Loading videos..." />;
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          Error loading videos: {error}
        </div>
      </Container>
    );
  }

  // Ensure videos is an array
  const videoList = Array.isArray(videos) ? videos : [];

  return (
    <>
      <Helmet>
        <title>VideoTube - Home</title>
        <meta name="description" content="Watch and share videos on VideoTube" />
      </Helmet>
      
      <Container fluid className="mt-3">
        <Row className="g-0 mb-3">
          <Col>
            <h1 className="mb-0 px-3 h4">Latest Videos</h1>
          </Col>
        </Row>
        
        <Row className="video-grid g-2 px-2">
          {videoList.length > 0 ? (
            videoList.map((video) => (
              <Col 
                key={video._id} 
                xs={6} 
                sm={6} 
                md={4} 
                lg={3} 
                xl={2} 
                className="mb-3"
              >
                <VideoCard video={video} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="text-center py-5">
                <h3 className="h5">No videos found</h3>
                <p className="text-muted small">Be the first to upload a video!</p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Home;
