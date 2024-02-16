const {
  fetchWebApi,
  getTopTracks,
  getArtistTopTracks,
  printTopTracks,
} = require("../get-songs");
const axios = require("axios");

jest.mock("axios");

describe("fetchWebApi", () => {
  it("fetches data from the Spotify Web API", async () => {
    const mockedData = { data: "mocked data" };
    axios.mockResolvedValueOnce(mockedData);

    const result = await fetchWebApi("test-endpoint", "GET");
    const token = process.env.SPOTIFY_TOKEN;

    expect(result).toEqual("mocked data");
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://api.spotify.com/test-endpoint",
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
        method: "GET",
      })
    );
  });
});

describe("getTopTracks", () => {
  it("retrieves the top tracks listened by the user", async () => {
    const mockedData = {
      items: [
        { name: "Track 1", artists: [{ name: "Artist 1" }] },
        { name: "Track 2", artists: [{ name: "Artist 2" }] },
      ],
    };
    jest.spyOn(global, "fetchWebApi").mockResolvedValueOnce(mockedData);

    const result = await getTopTracks();

    expect(result).toEqual([
      { name: "Track 1", artists: [{ name: "Artist 1" }] },
      { name: "Track 2", artists: [{ name: "Artist 2" }] },
    ]);
  });
});

describe("getArtistTopTracks", () => {
  it("retrieves the top tracks of a given artist", async () => {
    const mockedData = {
      tracks: [{ name: "Artist Track 1" }, { name: "Artist Track 2" }],
    };
    jest.spyOn(global, "fetchWebApi").mockResolvedValueOnce(mockedData);

    const result = await getArtistTopTracks("artistId");

    expect(result).toEqual([
      { name: "Artist Track 1" },
      { name: "Artist Track 2" },
    ]);
  });
});

// A função printTopTracks é uma função de console e pode ser difícil de testar diretamente.
// Uma abordagem comum é capturar a saída do console e validar se ela contém as informações esperadas.

// No entanto, se você deseja testar a função de forma mais abrangente, você pode quebrá-la em partes menores
// e testar essas partes individualmente.
