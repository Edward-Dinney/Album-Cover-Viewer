import React, { useState, useEffect } from 'react';


const SpotifyAlbums = () => {
    const [searchInput, setSearchInput] = useState("");
    const [albums, setAlbums] = useState([]);
    const [token, setToken] = useState('');
    const CLIENT_ID = '321e792db2664c6d845dbae3b78c4aec';
    const CLIENT_SECRET = '16b36cb154134831b3c62ab24ceeb620';
    useEffect(() => {
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setToken(data.access_token))
    }, []);
    async function search(){
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
        var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
            .then(response => response.json())
            .then(data => {return data.artists.items[0].id})
        console.log("art:" + artistID);

        var albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit+50', searchParameters)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setAlbums(data.items);
            });
    }

    
    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      };
      const handleSubmit = (event) => {
        event.preventDefault();
        search();
      }
    console.log(albums)
    return (
        <div>
            <h1>Albums Covers</h1>
            
            <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Search Artists" value={searchInput} onChange={handleChange} />
            <button type="submit">Search</button>
            </form>
            <ul>
    {albums.map(album => (
        <li key={album.id}>
            {album.name}
            <img src={album.images[0].url} alt={album.name}/>
        </li>
    ))}
</ul>
        </div>
    );
};

export default SpotifyAlbums;