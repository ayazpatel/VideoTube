import { getVideoDurationInSeconds } from 'get-video-duration';

const videoPath = '../../public/temp/test.mp4';

// From a local path
getVideoDurationInSeconds(videoPath)
.then((duration) => {
  console.log(duration);
})
.catch((error) => {
  console.error(error);
});