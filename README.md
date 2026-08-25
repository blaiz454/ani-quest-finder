# Anime Haven

Build an Anime Discovery Website — "AniVault"

Create a modern anime discovery website called AniVault.

The purpose of this project is to create a real production-style website that we can later deploy, optimize for Google Search, and scale. Build it cleanly and professionally rather than as a simple demo.

Core concept

AniVault lets users discover anime, browse popular and trending titles, search for anime, and open dedicated detail pages containing information about each anime.

Use a modern dark anime-inspired interface with subtle animations, glassmorphism elements, smooth hover effects, and responsive design.

Do NOT make the UI overly complicated. Prioritize performance, readability, and a polished professional appearance.

Data/API

Use the Jikan API (MyAnimeList unofficial API) for anime data and images.

API base:
https://api.jikan.moe/v4

Do not hardcode anime information if it can be retrieved from the API.

Use API data for:

Anime titles

Japanese titles

English titles

Cover images

Large images

Synopsis

Score

Rank

Popularity

Episodes

Status

Aired dates

Genres

Studios

Producers

Season

Year

Rating

Trailer information when available

Handle loading states, API errors, missing images, and missing data gracefully.

Pages

Create the following routes:

Home

/

Include:

Hero section

Featured anime

Trending anime

Popular anime

Top-rated anime

Recently added/relevant anime

Anime genre sections

Search bar

Clear navigation

Search

/search

Allow users to search for anime.

Example:

/search?q=naruto

Display:

Anime image

Title

Score

Year

Episodes

Genres

Short synopsis

Include pagination or a "Load More" mechanism.

Anime details

/anime/:id

Every anime should have its own dedicated page.

For example:

/anime/5114

for Fullmetal Alchemist: Brotherhood.

The detail page should include:

Large anime backdrop/hero image

Anime poster

Title

Japanese title

English title

Synopsis

Score

Rank

Popularity

Episodes

Status

Aired dates

Season

Year

Genres

Studios

Producers

Rating

Trailer if available

Related/recommended anime

Include a "Back to results" or breadcrumb navigation.

Genres

/genres

Display available anime genres.

Clicking a genre should lead to a dedicated page such as:

/genre/action

/genre/romance

/genre/fantasy

etc.

About

/about

Explain what AniVault is and that it is an anime discovery and information platform.

Search engine optimization

This is extremely important.

Build the website with SEO in mind from the beginning.

Every anime detail page must have dynamically generated:

<title>

Meta description

Canonical URL

Open Graph title

Open Graph description

Open Graph image

For example, an anime page should have a title similar to:

"Attack on Titan — Anime Details, Episodes, Score & Information | AniVault"

The description should be generated from the anime's actual information.

Use semantic HTML:

<header>

<nav>

<main>

<section>

<article>

<footer>

Proper <h1>, <h2>, and <h3> hierarchy

Images must have meaningful alt text.

Create:

/robots.txt

and:

/sitemap.xml

The sitemap should include important public pages and be structured so it can later be submitted to Google Search Console.

Do not add noindex to anime detail pages.

Make anime detail pages crawlable and accessible through normal URLs.

Performance

Optimize the website for performance.

Use:

Lazy loading for images where appropriate

Responsive images where possible

Efficient API requests

Loading skeletons

Error boundaries

Minimal unnecessary re-renders

Code splitting where appropriate

Avoid unnecessarily large dependencies

Do not load huge images when smaller versions are sufficient.

UI

Navigation:

AniVault logo

Home

Browse

Genres

Search

Hero section should feature a high-quality anime image and a strong headline such as:

"Discover Your Next Anime Obsession"

Anime cards should show:

Poster

Title

Score

Year

Genre or genres

Cards should have a subtle hover animation and lead to the anime's detail page.

Responsive design

The website must work properly on:

Desktop

Laptop

Tablet

Mobile

Do not simply shrink the desktop design. Make the mobile layout intentionally designed.

Architecture

Keep the code organized.

Use reusable components such as:

Navbar

Footer

AnimeCard

AnimeGrid

Hero

SearchBar

LoadingSkeleton

ErrorState

GenreCard

AnimeDetails

RatingBadge

Keep API logic separated from UI components.

Create a dedicated API/service layer for Jikan requests.

Use environment variables where appropriate.

Important

Do NOT create fake API data as the primary implementation.

The website should actually retrieve anime information and images from Jikan.

Make the application production-ready enough that we can connect it to GitHub and deploy it immediately.

Make the final result feel like a real anime discovery platform rather than a coding tutorial project. Also give it a premium feel and look all the hovers ,hover colors,animations ,motions all that.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/75b9576a-79ea-411f-aa91-50fd3fc6c361).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
