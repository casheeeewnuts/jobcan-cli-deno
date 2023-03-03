import puppeteer, {Page, Browser} from "puppeteer";
import {ResultAsync} from "neverthrow";
import {Credential} from "../../auth/credential.ts";

const LOGIN_PAGE_URL = "https://id.jobcan.jp/users/sign_in";
const PROFILE_PAGE_URL = "https://id.jobcan.jp/account/profile";
export const TIMESTAMP_URL = "https://ssl.jobcan.jp/jbcoauth/login"

export let BROWSER: Browser;

async function getBrowser() {
  if (!BROWSER) {
    BROWSER = await puppeteer.launch()
  }

  return BROWSER
}

export function login(credential: Credential): ResultAsync<Page, string> {

  const task = async () => {
    const browser = await getBrowser()
    const page = await browser.newPage()

    await page.goto(LOGIN_PAGE_URL, {waitUntil: "domcontentloaded"})
    await page.type("#user_email", credential.email)
    await page.type("#user_password", credential.password)
    await Promise.all([
      page.waitForNavigation({waitUntil: "domcontentloaded"}),
      page.click("input[type=submit]")
    ])

    if (page.url() != PROFILE_PAGE_URL) {
      await page.browser().close()

      throw new Error("Failed to login. Please check your credential")
    }

    return page
  }

  return ResultAsync.fromPromise(task(), e => {
    return e != null
      ? e.toString()
      : "Caught null or undefined"
  })
}