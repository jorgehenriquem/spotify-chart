const axios = require("axios").default;
require("dotenv").config();

/**
 * Fetches data from the Spotify Web API.
 *
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {string} method - The HTTP method to use for the request.
 * @returns {Promise<object>} - A promise that resolves to the fetched data.
 */
async function fetchWebApi(endpoint, method) {
  const token = process.env.SPOTIFY_TOKEN;
  const res = await axios(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
  });
  return res.data;
}

/**
 * Retrieves the top tracks listened by the user.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of top tracks.
 */
async function getTopTracks() {
  const topTracks = (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;

  return topTracks.filter((track) => {
    const isBrazilian = track.artists.some((artist) =>
      artist.external_urls.spotify.includes("/artist/6mdiAmATAx73kdxrNrnlao")
    );
    return !isBrazilian;
  });
}

/**
 * Retrieves the top tracks of a given artist.
 *
 * @param {string} artistId - The ID of the artist.
 * @returns {Promise<Array>} - A promise that resolves to an array of top tracks of the artist.
 */
async function getArtistTopTracks(artistId) {
  return (
    await fetchWebApi(`v1/artists/${artistId}/top-tracks?market=BR`, "GET")
  ).tracks;
}

/**
 * Prints the user's top tracks and the most recent tracks of the respective artists.
 */
async function printTopTracks() {
  const topTracks = await getTopTracks();
  console.log("\x1b[35m%s\x1b[0m", "Top Tracks:");
  topTracks?.forEach(({ name, artists }) => {
    console.log(
      `- \x1b[36m%s\x1b[0m`,
      `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    );
  });

  console.log("\n");

  for (const track of topTracks) {
    console.log(`\x1b[35m%s\x1b[0m`, `Top tracks by ${track.artists[0].name}:`);
    const artistTopTracks = await getArtistTopTracks(track.artists[0].id);
    artistTopTracks?.forEach(({ name }) => {
      console.log(`- \x1b[36m%s\x1b[0m`, `${name}`);
    });
    console.log("\n");
  }
}

printTopTracks();
