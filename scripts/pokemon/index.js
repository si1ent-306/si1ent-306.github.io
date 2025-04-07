async function fetchData(e) {
    e.preventDefault();
    try {
        const pokemonName = $("#pokemonName").val().toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        const $pokemonCard = $('#pokemonCard');
        const $imgElement = $("#pokemonImage");
        const $displayName = $("#pokemonDisplayName");
        const $typesList = $("#pokemonTypes");
        const $height = $("#pokemonHeight");
        const $weight = $("#pokemonWeight");
        const $id = $("#pokemonID");
        const $abilities = $("#pokemonAbilities");

        console.log(response.status)

        if(response.status === 404){
            $pokemonCard.hide();
            $('#couldntfind').show();
        }else{
            $('#couldntfind').hide();
        }

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        console.log(data);



        $displayName.text(data.name.toUpperCase());
        $imgElement.attr("src", data.sprites.front_default);
        $id.text('Pokemon ID: ' + data.id);

        $typesList.empty().text('Types\n');
        $abilities.empty().text('Abilities\n');

        $.each(data.types, function (index, type) {
            $("<li>").text(type.type.name).addClass(type.type.name.toLowerCase()).appendTo($typesList);
        });

        $height.text('Height: ' + data.height * 10 + 'cm');
        $weight.text('Weight: ' + data.weight + 'kg');

        $.each(data.abilities, function (index, ability) {
            $("<li>").text(ability.ability.name).appendTo($abilities);
        });

        $imgElement.show();
        $displayName.show();
        $typesList.show();
        $height.show();
        $weight.show();
        $id.show();
        $abilities.show();
        $pokemonCard.show();

    } catch (error) {
        console.error(error);
    }
}


// Also trigger fetchData when clicking the button
$("button").click(fetchData);

