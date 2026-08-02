// js/googlefit.js
// AquaTrack — Google Fit real sync (Screen 19: Health Sync)
// Setup required in Google Cloud Console first:
//   1. Create project, enable "Fitness API"
//   2. Create OAuth 2.0 Client ID (Web application type)
//   3. Add your GitHub Pages URL to Authorized JavaScript origins
//
// Fill this in once you have a real Client ID:
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com";
const FITNESS_SCOPE = "https://www.googleapis.com/auth/fitness.nutrition.write";

let googleAccessToken = null;

function initGoogleFitAuth(onSuccess) {
  google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: FITNESS_SCOPE,
    callback: (response) => {
      googleAccessToken = response.access_token;
      onSuccess(response);
    }
  }).requestAccessToken();
}

async function pushHydrationToGoogleFit(amountML, timestamp) {
  if (!googleAccessToken) {
    console.warn("Not authenticated with Google Fit yet.");
    return null;
  }

  // NOTE: Real hydration data source + dataset write calls go here,
  // following the Fitness REST API users.dataSources / users.dataset endpoints.
  // Left as a stub until Google Cloud Console project is set up.
  console.log("Would push to Google Fit:", { amountML, timestamp });
}
