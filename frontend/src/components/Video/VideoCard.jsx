import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-100 shadow-sm border-0 video-card">
      <div className="card-img-container">
        <Card.Img 
          variant="top" 
          src={video.thumbnail} 
          alt={video.title}
          className="card-img-top"
          loading="lazy"
        />
        <div className="video-duration">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="h6 mb-2 lh-sm">
          <Link 
            to={`/video/${video._id}`} 
            className="text-decoration-none text-dark stretched-link"
            title={video.title}
          >
            {video.title.length > 70 ? `${video.title.substring(0, 70)}...` : video.title}
          </Link>
        </Card.Title>
        
        <Card.Text className="text-muted small mb-1">
          <Link 
            to={`/channel/${video.owner?.username}`} 
            className="text-decoration-none text-muted position-relative"
            style={{ zIndex: 2 }}
          >
            {video.owner?.fullName}
          </Link>
        </Card.Text>
        
        <Card.Text className="text-muted small mt-auto mb-0">
          {formatViews(video.views)} views • {formatDistanceToNow(new Date(video.createdAt))} ago
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default VideoCard;
