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
    'tapu koko': 'tapukoko',
    'tapu lele': 'tapulele',
    'tapu bulu': 'tapubulu',
    'tapu fini': 'tapufini'
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
    'mene': 'cosmog',
    'minty': 'archeops',
    'sapph': 'glaceon',
    'swed': 'vaporeon',
    'pally': 'lilligant',
    'thirst': 'lilligant'
}

exports.aliases = (id) => {
    console.log(id);
    if (id == 111504456838819840) {
        console.log('returning default');
        return aDefault;
    } else {
        console.log('returning custom');
        return Object.assign(aDefault, custom);
    }
}