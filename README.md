### Threejs Assignment

This Git repository contains unoptimized Three.js code that renders real-time satellite positions using Two-Line Element Sets (TLEs) and the satellite.js library.
The assignment's objective is to submit a pull request with optimized code that achieves a smooth 60 FPS rendering while providing an optional bonus for implementing tooltips displaying satellite names upon hover.
Your mission is to enhance the performance and user experience of this interactive satellite visualization.

#### Setup

```bash
# fork and clone the repo
cd threejs-assignment
npm i
npm run dev
```

#### Links

- [Celestrak](https://celestrak.org/)
- [TLE](https://en.wikipedia.org/wiki/Two-line_element_set)
- [satellite.js](https://github.com/shashwatak/satellite-js)

##Vedant Tilwani##

####Process:####
1. Create instanced mesh
2. Reduce widthSegment and hightSegment where ever possible
3. Reduce statements in loop
4. Turned off antialias (although the antialias is enabled in this case)
5. Add Ray casting
6. Find the point of intersection between the ray and the satellite, find the point of intersection
7. Calcualte the instance ID, show its name by manipulating the HTML dom

####Recreation Setup:####
1. Browser - Google Chrome
2. OS - Windows
3. RAM - 16GB

####Screenshots:####
![60FPS Screenshot](digantara_60fps.png)
![Tooltip 60FPS Screenshot](digantara_60fps_tooltip.jpg)

####Video####
Please see the video digantara_demo for demo