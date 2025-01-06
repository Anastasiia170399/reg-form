export function collectCookies() {
  // MarketingTech Framework integration
  if (window.MTFEF && window.MTFEF.collectSources) {
    try {
      const sources = window.MTFEF.collectSources();

      if (sources) {
        // Nested JSON Object .
        return sources;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const cookieSet = {
    adtag: getCookie("adtag"),
    btag: getCookie("pm_btag"),
    siteid: getCookie("pm_siteid"),
    qtag: getCookie("qtag"),
    adtag_t: getCookie("adtag_t"),
    btag_t: getCookie("btag_t"),
    qtag_t: getCookie("qtag_t"),
    org: getCookie("org"),
    org_t: getCookie("org_t"),
    sourceURL: getCookie("sourceUrl"),
    iohash: getCookie("iohash"),
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const key in cookieSet) {
    if (typeof cookieSet[key] === "undefined") {
      delete cookieSet[key];
    }
  }

  return cookieSet;
}

export function getCookie(name) {
  // eslint-disable-next-line max-len
  const matches = document.cookie.match(
      new RegExp(
          "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
  );
  let result;

  if (matches) {
    try {
      result = decodeURIComponent(matches[1]);
    } catch (e) {}
  }

  return result;
}

export function setCookie(name, value, props) {
  // eslint-disable-next-line no-param-reassign
  props = props || {};

  let exp = props.expires;

  if (typeof exp === "number" && exp) {
    const d = new Date();

    d.setTime(d.getTime() + exp * 1000);
    console.log(d);

    // eslint-disable-next-line no-multi-assign,no-param-reassign
    exp = props.expires = d;
  }

  if (exp && exp.toUTCString) {
    // eslint-disable-next-line no-param-reassign
    props.expires = exp.toUTCString();
  }

  // eslint-disable-next-line no-param-reassign
  value = encodeURIComponent(value);

  let updatedCookie = `${name}=${value}`;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const propName in props) {
    updatedCookie += `; ${propName}`;

    const propValue = props[propName];

    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  }

  document.cookie = updatedCookie;
}

