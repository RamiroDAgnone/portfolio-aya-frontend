export const PAGE_RULES = {
    "home": {
        singleImage: true,
        gallery: true,
        videos: false
    },
    "la-dupla": {
        singleImage: false,
        gallery: true,
        videos: false,
        maxGraphics: 5
    },
    "lado-b": {
        singleImage: true,
        gallery: false,
        videos: false
    },
    "en-construccion": {
        singleImage: true,
        gallery: true,
        videos: false
    },
    default: {
        singleImage: true,
        gallery: true,
        videos: true,
        maxGraphics: Infinity
    }
};