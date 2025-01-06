import { setCookie, getCookie } from "./cookies";
import { keys } from "./keys";
import {FormVars} from "../__helpers/formVars";
import {vars} from "../../../utils/utils";

let rootDomain;
const countryData = FormVars.getFormVars(keys.BRAND, 'tel');

export const getRootDomain = (url) => {
  if (url.includes("localhost")) {
    rootDomain = url;
    return url;
  } else {
    const domain = url.split(".").splice(1).join(".");
    rootDomain = domain;
    return domain;
  }
};

export const prepareFormData = (data) => {
  return getNeededFields(data);
};

function getNeededFields(data) {
  const lastCookies = getLastCookie();
  const lastCookiesTemp = [];

  if (lastCookies) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const [name, value] of Object.entries(lastCookies)) {
      lastCookiesTemp.push({
        name,
        value,
      });
    }
  }

  return {
    telno: `${countryData.phoneCountryCode}${data.telno.replace(/\D/g, "")}`,
    passwd: data.passwd,
    promocode: data.promocode
  };
}

export const setAuthorizationCookies = (response, domain) => {
  if (response.token) {
    setCookie("airToken", response.token, {
      expires: 36000,
      path: "/",
      domain: `.${domain}`,
    });
    setCookie("thirdPartyAuthToken", response.token, {
      expires: 36000,
      path: "/",
      domain: `.${domain}`,
    });
  }

  if (response.airPmToken) {
    setCookie("airPmToken", response.airPmToken, {
      expires: 36000,
      path: "/",
      domain: `.${domain}`,
    });
  }
};



export const redirectToPlatform = domain => {
  let queryString = new URL(window.location).searchParams;

  queryString.append('landing', '');
  queryString.append('bonus', vars.nnbonus)

  if(window.Analytics) {
    queryString.append('clstrmid', window.Analytics.getCrossdomainId())
  }

  window.location.href = `${domain}?${queryString}`;
};


function getLastCookie() {
  const data = {};
  let lastCookieTime = 0;
  let adtag_t = getCookie("adtag_t");
  let btag_t = getCookie("btag_t");
  let qtag_t = getCookie("qtag_t");

  adtag_t = typeof adtag_t !== "undefined" ? parseInt(adtag_t) : 0;
  btag_t = typeof btag_t !== "undefined" ? parseInt(btag_t) : 0;
  qtag_t = typeof qtag_t !== "undefined" ? parseInt(qtag_t) : 0;

  lastCookieTime = Math.max(adtag_t, btag_t, qtag_t);

  if (lastCookieTime === 0) {
    return data;
  }

  switch (lastCookieTime) {
    case qtag_t:
      data.qtag = getCookie("qtag");
      break;
    case btag_t:
      data.btag = getCookie("pm_btag");
      break;
    case adtag_t:
      data.adtag = getCookie("adtag");
      break;
  }

  return data;
}


