# Test Files Directory

This directory should contain your test media files for API testing.

## Required Files

### Images (for avatars, covers, thumbnails)
Place these files in the `images/` directory:
- `avatar1.jpg` - Primary test avatar image
- `avatar2.jpg` - Secondary test avatar image  
- `cover1.jpg` - Primary test cover image
- `cover2.jpg` - Secondary test cover image
- `thumbnail1.jpg` - Primary test thumbnail image
- `thumbnail2.jpg` - Secondary test thumbnail image

### Videos
Place these files in the `videos/` directory:
- `test-video1.mp4` - Primary test video file
- `test-video2.mp4` - Secondary test video file

## File Requirements

- **Images**: Should be in JPG or PNG format, reasonable file size (< 5MB)
- **Videos**: Should be in MP4 format, short duration for testing (< 10MB recommended)

## Note

If these files are not found, the test script will create placeholder files automatically, but for proper testing with file uploads, you should provide real media files.

## Example Commands to Add Files

```bash
# Copy your test files to the appropriate directories
cp /path/to/your/avatar.jpg images/avatar1.jpg
cp /path/to/your/cover.jpg images/cover1.jpg
cp /path/to/your/thumbnail.jpg images/thumbnail1.jpg
cp /path/to/your/video.mp4 videos/test-video1.mp4
```
