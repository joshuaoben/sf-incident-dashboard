# SF Incident Dashboard
Interactive dashboard for exploring San Francisco public safety incident data. Built by Joshua Olonade as a frontend developer technical assessment.

# How to Run
npm install
npm start

The app opens at http://localhost:3000 and fetches data from the SF Open Data API.

# What I Implemented

## Visualizations
Call Volume Analysis (Bar Chart)
- Shows top 12 most frequent call types
- Click any bar to filter the table to that call type
- Click the same bar again to clear the filter
- Includes tooltips showing call type and count on hover

## Response Performance (Line Chart)
- Displays average response times for each hour of the day (0-23)
- Helps identify when emergency response is fastest/slowest
- Includes tooltips showing exact times on hover

## Data Table
12-column sortable table with:
- Click any header to sort ascending/descending
- Pagination (10 rows per page)
- Updates automatically based on bar chart clicks and filters
- Empty state message when no results match filters

## Filters
Five filter options that work together:
- Search bar (text search across call types)
- Priority dropdown (A/B/C)
- Date range (24h, 7d, 30d, all time)
- Police District dropdown
- Call Type dropdown (only in Call Volume view)

## Metrics
Four summary cards displaying:
- Total number of calls
- Average response time (calculated from received to on-scene timestamps)
- Percentage of high-priority calls
- Most active police district
All metrics update in real-time as filters are applied.

# Design Choices and Assumptions
Two Analysis Views: 
I implemented two distinct views to show different perspectives on the data. Call Volume uses a bar chart for categorical comparison, while Response Performance uses a line chart for time-based patterns.

Client-Side Pagination: 
I set the API fetch limit to 5,000 records as the dataset contains approximately 3,300 current records, and I paginate in the browser for instant page changes. For production systems with larger datasets, I'd implement server-side pagination using the API's offset/limit parameters.

Table Columns: 
The API returns 20+ fields. I chose 12 operationally relevant columns to balance completeness with readability.

Data Quality: 
Some records have invalid or missing datetime fields. I added validation to skip these records rather than crash the app or skew response time calculations. Negative response times (data errors) are also filtered out.

Call Type Filter Placement: 
The call type dropdown only appears in the Call Volume view where it's contextually relevant, users are already looking at call types in the chart.

# AI Usage
I used Claude for documentation lookups, syntax validation, and refreshing best practices across React patterns, chart libraries, and styling approaches. All architectural decisions, component structure, feature selection, and problem-solving approaches were my own.

# Tech Stack
- React
- Recharts for charts
- Vanilla CSS
- SF Open Data API