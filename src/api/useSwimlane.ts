import { SwimlaneBase } from "./usePage";
import { useJson } from "./utils.fetch";

interface ReturnValue {
    swimlaneItems: SwimlaneItem[] | undefined;
    error: string | undefined;
}

export const useSwimlane = (swimlane: SwimlaneBase | undefined): ReturnValue => {

    const dataUrl = swimlane ? swimlane.link : '';

    const { data, error } = useJson<SwimlaneItem[]>(dataUrl, 5 * 10);

    return { swimlaneItems: data, error };
}

export interface SwimlaneItem {
    id: string;
    name: string;
    imagePackUri: string; // "https://imageservice.rikstv.no/imagepack/5D5A221C673FBBC8E5D5DB4115537DC1.jpg-5D5A221C673FBBC8E5D5DB4115537DC1.jpg-5D5A221C673FBBC8E5D5DB4115537DC1.jpg",
    duration: number; // seconds
    description: string; // "Cathrine (22) er misjonærdatter som søker en kristen kjæreste, og den folkevalgte politikeren Karmjit (31) satser på at daten blir imponert når hun får høre om alle vervene han har. Marianne (48) er en tøff dame som trenger en tøff mann som kan gi motstand.",
    synopsis: string; // "Cathrine (22) er misjonærdatter som søker en kristen kjæreste, og den folkevalgte politikeren Karmjit (31) satser på at daten blir imponert når hun får høre om alle vervene han har. Marianne (48) er en tøff dame som trenger en tøff mann som kan gi motstand.",
    genres: string[]; // ["Underholdning","Reality"]
    originChannel: {
        channelId: number;
        serviceName: string; // "TVNorge",
        sourceName: string; // "TVNorge HD",
        cridAuthority: string; // "rikstv.no",
        baseName: string; // "TvNorge",
        colorCode: string; // "#000000",
        logoUrl: string; //  "https://static.rikstv.no/logopack/TvNorge_kanalinfo.png",
        logoUrlSvg: string; //  "https://static.rikstv.no/logopack/TvNorge.svg",
        logoUrlSvgSquare: string; //  "https://static.rikstv.no/logopack/TvNorge_square.svg",
        _links: {
            logopack: {
                href: "https://static.rikstv.no/logopack/TvNorge_"
            },
            placeholderImage: {
                href: "https://static.rikstv.no/logopack/TvNorge_image.jpg"
            },
            epg: {
                href: "https://api-pt.uat.rikstv.no/client/2/channel/70/epg"
            }
        }
    },
    // relevance: 1,
    // estimatedSeenBy: 0,
    // broadcastedTime: "2021-06-22T01:55:00Z",
    // broadcastedTimeEnd: "2021-06-22T02:55:00Z",
    // publishFromUtc: "2021-06-22T01:55:00Z",
    // publishToUtc: "2021-06-29T01:55:00Z",
    // broadcastId: "333462020150",
    season?: number;
    episode?: number;
    episodeCount: number;
    seriesId: string; // "333462",
    productionYear: number;
    productionCountry: "NO";
    availableEpisodes: number;
    availableSeasons: number;
    externalGenres: string[]; // ["Underholdning","Reality"]
    titleType: "Linear";
    creditsStartTime: number; // seconds
    seasonDescription: string;
    seriesName: string;
    programType: "Underholdning";
    externalAssetId: string; // "1_universum.307.42168",
    isJunior: boolean;
    inCatchupArchive: boolean;
    startOverExpiryTime: string; // "2021-06-22T03:55:00Z",
    insideTheHomeAvailability: {
        type: "Always"
    };
    everywhereAvailability: {
        type: "Always"
    };
    onDemandFormat: "Subscription";
    streamingMode: "OnDemand";
    _links: {
        details: {
            href: string; // "https://api-pt.uat.rikstv.no/client/2/title/11299733"
        };
        series?: {
            href: string; // "https://api-pt.uat.rikstv.no/client/2/series/333462/"
        };
        nextEpisode: {
            href: string; // "https://api-pt.uat.rikstv.no/client/2/title/11301628"
        };
        wish: {
            href: string; // "https://api-pt.uat.rikstv.no/client/2/mylist/series/333462"
        };
        excludeFromContinueWatching: {
            href: string; // "https://api-pt.uat.rikstv.no/client/2/continuewatching/exclusions/series/333462"
        };
        universalplay: {
            href: string; // "https://portal.rikstv.no/app/up/latest/index.svg?epg=false&authenticate=true&streamingMode=on-demand&backUrl=https://portal.rikstv.no/index.svg&assetId=11299733&title=F%C3%B8rste%20date"
        };
    },
    isInWishList: boolean,
    subscription: boolean,
    categories: ["Underholdning"];
    isLiked: boolean;
    titlePath: "N/A";
    currentLivePercentage: number;
}
