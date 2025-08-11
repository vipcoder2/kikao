import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    liveMatches: 'Live Matches',
    liveScores: 'Live Scores',
    schedule: 'Schedule',
    competitions: 'Competitions',
    about: 'About',
    watch: 'Watch',
    watchLive: 'Watch Live',
    matchDetails: 'Match Details',
    live: 'LIVE',
    finished: 'FT',
    halftime: 'HT',
    moreStreams: 'More Streams',
    moreInfo: 'More Info',
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    disclaimer: 'Disclaimer',
    faq: 'FAQ',
    contactUs: 'Contact Us',
    termsOfService: 'Terms Of Service',
    navigation: 'Navigation',
    support: 'Support',
    connect: 'Connect',
    allRightsReserved: 'All rights reserved',
    siteDisclaimer: 'This site does not store any files on its server. All contents are provided by non-affiliated third parties.',
    noFilesStored: 'This site does not store any files on its server. All contents are provided by non-affiliated third parties.',
    yourTimezone: 'Your timezone',
    currentTimezone: 'Current timezone',
    timezone: 'Timezone',
    liveFootball: 'Live Football Streaming',
    footballStreaming: 'Football live stream in HD is here! KikaSports delivers free soccer live TV, today\'s football match live, and 24/7 football streaming online.',
    highlights: 'Highlights',
    contact: 'Contact',
    // Match Card translations
    vs: 'vs',
    homeTeam: 'Home',
    away: 'Away',
    // About section translations
    ourMission: 'Our Mission',
    whatWeOffer: 'What We Offer',
    joinOurCommunity: 'Join Our Community',
    registerNow: 'Register Now',
    // Features
    hdQualityStreams: 'HD Quality Streams',
    fastReliable: 'Fast & Reliable',
    userFriendlyInterface: 'User-Friendly Interface',
    liveStreamsDesc: 'Watch high-quality streams of football matches from around the world.',
    fastReliableDesc: 'Our streaming infrastructure is optimized for speed and reliability, ensuring smooth playback during peak times.',
    userFriendlyDesc: 'Intuitive interface that makes finding and watching matches effortless with easy navigation and quick access.',
    // General content
    enjoyHdStreams: 'Enjoy HD quality streams with minimal buffering and excellent audio quality for the best viewing experience.',
    comprehensiveCoverage: 'Comprehensive Coverage',
    easyNavigation: 'Easy Navigation',
    neverMissAMatch: 'Never Miss a Match',
    aboutFootballCompetitions: 'About Football Competitions',
    experienceExcitement: 'Experience the excitement of world-class football with live streaming coverage of major competitions.',
    followFavoriteTeams: 'Follow your favorite teams throughout the season and never miss a crucial match with our reliable streaming platform.',
    readyToWatch: 'Ready to watch?',
    checkTodayMatches: 'Check out today\'s live matches',
    viewUpcomingSchedule: 'view the upcoming schedule',
    // FAQ content
    howToWatch: 'How can I watch live football matches?',
    howToWatchAnswer: 'Simply browse our homepage or live matches section to find ongoing games. Click on any match to access multiple streaming sources and enjoy high-quality live football action.',
    isFree: 'Is the streaming service free?',
    isFreeAnswer: 'Yes, our basic streaming service is completely free. You can watch live matches, view schedules, and access match information without any subscription fees.',
    whatDevices: 'What devices can I use to watch matches?',
    whatDevicesAnswer: 'Our platform is compatible with all devices including desktop computers, laptops, tablets, and smartphones. We have responsive design that adapts to any screen size.',
    whyBuffering: 'Why is my stream buffering or lagging?',
    whyBufferingAnswer: 'Buffering can be caused by slow internet connection or high server load. Try switching to a different stream source, lowering the quality, or checking your internet connection speed.',
    howToFind: 'How do I find specific matches or teams?',
    howToFindAnswer: 'Use our schedule page to browse matches by date and competition. You can filter by specific leagues or use the search functionality to find your favorite teams.',
    areStreamsSafe: 'Are the streams safe to watch?',
    // Schedule page
    fixtureList: 'Our fixture list covers all major football competitions including domestic leagues, international tournaments, cup competitions, and friendly matches from around the world.',
    filterMatches: 'Filter matches by competition, view fixtures by date, and access detailed match information. Find exactly what you\'re looking for with our user-friendly interface.',
    // Common actions
    or: 'or',
    and: 'and',
    // Mission content
    missionContent: 'KikaSports is dedicated to bringing football fans closer to the game they love. We provide high-quality live streams, comprehensive coverage, and a community platform for fans around the world to enjoy matches from major leagues and competitions.',
    goalContent: 'Our goal is to create the ultimate football viewing experience that\'s accessible, reliable, and community-focused. We believe that every fan deserves access to watch their favorite teams and players compete at the highest level.',
    liveStreamsFeature: 'Live Streams',
    matchHighlights: 'Match Highlights',
    communityEngagement: 'Community Engagement',
    comprehensiveSchedule: 'Comprehensive Schedule',
    competitionCoverage: 'Competition Coverage',
    unlimitedAccess: 'Unlimited access to all streams',
    liveMatchChats: 'Participation in live match chats',
    personalizedNotifications: 'Personalized match notifications',
    favoriteTeamTracking: 'Favorite team tracking',
    questionsOrFeedback: 'Have questions, suggestions, or feedback? We\'d love to hear from you!',
    createFreeAccount: 'Create a free account to get the most out of kikasports. Registered users enjoy:',
    catchUpOnHighlights: 'Catch up on the latest goals, key moments, and action from recent games.',
    joinDiscussions: 'Join discussions with fellow fans during matches through our live chat.',
    detailedCalendar: 'Never miss a match with our detailed calendar of upcoming fixtures.',
    majorLeagues: 'Follow all major leagues, cups, and international tournaments.',

    // Main page sections
    liveMatchesSection: 'Live Matches',
    hotMatchesSection: 'Hot Matches',
    allMatchesSection: 'All Matches',
    noLiveMatches: 'No live matches at the moment',
    noHotMatches: 'No hot matches available',
    noMatches: 'No matches available',

    // Match status
    minute: 'min',
    kickOff: 'Kick Off',
    fullTime: 'Full Time',
    halfTime: 'Half Time',
    postponed: 'Postponed',
    cancelled: 'Cancelled',

    // Watch match page
    shareMatch: 'Share Match',
    streamOptions: 'Stream Options',
    selectQuality: 'Select Quality',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    refresh: 'Refresh',
    watchLiveText: 'Watch Live',
    streamSources: 'Stream Sources',
    theaterMode: 'Theater Mode',
    exitTheaterMode: 'Exit Theater Mode',
    matchInformation: 'Match Information',
    dateTime: 'Date & Time',
    stadium: 'Stadium',
    liveStreamingDetails: 'Live Streaming Details',
    premiumFootballStreaming: 'Premium Football Streaming Experience',
    hdQualityStreaming: 'HD Quality Streaming',
    multipleStreamSources: 'Multiple Stream Sources',
    hdQualityDesc: 'Watch in stunning high-definition quality with our adaptive streaming technology. Our platform automatically adjusts stream quality based on your internet connection for uninterrupted viewing.',
    multipleSourcesDesc: 'Access backup streaming sources if one becomes unavailable. Our redundant system ensures you never miss crucial moments of the match, with instant switching between different stream qualities and sources.',
    experienceExcitementWith: 'Experience the excitement of',
    withOurPremium: 'with our premium HD live streaming service. This',
    matchBringsTogether: 'match brings together two competitive teams at the prestigious',
    ourStreamingPlatform: 'Our streaming platform offers multiple viewing options including HD, SD, and mobile-optimized streams to ensure the best possible viewing experience on any device. Watch with real-time commentary and live match statistics for a complete football experience.',
    liveStreamingAvailable: 'Live streaming is available now! Join thousands of fans watching online.',
    lookingForMore: 'Looking for more matches? Check our',
    homepage: 'homepage',
    for: 'for',
    liveGames: 'live games',
    browse: 'browse our',
    fixtureSchedule: 'fixture schedule',
    upcomingMatches: 'upcoming matches',
    noStreamAvailable: 'No Stream Available',
    pleaseSelectDifferent: 'Please try selecting a different quality.',
    streamError: 'Stream Error',
    subscribeToChannel: 'Subscribe to our channel',

    // Polling
    voteForWinner: 'Vote for the winner',
    alreadyVoted: 'You have already voted',
    totalVotes: 'Total votes',
    votes: 'votes',

    // Stream quality
    hd: 'HD',
    sd: 'SD',
    mobile: 'Mobile',
    auto: 'Auto',
    server: 'Server',

    // Time and date
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',

    // General UI
    close: 'Close',
    open: 'Open',
    menu: 'Menu',
    settings: 'Settings',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',

    // About page content
    aboutTitle: 'About KikaSports',
    aboutDescription: 'Your premier destination for live football streaming',

    // Featured content
    featured: 'Featured',
    trending: 'Trending',
    popular: 'Popular',
    recent: 'Recent',

    // Competition names
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    serieA: 'Serie A',
    bundesliga: 'Bundesliga',
    ligue1: 'Ligue 1',
    championsLeague: 'Champions League',
    europaLeague: 'Europa League',
    worldCup: 'World Cup',

    // Error messages
    streamNotFound: 'Stream not found',
    matchNotFound: 'Match not found',
    connectionError: 'Connection error',
    serverError: 'Server error',
    tryAgain: 'Please try again',
    loadingMatch: 'Loading match...',
    returnToHomepage: 'Return to homepage',

    // Success messages
    voteSubmitted: 'Vote submitted successfully',
    dataLoaded: 'Data loaded successfully',

    // PWA
    installApp: 'Install App',
    addToHomeScreen: 'Add to Home Screen',

    // Social sharing
    shareOnFacebook: 'Share on Facebook',
    shareOnTwitter: 'Share on Twitter',
    shareOnWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy Link',

    // Telegram
    joinTelegram: 'Join our Telegram channel',
    telegramChannel: 'Telegram Channel',

    // FAQ Section
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    howToWatchMatches: 'How can I watch live football matches?',
    isKikaFree: 'Is KikaSports free to use?',
    isKikaFreeAnswer: 'Yes, KikaSports provides free access to live football streaming. We offer comprehensive coverage of matches from Premier League, Champions League, La Liga, Serie A, and other major competitions at no cost.',
    whichLeagues: 'Which leagues and competitions do you cover?',
    whichLeaguesAnswer: 'We provide streaming coverage for all major football competitions including Premier League, Champions League, Europa League, La Liga, Serie A, Bundesliga, Ligue 1, and international tournaments like World Cup and European Championships.',
    mobileSupport: 'Can I watch on mobile devices?',
    mobileSupportAnswer: 'Absolutely! KikaSports is fully optimized for mobile viewing. You can watch live matches on your smartphone, tablet, or any device with a web browser. Our responsive design ensures a smooth experience across all screen sizes.',
    findUpcoming: 'How do I find upcoming matches?',
    findUpcomingAnswer: 'Visit our Schedule page to view comprehensive fixture lists for all competitions. You can also check our Live Scores section for real-time match updates and results.',
    streamingIssues: 'What should I do if a stream isn\'t working?',
    streamingIssuesAnswer: 'If you encounter streaming issues, try refreshing the page or selecting an alternative stream source. We provide multiple streaming options for each match to ensure reliable coverage. Make sure you have a stable internet connection for the best experience.',
    stillHaveQuestions: 'Still have questions?',
    cantFindAnswer: 'Can\'t find the answer you\'re looking for? Contact our support team.',
    contactSupport: 'Contact Support',
    findAnswers: 'Find answers to common questions about our streaming service',
    streaming: 'Streaming',
    liveMatchStreaming: 'Live match streaming and playback',
    devices: 'Devices',
    compatibleDevices: 'Compatible devices and platforms',
    safety: 'Safety',
    securityPrivacy: 'Security and privacy protection',

    // League names and sidebar
    leagues: 'Leagues',
    teams: 'Teams',
    uefaChampionsLeague: 'UEFA Champions League',
    uefaEuropaLeague: 'UEFA Europa League',
    proLeague: 'Pro League',
    eredivisie: 'Eredivisie',
    faCup: 'FA Cup',
    manchesterCity: 'Manchester City',
    manchesterUnited: 'Manchester United',
    chelsea: 'Chelsea',
    bayernMunchen: 'Bayern München',
    bayerLeverkusen: 'Bayer Leverkusen',
    napoli: 'Napoli',
    inter: 'Inter',
    marseille: 'Marseille',
    parisStGermain: 'Paris Saint Germain',
    realMadrid: 'Real Madrid',

    // Loading and error states
    loadingMatches: 'Loading matches...',
    loadingAd: 'Loading ad...',
    ad: 'Ad',
  },
  es: {
    home: 'Inicio',
    liveMatches: 'Partidos en Vivo',
    liveScores: 'Marcadores en Vivo',
    schedule: 'Calendario',
    competitions: 'Competiciones',
    about: 'Acerca de',
    watch: 'Ver',
    watchLive: 'Ver en Vivo',
    matchDetails: 'Detalles del Partido',
    live: 'EN VIVO',
    finished: 'FT',
    halftime: 'MT',
    moreStreams: 'Más Transmisiones',
    moreInfo: 'Más Información',
    aboutUs: 'Acerca de Nosotros',
    privacyPolicy: 'Política de Privacidad',
    disclaimer: 'Descargo de Responsabilidad',
    faq: 'Preguntas Frecuentes',
    contactUs: 'Contáctanos',
    termsOfService: 'Términos de Servicio',
    navigation: 'Navegación',
    support: 'Soporte',
    connect: 'Conectar',
    allRightsReserved: 'Todos los derechos reservados',
    siteDisclaimer: 'Este sitio no almacena archivos en su servidor. Todo el contenido es proporcionado por terceros no afiliados.',
    noFilesStored: 'Este sitio no almacena archivos en su servidor. Todo el contenido es proporcionado por terceros no afiliados.',
    yourTimezone: 'Tu zona horaria',
    currentTimezone: 'Zona horaria actual',
    timezone: 'Zona horaria',
    liveFootball: 'Transmisión de Fútbol en Vivo',
    footballStreaming: '¡La transmisión de fútbol en vivo en HD está aquí! KikaSports ofrece televisión de fútbol gratis en vivo, partidos de fútbol de hoy en vivo y transmisión de fútbol en línea 24/7.',
    highlights: 'Destacados',
    contact: 'Contacto',
    // Match Card translations
    vs: 'vs',
    homeTeam: 'Local',
    away: 'Visitante',
    // About section translations
    ourMission: 'Nuestra Misión',
    whatWeOffer: 'Lo Que Ofrecemos',
    joinOurCommunity: 'Únete a Nuestra Comunidad',
    registerNow: 'Registrarse Ahora',
    // Features
    hdQualityStreams: 'Transmisiones de Calidad HD',
    fastReliable: 'Rápido y Confiable',
    userFriendlyInterface: 'Interfaz Fácil de Usar',
    liveStreamsDesc: 'Mira transmisiones de alta calidad de partidos de fútbol de todo el mundo.',
    fastReliableDesc: 'Nuestra infraestructura de transmisión está optimizada para velocidad y confiabilidad, asegurando reproducción fluida durante horas pico.',
    userFriendlyDesc: 'Interfaz intuitiva que hace que encontrar y ver partidos sea fácil con navegación sencilla y acceso rápido.',
    // General content
    enjoyHdStreams: 'Disfruta de transmisiones de calidad HD con mínimo buffering y excelente calidad de audio para la mejor experiencia de visualización.',
    comprehensiveCoverage: 'Cobertura Integral',
    easyNavigation: 'Navegación Fácil',
    neverMissAMatch: 'Nunca Te Pierdas un Partido',
    aboutFootballCompetitions: 'Acerca de las Competiciones de Fútbol',
    experienceExcitement: 'Experimenta la emoción del fútbol de clase mundial con cobertura de transmisión en vivo de las principales competiciones.',
    followFavoriteTeams: 'Sigue a tus equipos favoritos durante toda la temporada y nunca te pierdas un partido crucial con nuestra plataforma de transmisión confiable.',
    readyToWatch: '¿Listo para ver?',
    checkTodayMatches: 'Echa un vistazo a los partidos en vivo de hoy',
    viewUpcomingSchedule: 'ver el próximo calendario',
    // FAQ content
    howToWatch: '¿Cómo puedo ver partidos de fútbol en vivo?',
    howToWatchAnswer: 'Simplemente navega por nuestra página de inicio o sección de partidos en vivo para encontrar juegos en curso. Haz clic en cualquier partido para acceder a múltiples fuentes de transmisión y disfrutar de acción de fútbol en vivo de alta calidad.',
    isFree: '¿Es gratis el servicio de transmisión?',
    isFreeAnswer: 'Sí, nuestro servicio básico de transmisión es completamente gratuito. Puedes ver partidos en vivo, ver horarios y acceder a información de partidos sin ninguna tarifa de suscripción.',
    whatDevices: '¿Qué dispositivos puedo usar para ver partidos?',
    whatDevicesAnswer: 'Nuestra plataforma es compatible con todos los dispositivos incluyendo computadoras de escritorio, laptops, tablets y smartphones. Tenemos diseño responsivo que se adapta a cualquier tamaño de pantalla.',
    whyBuffering: '¿Por qué mi transmisión está en buffering o con retraso?',
    whyBufferingAnswer: 'El buffering puede ser causado por conexión lenta a internet o alta carga del servidor. Intenta cambiar a una fuente de transmisión diferente, bajar la calidad, o verificar la velocidad de tu conexión a internet.',
    howToFind: '¿Cómo encuentro partidos específicos o equipos?',
    howToFindAnswer: 'Usa nuestra página de calendario para navegar partidos por fecha y competición. Puedes filtrar por ligas específicas o usar la funcionalidad de búsqueda para encontrar tus equipos favoritos.',
    areStreamsSafe: '¿Es seguro ver las transmisiones?',
    // Schedule page
    fixtureList: 'Nuestra lista de partidos cubre todas las principales competiciones de fútbol incluyendo ligas domésticas, torneos internacionales, competiciones de copa y partidos amistosos de todo el mundo.',
    filterMatches: 'Filtra partidos por competición, ve partidos por fecha y accede a información detallada de partidos. Encuentra exactamente lo que buscas con nuestra interfaz fácil de usar.',
    // Common actions
    or: 'o',
    and: 'y',
    // Mission content
    missionContent: 'KikaSports se dedica a acercar a los fanáticos del fútbol al juego que aman. Proporcionamos transmisiones en vivo de alta calidad, cobertura integral y una plataforma comunitaria para que los fanáticos de todo el mundo disfruten de partidos de las principales ligas y competiciones.',
    goalContent: 'Nuestro objetivo es crear la experiencia de visualización de fútbol definitiva que sea accesible, confiable y centrada en la comunidad. Creemos que todo fanático merece acceso para ver a sus equipos y jugadores favoritos competir al más alto nivel.',
    liveStreamsFeature: 'Transmisiones en Vivo',
    matchHighlights: 'Destacados de Partidos',
    communityEngagement: 'Participación Comunitaria',
    comprehensiveSchedule: 'Calendario Integral',
    competitionCoverage: 'Cobertura de Competiciones',
    unlimitedAccess: 'Acceso ilimitado a todas las transmisiones',
    liveMatchChats: 'Participación en chats de partidos en vivo',
    personalizedNotifications: 'Notificaciones personalizadas de partidos',
    favoriteTeamTracking: 'Seguimiento de equipos favoritos',
    questionsOrFeedback: '¿Tienes preguntas, sugerencias o comentarios? ¡Nos encantaría saber de ti!',
    createFreeAccount: 'Crea una cuenta gratuita para aprovechar al máximo kikasports. Los usuarios registrados disfrutan de:',
    catchUpOnHighlights: 'Ponte al día con los últimos goles, momentos clave y acción de juegos recientes.',
    joinDiscussions: 'Únete a discusiones con otros fanáticos durante los partidos a través de nuestro chat en vivo.',
    detailedCalendar: 'Nunca te pierdas un partido con nuestro calendario detallado de próximos partidos.',
    majorLeagues: 'Sigue todas las principales ligas, copas y torneos internacionales.',

    // Main page sections
    liveMatchesSection: 'Partidos en Vivo',
    hotMatchesSection: 'Partidos Destacados',
    allMatchesSection: 'Todos los Partidos',
    noLiveMatches: 'No hay partidos en vivo en este momento',
    noHotMatches: 'No hay partidos destacados disponibles',
    noMatches: 'No hay partidos disponibles',

    // Match status
    minute: 'min',
    kickOff: 'Comienzo',
    fullTime: 'Tiempo Completo',
    halfTime: 'Medio Tiempo',
    postponed: 'Aplazado',
    cancelled: 'Cancelado',

    // Watch match page
    shareMatch: 'Compartir Partido',
    streamOptions: 'Opciones de Transmisión',
    selectQuality: 'Seleccionar Calidad',
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    refresh: 'Actualizar',
    watchLiveText: 'Ver en Vivo',
    streamSources: 'Fuentes de Transmisión',
    theaterMode: 'Modo Teatro',
    exitTheaterMode: 'Salir del Modo Teatro',
    matchInformation: 'Información del Partido',
    dateTime: 'Fecha y Hora',
    stadium: 'Estadio',
    liveStreamingDetails: 'Detalles de Transmisión en Vivo',
    premiumFootballStreaming: 'Experiencia de Transmisión de Fútbol Premium',
    hdQualityStreaming: 'Transmisión de Calidad HD',
    multipleStreamSources: 'Múltiples Fuentes de Transmisión',
    hdQualityDesc: 'Mira en impresionante calidad de alta definición con nuestra tecnología de transmisión adaptativa. Nuestra plataforma ajusta automáticamente la calidad de la transmisión según tu conexión a internet para una visualización ininterrumpida.',
    multipleSourcesDesc: 'Accede a fuentes de transmisión de respaldo si una no está disponible. Nuestro sistema redundante asegura que nunca te pierdas momentos cruciales del partido, con conmutación instantánea entre diferentes calidades y fuentes de transmisión.',
    experienceExcitementWith: 'Experimenta la emoción de',
    withOurPremium: 'con nuestro servicio de transmisión en vivo HD premium. Este',
    matchBringsTogether: 'partido reúne a dos equipos competitivos en el prestigioso',
    ourStreamingPlatform: 'Nuestra plataforma de transmisión ofrece múltiples opciones de visualización, incluyendo transmisiones HD, SD y optimizadas para móviles, para asegurar la mejor experiencia de visualización posible en cualquier dispositivo. Mira con comentarios en tiempo real y estadísticas de partidos en vivo para una experiencia de fútbol completa.',
    liveStreamingAvailable: '¡La transmisión en vivo está disponible ahora! Únete a miles de fanáticos viendo en línea.',
    lookingForMore: '¿Buscas más partidos? Consulta nuestra',
    homepage: 'página de inicio',
    for: 'para',
    liveGames: 'partidos en vivo',
    browse: 'explora nuestro',
    fixtureSchedule: 'calendario de partidos',
    upcomingMatches: 'próximos partidos',
    noStreamAvailable: 'No hay transmisión disponible',
    pleaseSelectDifferent: 'Por favor, intenta seleccionar una calidad diferente.',
    streamError: 'Error de Transmisión',
    subscribeToChannel: 'Suscríbete a nuestro canal',

    // Polling
    voteForWinner: 'Vota por el ganador',
    alreadyVoted: 'Ya has votado',
    totalVotes: 'Votos totales',
    votes: 'votos',

    // Stream quality
    hd: 'HD',
    sd: 'SD',
    mobile: 'Móvil',
    auto: 'Auto',
    server: 'Servidor',

    // Time and date
    today: 'Hoy',
    tomorrow: 'Mañana',
    yesterday: 'Ayer',

    // General UI
    close: 'Cerrar',
    open: 'Abrir',
    menu: 'Menú',
    settings: 'Ajustes',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',

    // About page content
    aboutTitle: 'Acerca de KikaSports',
    aboutDescription: 'Tu principal destino para la transmisión de fútbol en vivo',

    // Featured content
    featured: 'Destacado',
    trending: 'Tendencia',
    popular: 'Popular',
    recent: 'Reciente',

    // Competition names
    premierLeague: 'Premier League',
    laLiga: 'La Liga',
    serieA: 'Serie A',
    bundesliga: 'Bundesliga',
    ligue1: 'Ligue 1',
    championsLeague: 'Champions League',
    europaLeague: 'Europa League',
    worldCup: 'Copa Mundial',

    // Error messages
    streamNotFound: 'Transmisión no encontrada',
    matchNotFound: 'Partido no encontrado',
    connectionError: 'Error de conexión',
    serverError: 'Error del servidor',
    tryAgain: 'Por favor, inténtalo de nuevo',
    loadingMatch: 'Cargando partido...',
    returnToHomepage: 'Volver a la página de inicio',

    // Success messages
    voteSubmitted: 'Voto enviado con éxito',
    dataLoaded: 'Datos cargados con éxito',

    // PWA
    installApp: 'Instalar la aplicación',
    addToHomeScreen: 'Añadir a la pantalla de inicio',

    // Social sharing
    shareOnFacebook: 'Compartir en Facebook',
    shareOnTwitter: 'Compartir en Twitter',
    shareOnWhatsApp: 'Compartir en WhatsApp',
    copyLink: 'Copiar enlace',

    // Telegram
    joinTelegram: 'Únete a nuestro canal de Telegram',
    telegramChannel: 'Canal de Telegram',

    // FAQ Section
    frequentlyAskedQuestions: 'Preguntas Frecuentes',
    howToWatchMatches: '¿Cómo puedo ver partidos de fútbol en vivo?',
    isKikaFree: '¿Es KikaSports de uso gratuito?',
    isKikaFreeAnswer: 'Sí, KikaSports ofrece acceso gratuito a la transmisión de fútbol en vivo. Ofrecemos cobertura completa de partidos de la Premier League, la Liga de Campeones, La Liga, la Serie A y otras competiciones importantes sin costo alguno.',
    whichLeagues: '¿Qué ligas y competiciones cubren?',
    whichLeaguesAnswer: 'Ofrecemos cobertura de transmisión para todas las principales competiciones de fútbol, incluyendo la Premier League, la Liga de Campeones, la Liga Europa, La Liga, la Serie A, la Bundesliga, la Ligue 1 y torneos internacionales como la Copa Mundial y los Campeonatos Europeos.',
    mobileSupport: '¿Puedo ver en dispositivos móviles?',
    mobileSupportAnswer: '¡Absolutamente! KikaSports está totalmente optimizado para la visualización móvil. Puedes ver partidos en vivo en tu smartphone, tableta o cualquier dispositivo con un navegador web. Nuestro diseño responsivo asegura una experiencia fluida en todos los tamaños de pantalla.',
    findUpcoming: '¿Cómo encuentro los próximos partidos?',
    findUpcomingAnswer: 'Visita nuestra página de Calendario para ver listas completas de partidos para todas las competiciones. También puedes consultar nuestra sección de Marcadores en Vivo para obtener actualizaciones y resultados de partidos en tiempo real.',
    streamingIssues: '¿Qué debo hacer si una transmisión no funciona?',
    streamingIssuesAnswer: 'Si encuentras problemas de transmisión, intenta actualizar la página o seleccionar una fuente de transmisión alternativa. Ofrecemos múltiples opciones de transmisión para cada partido para asegurar una cobertura confiable. Asegúrate de tener una conexión a internet estable para la mejor experiencia.',
    stillHaveQuestions: '¿Aún tienes preguntas?',
    cantFindAnswer: '¿No encuentras la respuesta que buscas? Contacta a nuestro equipo de soporte.',
    contactSupport: 'Contactar con Soporte',
    findAnswers: 'Encuentra respuestas a preguntas comunes sobre nuestro servicio de transmisión',
    streaming: 'Transmisión',
    liveMatchStreaming: 'Transmisión y reproducción de partidos en vivo',
    devices: 'Dispositivos',
    compatibleDevices: 'Dispositivos y plataformas compatibles',
    safety: 'Seguridad',
    securityPrivacy: 'Seguridad y protección de la privacidad',

    // League names and sidebar
    leagues: 'Ligas',
    teams: 'Equipos',
    uefaChampionsLeague: 'Liga de Campeones de la UEFA',
    uefaEuropaLeague: 'Liga Europa de la UEFA',
    proLeague: 'Pro League',
    eredivisie: 'Eredivisie',
    faCup: 'FA Cup',
    manchesterCity: 'Manchester City',
    manchesterUnited: 'Manchester United',
    chelsea: 'Chelsea',
    bayernMunchen: 'Bayern München',
    bayerLeverkusen: 'Bayer Leverkusen',
    napoli: 'Napoli',
    inter: 'Inter',
    marseille: 'Marseille',
    parisStGermain: 'Paris Saint Germain',
    realMadrid: 'Real Madrid',

    // Loading and error states
    loadingMatches: 'Cargando partidos...',
    loadingAd: 'Cargando anuncio...',
    ad: 'Anuncio',
  },
  ar: {
    home: 'الرئيسية',
    liveMatches: 'المباريات المباشرة',
    liveScores: 'النتائج المباشرة',
    schedule: 'الجدول',
    competitions: 'البطولات',
    about: 'حول',
    watch: 'مشاهدة',
    watchLive: 'مشاهدة مباشرة',
    matchDetails: 'تفاصيل المباراة',
    live: 'مباشر',
    finished: 'انتهت',
    halftime: 'شوط أول',
    moreStreams: 'المزيد من البث',
    moreInfo: 'المزيد من المعلومات',
    aboutUs: 'من نحن',
    privacyPolicy: 'سياسة الخصوصية',
    disclaimer: 'إخلاء المسؤولية',
    faq: 'الأسئلة الشائعة',
    contactUs: 'اتصل بنا',
    termsOfService: 'شروط الخدمة',
    navigation: 'التنقل',
    support: 'الدعم',
    connect: 'تواصل',
    allRightsReserved: 'جميع الحقوق محفوظة',
    siteDisclaimer: 'هذا الموقع لا يخزن أي ملفات على خادمه. جميع المحتويات مقدمة من أطراف ثالثة غير تابعة.',
    noFilesStored: 'هذا الموقع لا يخزن أي ملفات على خادمه. جميع المحتويات مقدمة من أطراف ثالثة غير تابعة.',
    yourTimezone: 'منطقتك الزمنية',
    currentTimezone: 'المنطقة الزمنية الحالية',
    timezone: 'المنطقة الزمنية',
    liveFootball: 'بث كرة القدم المباشر',
    footballStreaming: 'بث كرة القدم المباشر بجودة عالية هنا! كيكا سبورتس يقدم تلفزيون كرة القدم المجاني المباشر، مباراة كرة القدم اليوم مباشرة، وبث كرة القدم عبر الإنترنت على مدار الساعة.',
    highlights: 'المقاطع المميزة',
    contact: 'اتصل بنا',
    // Match Card translations
    vs: 'ضد',
    homeTeam: 'المضيف',
    away: 'الضيف',
    // About section translations
    ourMission: 'مهمتنا',
    whatWeOffer: 'ما نقدمه',
    joinOurCommunity: 'انضم إلى مجتمعنا',
    registerNow: 'سجل الآن',
    // Features
    hdQualityStreams: 'بث عالي الجودة',
    fastReliable: 'سريع وموثوق',
    userFriendlyInterface: 'واجهة سهلة الاستخدام',
    liveStreamsDesc: 'شاهد بث عالي الجودة لمباريات كرة القدم من حول العالم.',
    fastReliableDesc: 'بنيتنا التحتية للبث محسّنة للسرعة والموثوقية، مما يضمن تشغيل سلس خلال أوقات الذروة.',
    userFriendlyDesc: 'واجهة بديهية تجعل العثور على المباريات ومشاهدتها أمرًا سهلاً مع التنقل السهل والوصول السريع.',
    // General content
    enjoyHdStreams: 'استمتع ببث عالي الجودة مع الحد الأدنى من التخزين المؤقت وجودة صوت ممتازة لأفضل تجربة مشاهدة.',
    comprehensiveCoverage: 'تغطية شاملة',
    easyNavigation: 'تنقل سهل',
    neverMissAMatch: 'لا تفوت أي مباراة',
    aboutFootballCompetitions: 'حول مسابقات كرة القدم',
    experienceExcitement: 'استمتع بإثارة كرة القدم عالمية المستوى مع تغطية البث المباشر للمسابقات الكبرى.',
    followFavoriteTeams: 'تابع فرقك المفضلة طوال الموسم ولا تفوت أي مباراة مهمة مع منصة البث الموثوقة لدينا.',
    readyToWatch: 'جاهز للمشاهدة؟',
    checkTodayMatches: 'اطلع على مباريات اليوم المباشرة',
    viewUpcomingSchedule: 'اعرض الجدول القادم',
    // FAQ content
    howToWatch: 'كيف يمكنني مشاهدة مباريات كرة القدم المباشرة؟',
    howToWatchAnswer: 'ببساطة تصفح صفحتنا الرئيسية أو قسم المباريات المباشرة للعثور على الألعاب الجارية. انقر على أي مباراة للوصول إلى مصادر بث متعددة والاستمتاع بحركة كرة القدم المباشرة عالية الجودة.',
    isFree: 'هل خدمة البث مجانية؟',
    isFreeAnswer: 'نعم، خدمة البث الأساسية لدينا مجانية تمامًا. يمكنك مشاهدة المباريات المباشرة وعرض الجداول والوصول إلى معلومات المباريات بدون أي رسوم اشتراك.',
    whatDevices: 'ما هي الأجهزة التي يمكنني استخدامها لمشاهدة المباريات؟',
    whatDevicesAnswer: 'منصتنا متوافقة مع جميع الأجهزة بما في ذلك أجهزة الكمبيوتر المكتبية والمحمولة والأجهزة اللوحية والهواتف الذكية. لدينا تصميممتجاوب يتكيف مع أي حجم شاشة.',
    whyBuffering: 'لماذا يتم تخزين البث مؤقتًا أو يتأخر؟',
    whyBufferingAnswer: 'يمكن أن يحدث التخزين المؤقت بسبب اتصال إنترنت بطيء أو حمل خادم عالي. جرب التبديل إلى مصدر بث مختلف، أو خفض الجودة، أو فحص سرعة اتصال الإنترنت.',
    howToFind: 'كيف أجد مباريات أو فرق معينة؟',
    howToFindAnswer: 'استخدم صفحة الجدول لتصفح المباريات حسب التاريخ والمسابقة. يمكنك تصفية حسب الدوريات المحددة أو استخدام وظيفة البحث للعثور على فرقك المفضلة.',
    areStreamsSafe: 'هل البث آمن للمشاهدة؟',
    // Schedule page
    fixtureList: 'قائمة مبارياتنا تغطي جميع مسابقات كرة القدم الرئيسية بما في ذلك الدوريات المحلية والبطولات الدولية ومسابقات الكؤوس والمباريات الودية من جميع أنحاء العالم.',
    filterMatches: 'رشح المباريات حسب المسابقة، اعرض المباريات حسب التاريخ، واحصل على معلومات مفصلة عن المباريات. اعثر بالضبط على ما تبحث عنه مع واجهتنا سهلة الاستخدام.',
    // Common actions
    or: 'أو',
    and: 'و',
    // Mission content
    missionContent: 'كيكا سبورتس مكرسة لتقريب عشاق كرة القدم من اللعبة التي يحبونها. نحن نقدم بث مباشر عالي الجودة وتغطية شاملة ومنصة مجتمعية للمشجعين من جميع أنحاء العالم للاستمتاع بالمباريات من الدوريات والمسابقات الكبرى.',
    goalContent: 'هدفنا هو إنشاء تجربة مشاهدة كرة القدم المثلى التي تكون متاحة وموثوقة ومتمحورة حول المجتمع. نحن نؤمن أن كل مشجع يستحق الوصول لمشاهدة فرقه ولاعبيه المفضلين يتنافسون في أعلى مستوى.',
    liveStreamsFeature: 'البث المباشر',
    matchHighlights: 'أبرز المباريات',
    communityEngagement: 'المشاركة المجتمعية',
    comprehensiveSchedule: 'جدول شامل',
    competitionCoverage: 'تغطية المسابقات',
    unlimitedAccess: 'وصول غير محدود لجميع البث',
    liveMatchChats: 'المشاركة في محادثات المباريات المباشرة',
    personalizedNotifications: 'إشعارات مخصصة للمباريات',
    favoriteTeamTracking: 'تتبع الفرق المفضلة',
    questionsOrFeedback: 'هل لديك أسئلة أو اقتراحات أو تعليقات؟ نحن نحب أن نسمع منك!',
    createFreeAccount: 'أنشئ حساب مجاني للاستفادة القصوى من كيكا سبورتس. المستخدمون المسجلون يستمتعون بـ:',
    catchUpOnHighlights: 'تابع آخر الأهداف واللحظات الرئيسية والحركة من الألعاب الأخيرة.',
    joinDiscussions: 'انضم إلى المناقشات مع المشجعين الآخرين خلال المباريات من خلال محادثتنا المباشرة.',
    detailedCalendar: 'لا تفوت مباراة مع تقويمنا المفصل للمباريات القادمة.',
    majorLeagues: 'تابع جميع الدوريات الكبرى والكؤوس والبطولات الدولية.',

    // Main page sections
    liveMatchesSection: 'المباريات المباشرة',
    hotMatchesSection: 'المباريات الساخنة',
    allMatchesSection: 'جميع المباريات',
    noLiveMatches: 'لا توجد مباريات مباشرة في الوقت الحالي',
    noHotMatches: 'لا توجد مباريات ساخنة متاحة',
    noMatches: 'لا توجد مباريات متاحة',

    // Match status
    minute: 'دقيقة',
    kickOff: 'ضربة البداية',
    fullTime: 'الوقت الكامل',
    halfTime: 'الشوط الأول',
    postponed: 'مؤجل',
    cancelled: 'ألغيت',

    // Watch match page
    shareMatch: 'شارك المباراة',
    streamOptions: 'خيارات البث',
    selectQuality: 'اختر الجودة',
    loading: 'جار التحميل...',
    error: 'خطأ',
    retry: 'إعادة المحاولة',
    refresh: 'تحديث',
    watchLiveText: 'شاهد البث المباشر',
    streamSources: 'مصادر البث',
    theaterMode: 'وضع المسرح',
    exitTheaterMode: 'الخروج من وضع المسرح',
    matchInformation: 'معلومات المباراة',
    dateTime: 'التاريخ والوقت',
    stadium: 'ملعب',
    liveStreamingDetails: 'تفاصيل البث المباشر',
    premiumFootballStreaming: 'تجربة بث كرة القدم المتميزة',
    hdQualityStreaming: 'بث عالي الجودة HD',
    multipleStreamSources: 'مصادر بث متعددة',
    hdQualityDesc: 'شاهد بجودة عالية الوضوح مذهلة مع تقنية البث التكيفي الخاصة بنا. تقوم منصتنا تلقائيًا بضبط جودة البث بناءً على اتصالك بالإنترنت لتجربة مشاهدة دون انقطاع.',
    multipleSourcesDesc: 'الوصول إلى مصادر البث الاحتياطية في حال أصبح أحدها غير متاح. يضمن نظامنا الزائد عدم تفويتك أبدًا اللحظات الحاسمة في المباراة، مع التبديل الفوري بين الجودات والمصادر المختلفة للبث.',
    experienceExcitementWith: 'استمتع بإثارة',
    withOurPremium: 'مع خدمة البث المباشر عالية الدقة المتميزة الخاصة بنا. هذه',
    matchBringsTogether: 'المباراة تجمع بين فريقين متنافسين في المرموق',
    ourStreamingPlatform: 'توفر منصة البث الخاصة بنا خيارات عرض متعددة بما في ذلك البث عالي الدقة، والقياسي، والمحسن للأجهزة المحمولة لضمان أفضل تجربة مشاهدة ممكنة على أي جهاز. شاهد مع التعليق في الوقت الفعلي وإحصائيات المباراة المباشرة لتجربة كرة قدم كاملة.',
    liveStreamingAvailable: 'البث المباشر متاح الآن! انضم إلى الآلاف من المشجعين الذين يشاهدون عبر الإنترنت.',
    lookingForMore: 'تبحث عن المزيد من المباريات؟ تحقق من',
    homepage: 'الصفحة الرئيسية',
    for: 'ل',
    liveGames: 'ألعاب مباشرة',
    browse: 'تصفح لدينا',
    fixtureSchedule: 'جدول المباريات',
    upcomingMatches: 'المباريات القادمة',
    noStreamAvailable: 'لا يوجد بث متاح',
    pleaseSelectDifferent: 'يرجى محاولة تحديد جودة مختلفة.',
    streamError: 'خطأ في البث',
    subscribeToChannel: 'اشترك في قناتنا',

    // Polling
    voteForWinner: 'صوت للفائز',
    alreadyVoted: 'لقد صوتت بالفعل',
    totalVotes: 'إجمالي الأصوات',
    votes: 'الأصوات',

    // Stream quality
    hd: 'HD',
    sd: 'SD',
    mobile: 'جوال',
    auto: 'تلقائي',
    server: 'الخادم',

    // Time and date
    today: 'اليوم',
    tomorrow: 'غدا',
    yesterday: 'أمس',

    // General UI
    close: 'إغلاق',
    open: 'فتح',
    menu: 'قائمة',
    settings: 'إعدادات',
    search: 'بحث',
    filter: 'فلتر',
    sort: 'فرز',

    // About page content
    aboutTitle: 'حول كيكا سبورتس',
    aboutDescription: 'وجهتك الأولى لبث كرة القدم المباشر',

    // Featured content
    featured: 'مميز',
    trending: 'الشائع',
    popular: 'الشعبي',
    recent: 'الأخيرة',

    // Competition names
    premierLeague: 'الدوري الممتاز',
    laLiga: 'الدوري الإسباني',
    serieA: 'الدوري الإيطالي',
    bundesliga: 'الدوري الألماني',
    ligue1: 'الدوري الفرنسي',
    championsLeague: 'دوري أبطال أوروبا',
    europaLeague: 'الدوري الأوروبي',
    worldCup: 'كأس العالم',

    // Error messages
    streamNotFound: 'لم يتم العثور على البث',
    matchNotFound: 'لم يتم العثور على المباراة',
    connectionError: 'خطأ في الاتصال',
    serverError: 'خطأ في الخادم',
    tryAgain: 'حاول مرة أخرى',
    loadingMatch: 'جار تحميل المباراة...',
    returnToHomepage: 'العودة إلى الصفحة الرئيسية',

    // Success messages
    voteSubmitted: 'تم إرسال التصويت بنجاح',
    dataLoaded: 'تم تحميل البيانات بنجاح',

    // PWA
    installApp: 'تثبيت التطبيق',
    addToHomeScreen: 'أضف إلى الشاشة الرئيسية',

    // Social sharing
    shareOnFacebook: 'شارك على الفيسبوك',
    shareOnTwitter: 'شارك على تويتر',
    shareOnWhatsApp: 'شارك على واتساب',
    copyLink: 'نسخ الرابط',

    // Telegram
    joinTelegram: 'انضم إلى قناة Telegram الخاصة بنا',
    telegramChannel: 'قناة Telegram',

    // FAQ Section
    frequentlyAskedQuestions: 'الأسئلة المتكررة',
    howToWatchMatches: 'كيف يمكنني مشاهدة مباريات كرة القدم مباشرة؟',
    isKikaFree: 'هل استخدام KikaSports مجاني؟',
    isKikaFreeAnswer: 'نعم، توفر KikaSports وصولاً مجانيًا إلى بث كرة القدم المباشر. نحن نقدم تغطية شاملة للمباريات من الدوري الإنجليزي الممتاز ودوري أبطال أوروبا والدوري الإسباني والدوري الإيطالي وغيرها من المسابقات الكبرى دون أي تكلفة.',
    whichLeagues: 'ما هي الدوريات والمسابقات التي تغطيها؟',
    whichLeaguesAnswer: 'نحن نقدم تغطية بث لجميع مسابقات كرة القدم الرئيسية بما في ذلك الدوري الإنجليزي الممتاز ودوري أبطال أوروبا والدوري الأوروبي والدوري الإسباني والدوري الإيطالي والدوري الألماني والدوري الفرنسي والبطولات الدولية مثل كأس العالم والبطولات الأوروبية.',
    mobileSupport: 'هل يمكنني المشاهدة على الأجهزة المحمولة؟',
    mobileSupportAnswer: 'إطلاقا! KikaSports مُحسّن بالكامل للعرض على الأجهزة المحمولة. يمكنك مشاهدة المباريات مباشرة على هاتفك الذكي أو جهازك اللوحي أو أي جهاز به متصفح ويب. يضمن تصميمنا سريع الاستجابة تجربة سلسة عبر جميع أحجام الشاشات.',
    findUpcoming: 'كيف يمكنني العثور على المباريات القادمة؟',
    findUpcomingAnswer: 'تفضل بزيارة صفحة الجدول الزمني الخاصة بنا لعرض قوائم شاملة بالمباريات لجميع المسابقات. يمكنك أيضًا مراجعة قسم النتائج المباشرة الخاص بنا للحصول على تحديثات ونتائج المباريات في الوقت الفعلي.',
    streamingIssues: 'ماذا علي أن أفعل إذا كان البث لا يعمل؟',
    streamingIssuesAnswer: 'إذا واجهت مشكلات في البث، فحاول تحديث الصفحة أو تحديد مصدر بث بديل. نحن نقدم خيارات بث متعددة لكل مباراة لضمان تغطية موثوقة. تأكد من أن لديك اتصال إنترنت ثابت للحصول على أفضل تجربة.',
    stillHaveQuestions: 'هل لا تزال لديك أسئلة؟',
    cantFindAnswer: 'ألا يمكنك العثور على الإجابة التي تبحث عنها؟ اتصل بفريق الدعم لدينا.',
    contactSupport: 'الاتصال بالدعم',
    findAnswers: 'ابحث عن إجابات للأسئلة الشائعة حول خدمة البث الخاصة بنا',
    streaming: 'تدفق',
    liveMatchStreaming: 'بث مباشر للمباريات وتشغيلها',
    devices: 'الأجهزة',
    compatibleDevices: 'الأجهزة والمنصات المتوافقة',
    safety: 'أمان',
    securityPrivacy: 'حماية الأمن والخصوصية',

    // League names and sidebar
    leagues: 'الدوريات',
    teams: 'الفرق',
    uefaChampionsLeague: 'دوري أبطال أوروبا',
    uefaEuropaLeague: 'الدوري الأوروبي',
    proLeague: 'الدوري المحترفين',
    eredivisie: 'الدوري الهولندي',
    faCup: 'كأس الاتحاد الإنجليزي',
    manchesterCity: 'مانشستر سيتي',
    manchesterUnited: 'مانشستر يونايتد',
    chelsea: 'تشيلسي',
    bayernMunchen: 'بايرن ميونيخ',
    bayerLeverkusen: 'باير ليفركوزن',
    napoli: 'نابولي',
    inter: 'إنتر',
    marseille: 'مرسيليا',
    parisStGermain: 'باريس سان جيرمان',
    realMadrid: 'ريال مدريد',

    // Loading and error states
    loadingMatches: 'جار تحميل المباريات...',
    loadingAd: 'جار تحميل الإعلان...',
    ad: 'إعلان',
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;