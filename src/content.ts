export const destinationOrder = ['J', 'M', 'H', 'S', 'G'] as const;
export type DestinationCode = typeof destinationOrder[number];
export const letters = ['A', 'B', 'C', 'D'] as const;
export type Answer = typeof letters[number];
export const questions = [
  { title: 'Your First Adventure', voice: 'The Magical Gat whispers…', text: 'Your journey begins in Seoul. What catches your eye first?', options: [
    ['🏯', 'Ancient palaces and beautiful traditions', 'J', 'S'], ['🛍️', 'Colorful streets full of shops and food', 'M', 'G'], ['🎵', 'Street music and creative energy', 'H', 'M'], ['🌿', 'Peaceful parks and hidden cafés', 'S', 'J']] },
  { title: 'Choose Your Adventure', voice: 'The Magical Gat asks…', text: 'You have one magical day in Seoul. What would you do?', options: [
    ['🎤', 'Watch live performances and explore street culture', 'H', 'S'], ['🌆', 'Explore futuristic buildings and amazing city views', 'G', 'M'], ['👘', 'Try on a hanbok and discover Korean history', 'J', 'M'], ['💄', 'Go shopping for Korean fashion and beauty products', 'M', 'G']] },
  { title: 'A Magical Break', voice: 'The Magical Gat wonders…', text: "It's time for a break. Where would you go?", options: [
    ['☕', 'A unique café with creative interiors', 'S', 'H'], ['✨', 'A stylish shopping mall with trendy restaurants', 'G', 'M'], ['🍡', 'A lively street filled with Korean snacks', 'M', 'H'], ['🍵', 'A traditional Korean tea house', 'J', 'S']] },
  { title: 'Your Travel Personality', voice: 'The Magical Gat thinks…', text: 'What kind of atmosphere makes you happiest?', options: [
    ['🌃', 'Modern, exciting, and full of possibilities', 'G', 'M'], ['🎶', 'Energetic, social, and spontaneous', 'H', 'M'], ['🎨', 'Artistic, trendy, and full of surprises', 'S', 'H'], ['🏛️', 'Peaceful, historic, and meaningful', 'J', 'S']] },
  { title: 'Your Perfect Memory', voice: "The Magical Gat's final question…", text: 'Which Seoul memory would you love to take home?', options: [
    ['📸', 'A night full of street food, shopping, and city lights', 'M', 'H'], ['🎸', 'Discovering music and unforgettable street performances', 'H', 'S'], ['🎁', 'Finding unique local shops and creative spaces', 'S', 'G'], ['🌇', 'Watching Seoul sparkle from above', 'G', 'M']] },
] as const;

export const characters = {
  crying: 'crying', confused: 'confused', thinking: 'thinking', confident: 'confident', suspicious: 'suspicious', unimpressed: 'unimpressed', laughing: 'laughing', love: 'love', rocket: 'rocket',
} as const;
export type Expression = keyof typeof characters;
export const quizExpressions: Expression[] = ['thinking', 'confused', 'thinking', 'confused', 'thinking'];
export const sortingSteps: {expression: Expression; text: string; durationMs: number}[] = [
  { expression: 'thinking', text: 'The Magical Gat is reading your travel soul…', durationMs: 1500 },
  { expression: 'confused', text: 'Hmm… interesting choices!', durationMs: 1000 },
  { expression: 'suspicious', text: 'I know exactly where you belong…', durationMs: 1000 },
  { expression: 'confident', text: 'Your Seoul destination is…', durationMs: 1000 },
];

// TODO: Add the official supplied IGB logo and confirmed lecture URL before booth launch.
export const siteConfig: { logo: string | null; lectureUrl: string | null } = { logo: null, lectureUrl: null };
export const destinations = {
  J: {
    name: 'Jongno', short: 'Jongno', korean: '종로', title: 'The Timeless Soul', tagline: "Where Korea’s Past Comes Alive", color: '#b79be7', category: 'History & heritage',
    description: 'You love meaningful experiences, beautiful traditions, and places full of stories. Jongno is your perfect match! Discover royal palaces, charming hanok streets, and the timeless beauty of Korean culture.',
    spots: [['Gyeongbokgung Palace', 'Step into the grandeur of Korea’s royal past.', 'palace'], ['Bukchon Hanok Village', 'Discover the quiet beauty of traditional hanok streets.', 'hanok'], ['Insadong', 'Find traditional crafts, galleries, and tea houses.', 'tea']],
    experiences: ['Try on a traditional Korean hanbok.', 'Discover traditional Korean tea culture.', 'Explore the history of Seoul.'],
    links: [['Gyeongbokgung Palace', 'https://english.visitseoul.net/attractions/Gyeongbokgung-Palace/ENP000072'], ['Insadong', 'https://english.visitseoul.net/area/Insa-dong/ENP000080']],
  },
  M: {
    name: 'Myeongdong & Namsan', short: 'Myeongdong', korean: '명동', title: 'The Sparkling Explorer', tagline: 'Where Seoul Shines Brightest', color: '#efa3b7', category: 'Shopping & city lights',
    description: 'You love excitement, shopping, delicious food, and unforgettable city views. Myeongdong and Namsan are calling! Experience the lively streets of Seoul and discover the magic of the city lights.',
    spots: [['Myeongdong Shopping Street', 'Follow lively streets to fashion, beauty, and tasty bites.', 'shops'], ['N Seoul Tower', 'See Seoul’s glittering skyline from above.', 'tower'], ['Namsan Cable Car', 'Rise above the city on your way to Namsan.', 'cable']],
    experiences: ['Try Korean street food.', 'Explore K-beauty and fashion shops.', 'Enjoy the city skyline.'],
    links: [['Myeongdong', 'https://english.visitseoul.net/area/Myeong-dong/ENP000067'], ['Namsan Seoul Tower', 'https://english.visitseoul.net/attractions/N-Seoul-Tower_/37']],
  },
  H: {
    name: 'Hongdae', short: 'Hongdae', korean: '홍대', title: 'The Free Spirit', tagline: 'Where Creativity Never Sleeps', color: '#a4a9fb', category: 'Music & street culture',
    description: "You're energetic, adventurous, and always ready to discover something new. Hongdae is your perfect match! Dive into Seoul's vibrant music scene, street performances, and creative youth culture.",
    spots: [['Hongdae Red Road', 'Find creative energy around every corner.', 'music'], ['Hongdae Busking Street', 'Let an unexpected street performance become your soundtrack.', 'music'], ['Hongdae Free Market', 'Discover the neighborhood’s creative market culture.', 'shops']],
    experiences: ['Watch street performances.', 'Explore K-pop and indie music culture.', 'Discover unique fashion and local shops.'],
    links: [['Hongdae Red Culture Market', 'https://english.visitseoul.net/area/HONGDAE-R1/ENPidz0r2'], ['Hongdae Busking Street', 'https://english.visitseoul.net/area/HONGDAE-R2/ENPjggl5r']],
  },
  S: {
    name: 'Seongsu & Seoul Forest', short: 'Seongsu', korean: '성수', title: 'The Creative Dreamer', tagline: 'Where Trends Meet Hidden Gems', color: '#91cdb6', category: 'Cafés & hidden gems',
    description: 'You have a creative spirit and love discovering unique spaces. Seongsu is your perfect match! Wander through trendy cafés, artistic streets, and peaceful green spaces that reveal a different side of Seoul.',
    spots: [['Seongsu Yeonmujang-gil', 'Explore a neighborhood of imaginative spaces and cafés.', 'cafe'], ['Seoul Forest', 'Slow down among peaceful paths and green spaces.', 'forest'], ['Seongsu Yeonbang', 'Browse independent shops in a creative shared space.', 'shops']],
    experiences: ['Discover creative cafés.', 'Explore independent shops and pop-up stores.', 'Relax in Seoul Forest.'],
    links: [['Seongsu Yeonmujang-gil', 'https://english.visitseoul.net/area/Yeonmujang-gil/ENP7u7jrk'], ['Seoul Forest', 'https://english.visitseoul.net/nature/Seoul-Forest/ENP001838']],
  },
  G: {
    name: 'Gangnam & Jamsil', short: 'Gangnam', korean: '강남', title: 'The City Visionary', tagline: 'Dream Big in the Heart of Seoul', color: '#acc9e4', category: 'Skyline & modern wonders',
    description: "You love modern experiences, impressive architecture, and the excitement of city life. Gangnam and Jamsil are your perfect match! Explore Seoul's modern landmarks, incredible skyline, and stylish entertainment districts.",
    spots: [['Starfield Library at COEX', 'Look up at towering bookshelves in an extraordinary space.', 'library'], ['Lotte World Tower & Seoul Sky', 'Discover a new perspective on Seoul’s skyline.', 'skyline'], ['Seokchon Lake', 'Take a peaceful lakeside stroll in the heart of the city.', 'lake']],
    experiences: ['Explore modern Korean architecture.', 'Discover trendy shopping and entertainment.', 'Enjoy panoramic views of Seoul.'],
    links: [['Starfield Library', 'https://english.visitseoul.net/attractions/Starfield%E2%80%93Library/ENP026558'], ['Seoul Sky', 'https://english.visitseoul.net/jamsilarea/SeoulSky/ENPowtoyc']],
  },
} as const;
