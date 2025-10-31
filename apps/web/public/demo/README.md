# Demo Assets

This directory contains demo assets for the ShoeParadise application.

## Hero 3D Shoe Viewer + Mini Cart Demo

### Placeholder for Animated Demo

To generate an animated demo GIF:

1. **Using Playwright**:
   ```bash
   # Install Playwright
   pnpm add -D @playwright/test
   
   # Create a test that records video
   # See Playwright trace viewer documentation
   ```

2. **Using ffmpeg** (for screen recording):
   ```bash
   # Record screen
   ffmpeg -f x11grab -s 1920x1080 -i :0.0 -t 10 demo.mp4
   
   # Convert to GIF
   ffmpeg -i demo.mp4 -vf "fps=10,scale=800:-1:flags=lanczos" demo.gif
   ```

3. **Manual Recording**:
   - Use screen recording software (QuickTime, OBS, etc.)
   - Navigate to homepage and interact with 3D viewer
   - Add items to cart and open mini-cart drawer
   - Convert video to optimized GIF

### Expected Demo Content

The demo should showcase:
- 3D shoe viewer on homepage with rotation and zoom
- Add to cart interaction
- Mini cart drawer sliding in from the right
- Cart item count updating
- Smooth animations with Framer Motion

Place the final `demo.gif` file in this directory.
