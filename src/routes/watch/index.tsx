import localforage from 'localforage';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { SwimlaneItem } from '../../api/useSwimlane';
import { useJson } from '../../api/utils.fetch';
import utilCss from './../../components/utils.css';
import style from './style.css';

interface Props {
  itemId: string;
}

// HACK: to see slow loading issues
const delay = (time = 250) => new Promise(resolve => setTimeout(resolve, time));

const VideoPage: FunctionalComponent<Props> = ({ itemId }: Props) => {
  const [cache, setCache] = useState<SwimlaneItem | null>(null);
  const { data, error: detailsError } = useJson<ItemDetails>(cache?._links.details.href ?? '');
  const { data: play, error: playError } = useJson<VideoDetails>(data?._links.playDash.href ?? '', { secure: true, ttlSeconds: 60 });

  const error = detailsError || playError;

  useEffect(() => {
    (async () => {
      // check cache first:
      if (!cache) {
        await delay();
        const keys = await localforage.keys();
        for (const key of keys.filter(k => k.includes('/assets/lookup'))) {
          const item = (await localforage.getItem<{ value: SwimlaneItem[] }>(key))?.value.find(i => i.id === itemId);
          if (item) {
            console.log('found item in cache', item);
            setCache(item);
            break;
          }
        }
      }
    })();
  }, [itemId, cache]);

  const {
    name: title = '…',
    imagePackUri: posterUrl = '',
    description = '…',
  } = data || cache || {};

  return (
    <div class={[utilCss.page, utilCss.centerContent].join(' ')}>
      <h1>{title}</h1>
      <video class={style.video} poster={posterUrl} controls={!!posterUrl} />
      <p>{description}</p>
      { error && <pre>{error}</pre> }
      { play && <DataList data={play} /> }
    </div>
  );
};

const DataList: FunctionalComponent<{data: Record<string, any>}> = ({data}) => {
  const entries = Object.entries(data);
  return (
    <dl>{ entries.map(([key, value]) => (
      <Fragment key={key}>
        <dt><strong>{key}</strong></dt>
        <dd>{value?.toString()}</dd>
      </Fragment>
    )) }</dl>
  );
}

export default VideoPage;

interface VideoDetails {
  mediaFormat: 'widevine' | 'playready' | 'fairplay';
  protocol: 'DASH' | 'HLS';
  manifestUrl: string;
  licenseUrl: string;
}

interface ItemDetails {
  id: string;
  name: string;
  originalTitle: string;
  imagePackUri: string;
  duration: number;
  description: string;
  synopsis: string;
  director: string;
  directors: string[];
  actors: string[];
  categories: string[];
  genres: string[];
  originChannel: {
    serviceName: string; // "HBO Nordic",
    logoUrl: string; // "https://static.rikstv.no/logopack/HBO_kanalinfo.png",
    logoUrlSvg: string; // "https://static.rikstv.no/logopack/HBO.svg",
    logoUrlSvgSquare: string; // "https://static.rikstv.no/logopack/HBO_square.svg",
  },
  relevance: number;
  estimatedSeenBy: number;
  broadcastedTime: string; // "2021-06-21T23:00:00Z",
  broadcastedTimeEnd: string; // "2021-06-21T23:46:48Z",
  currentLivePercentage: number;
  ageLimit: number;
  productionYear: number;
  productionCountry: string; // "US",
  contentProvider: string; // "HBO",
  externalGenres: string[];
  titleType: string; // "SVOD",
  creditsStartTime: number;
  seriesName: string;
  programType: "Film",
  externalAssetId: string; // "1_8252aa61-0f7d-450a-83cc-a2fb91e57507",
  isJunior: boolean;
  titlePath: string; // "N/A",
  insideTheHomeAvailability: {
    type: "Always"
  },
  everywhereAvailability: {
    type: "Always"
  },
  onDemandFormat: "Subscription";
  streamingMode: "OnDemand";
  _links: {
    details: Link;
    wish: Link;
    excludeFromContinueWatching: Link;
    universalplay: Link;
    progress: Link;
    similar: Link;
    related: Link;
    playSS: Link;
    playHLSF: Link;
    playDash: Link;
    playDashPR: Link;
  },
  isLiked: boolean;
  isInWishList: boolean;
  subscription: boolean;
}
interface Link {
  href: string;
}