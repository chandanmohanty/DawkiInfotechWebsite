/* ============================================================================
 * Shared client logo pool — used by every "Trusted by 500+ Businesses"
 * auto-flipping grid across the site (welcome / about / contact / service /
 * industry templates).
 *
 * Each entry is a full URL path. The array mixes:
 *   - Legacy logos at /assets/images/clients_logo/{n}.jpg
 *   - New brand-named logos at /assets/images/header/demo/dawki-clients/*
 *
 * Filenames with spaces / special characters are URL-encoded so the browser
 * renders them reliably (spaces → %20, & → %26, etc).
 * ============================================================================ */

const NEW_CLIENT_FILES = [
    'client1-launge.png',
    'client2-infity.png',
    'client3-auster-education.png',
    'client4-left-barin-path.png',
    'client5-gsf&association.png',
    'client6-KN.png',
    'client6-house of surgicials.png',
    'client7-shaiclinic.png',
    'client8-poojapath.png',
    'client9-hansal-edu-hub.png',
    'client10-creative-dsign.png',
    'client11-skylthic.png',
    'client12-sankhhya-tatvyaa.png',
    'client13-Athithi24.com.png',
    'client15-cochill.png',
    'client16-fresh-lok.png',
    'client17-keydesign.png',
    'client18-sumazonekart.png',
    'client19-riptide.png',
    'client20-page3.png',
    'client21-tripship.png',
    'client22-cruzeasia.png',
    'client23-mybdc.png',
    'client24-hindicarvan.png',
    'client24-remedial.png',
];

/* User explicitly requested: ONLY show the brand-named logos they
 * supplied in /assets/images/header/demo/dawki-clients/. The legacy
 * /assets/images/clients_logo/{n}.jpg pool was creating same-same
 * repetition and is intentionally removed. */
export const CLIENT_LOGOS: string[] = NEW_CLIENT_FILES.map(
    (file) => `/assets/images/header/demo/dawki-clients/${encodeURI(file)}`
);

/* Smaller subset for compact grids (e.g. Contact page sidebar) — mirror
 * of the same pool but capped to keep the initial render light. */
export const CLIENT_LOGOS_COMPACT: string[] = CLIENT_LOGOS.slice(0, 24);
