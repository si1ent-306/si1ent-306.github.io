window.onload = function () {

    const gameInfo = document.getElementById('game-info');

    // Get game ID from the URL
    const pathSegments = window.location.pathname.split('/');
    const gameId = pathSegments[pathSegments.length - 1];

    // Get the current sport from localStorage
    const currentSport = localStorage.getItem('currentSport');

    // Fetch game data
    const options = {method: 'GET'};
    fetch(`http://site.api.espn.com/apis/site/v2/sports/${currentSport}/scoreboard/${gameId}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            // Create container for game details
            const container = document.getElementById('game-container');

            // Get competition data
            const competition = data.competitions[0];
            const homeTeam = competition.competitors[0];
            const awayTeam = competition.competitors[1];

            // Create game header
            const header = document.getElementById('game-header');
            const headerTitle = document.createElement('h1');
            const headerStatus = document.createElement('p');
            headerTitle.innerHTML = data.name
            headerStatus.innerHTML = data.status.type.detail
            header.appendChild(headerTitle);
            header.appendChild(headerStatus);

            // Create scoreboard
            const scoreboard = document.getElementById('game-scoreboard');
            const awayTeamDiv = document.createElement('div');
            const homeTeamDiv = document.createElement('div');

            const awayImg = document.createElement('img');
            awayImg.src = awayTeam.team.logo;
            awayImg.style.width = "30px";
            awayImg.style.height = "30px";
            awayImg.style.marginLeft = "10px";
            const awayScore = document.createElement('p');
            awayScore.innerHTML = awayTeam.score;
            awayTeamDiv.appendChild(awayImg);
            awayTeamDiv.appendChild(awayScore);

            const homeImg = document.createElement('img');
            homeImg.src = homeTeam.team.logo;
            homeImg.style.width = "30px";
            homeImg.style.height = "30px";
            homeImg.style.marginRight = "10px";
            const homeScore = document.createElement('p');
            homeScore.innerHTML = homeTeam.score;
            homeTeamDiv.appendChild(homeImg);
            homeTeamDiv.appendChild(homeScore);

            scoreboard.appendChild(awayTeamDiv);
            scoreboard.appendChild(homeTeamDiv);
            // Create venue information
            const venueStuff = document.getElementById('venue-stuff');
            venueStuff.innerHTML = competition.venue.fullName + ", " + competition.venue.address?.city || '' + " " + competition.venue.address?.state || '';



            // Assemble all elements
            container.appendChild(header);
            container.appendChild(scoreboard);
            container.appendChild(venueStuff);


            gameInfo.innerHTML = '';
            gameInfo.appendChild(container);
        })
        .catch(err => {
            console.error('Error fetching game details:', err);
        });
}