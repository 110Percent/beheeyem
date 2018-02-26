let aDefault = {
    'ho-oh': 'hooh',
    'bounty': 'porygonz-shiny',
    'tech': 'vileplume',
    'lectro': 'noivern',
    'ngb': 'ampharos',
    'amph': 'ampharos-mega',
    'shep': 'ampharos-mega',
    'fable': 'flygon-shiny',
    'thane': 'absol',
    'semper': 'flygon',
    'monk': 'weavile',
    'baru': 'arcanine',
    'ace': 'suicune',
    'quote': 'sableye',
    'stall': 'sableye-mega',
    'surv': 'espeon',
    'josh': 'staraptor',
    'luc': 'lucario',
    'fluffy': 'leafeon',
    'fug': 'rayquaza',
    'sol': 'solrock',
    'cell': 'gengar',
    'dom': 'charizard',
    'hiccup': 'spinda',
    'runtime': 'lapras',
    'curtis': 'reuniclus',
    'type: null': 'typenull',
    'type null': 'typenull',
    'mr. mime': 'mrmime',
    'mr mime': 'mrmime',
    'mime jr.': 'mimejr',
    'mime jr': 'mimejr',
    'necrozma dawn': 'necrozma-dawnwings',
    'necrozma dawn wings': 'necrozma-dawnwings',
    'necrozma-dawn': 'necrozma-dawnwings',
    'necrozma-dawn-wings': 'necrozma-dawnwings',
    'necrozma dusk': 'necrozma-duskmane',
    'necrozma dusk mane': 'necrozma-duskmane',
    'necrozma-dusk': 'necrozma-duskmane',
    'necrozma-dusk-mane': 'necrozma-duskmane',
    'tapu koko': 'tapukoko',
    'tapu lele': 'tapulele',
    'tapu bulu': 'tapubulu',
    'tapu fini': 'tapufini',
    'mene': 'cosmog',
    'tallow': 'zangoose'
}

let custom = {
    'matt': 'meowstic',
    'erebus': 'meowstic',
    'blue': 'popplio',
    'emily': 'luxio',
    'flare': 'flareon',
    'hound': 'houndoom',
    'zytom': 'lurantis',
    'jenn': 'bellossom',
    'skul': 'totodile',
    'orn': 'decidueye-shiny',
    'jordan': 'dewott',
    'minty': 'archeops',
    'sapph': 'glaceon',
    'swed': 'vaporeon',
    'pally': 'lilligant',
    'thirst': 'lilligant'
}

exports.aliases = (id) => {
    let toReturn = {};
    Object.assign(toReturn, aDefault);
    if (id == 111504456838819840) {
        return toReturn;
    } else {
        return Object.assign(toReturn, custom);
    }
}