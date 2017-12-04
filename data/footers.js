const facts = [
    'Prior to Generation VI, Azurill had a small chance of changing its gender upon evolution.',
    'In Pokémon Red and Blue, it was possible to use your fishing rod on statues found in gyms.',
    'A Pikachu caught in Pokémon Yellow and transferred to Stadium will have a different voice actor.',
    'Each Spinda has a unique pattern of spots. There are over 4 billion spot combinations in-game.',
    'Hitmonchan and Hitmonlee are based off actors Jackie Chan and Bruce Lee, respectively.',
    'Magneton weighs more than 10 times a single Magnemite... Despite being made up of three of them.',
    'Arcanine was originally intended to be a legendary Pokémon, but was changed to become more obtainable.',
    'Psychic\'s weaknesses (Ghost, Bug and Dark) are based off people\'s common fears.',
    'The move Splash is called "Hop" in Japan, being why the move is Normal rather than Water-type.'
];

let tips = [
    'Need help? Check out the support server. A link is present on Beheeyem\'s website.',
    'If you like Beheeyem, consider donating to keep it alive! Check out Beheeyem\'s website for more details.',
    'Don\'t recognize any values given? Try using the unit conversion command to translate them.',
    'Beheeyem\'s italicization detector supports shinies! Simply put "shiny " before the pokémon\'s name to get its shiny version.',
    'Have a feature you want to suggest? Visit Beheeyem\'s support server! You can find a link on Beheeyem\'s website.'
];

module.exports = tips.concat(facts.map(f => `Did you know? ${f}`));