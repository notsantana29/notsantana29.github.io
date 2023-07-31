# notsantana29.github.io

# UIUC CS 416 Data Visualization - Narrative Visualization

This repository contains the narrative visualization project developed for UIUC CS 416 Data Visualization course. The project aims to explore and analyze movie data sourced from IMDB.com, focusing on how movies are perceived by viewers and their performance at the box office.

## Webpage and Repository Links

- Webpage: [notsantana29.github.io](https://notsantana29.github.io)
- Repository: [https://github.com/notsantana29/notsantana29.github.io](https://github.com/notsantana29/notsantana29.github.io)

## Review Criteria

### Messaging

The narrative visualization explores questions about movies, viewers' perceptions, and box office performance. The primary message is to highlight that movies, especially the best ones, have not significantly improved or deteriorated on average over time. However, there is a recency bias in platforms that catalog movies, leading to higher ratings for recent films. Additionally, while movies may be earning more at the box office, accounting for inflation may present a different perspective.

### Narrative Structure

The narrative visualization follows the interactive slide show approach. The user is guided through three slides that analyze the movie data, supporting the message mentioned above.

### Visual Structure

Each scene in the narrative visualization uses a visual structure that focuses on the central area of the screen. Two banners, one above and one below, frame the visualization and analysis, drawing the viewer's attention to the critical elements of the data. The visualization is placed on the left side to allow users to form their opinions before reading the analysis. Tooltips are provided to offer additional details, and the first visualization allows filtering to gain a better understanding of the data spread.

### Scenes

1. **Scatterplot of Movies**: Compares gross earnings to meta ratings, color-coded and filterable by decade. This scene allows users to understand the data spread, the lack of correlation between earnings and ratings, the upward trend of gross earnings over time, and the higher number of data points from recent decades. The insights from this scene lead to the next two scenes.

2. **Bar Chart of Total Gross Earnings**: Displays the total gross earnings decade by decade, indicating a continuous increase in earnings both on an aggregate and individual film basis, as shown in the annotations.

3. **Line Graph of Film Counts by Decade**: Illustrates the higher number of recent films in the dataset, suggesting a recency bias. Annotations in the second and third scenes reveal that average ratings remain relatively constant across decades.

### Annotations

Annotations in the narrative visualization follow a consistent structure. Boxes are displayed on points in the scatterplot, bars in the bar chart, or points on the line graph. These boxes present either individual statistics in the case of the first scene or aggregate statistics in the case of the second and third scenes. The annotations support the messaging by reinforcing the idea that earnings are rising while ratings remain consistent.

### Parameters and States

Decades are color-coded consistently throughout all scenes to help users recognize the same time periods. In the first scene, users can filter the scatter plot by decade using a dropdown, allowing them to interact with the visualization.

### Triggers and User Affordances

Users can switch between scenes using buttons located at the bottom of the screen. Additionally, they can return to the start of the visualization using the home button at the top right of the screen. However, this navigation just switches between HTML files.

In the first scene, users can interact with the scatter plot by filtering data based on decades through the dropdown menu.
