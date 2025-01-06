import { collectCookies } from "../api/cookies";
import {keys} from "../api/keys";

export default function sendFormData(formUserData) {
  const headers = new Headers();
  const channelType = window.innerWidth >= 1000 ? "DESKTOP_AIR_PM" : "MOBILE_WEB";

  headers.append("X-Api-Key", "9a7432c6-c163-4fde-a52a-4205edd7cd05");
  headers.append("X-Channel", channelType);
  headers.append("X-Response-Error", "true");
  headers.append("X-IncludeLogin", "true");
  headers.append("X-Landing", "true");
  headers.append("Content-Type", "application/json");

  return fetch(`https://api-0.playwin.fun/hcet8rg/v0/identity/registration/byform`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      formName: "REGISTRATIONBYPHONE",
      phone: formUserData.telno,
      password: formUserData.passwd,
      promocode: formUserData.promocode,
      defaultCurrency: keys.CURRENCY_ID,
      isPlayerAgree: true,
      selectedLanguage: keys.LANGUAGE,
      nnBonus: keys.NN_BONUS,
      marketingMeta: collectCookies()
    }),
  });
}

