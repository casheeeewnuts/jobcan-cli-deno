import puppeteer, {Page} from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import {ResultAsync} from "npm:neverthrow@6.0.0";
import {Credential} from "../auth/credential.ts";

const LOGIN_PAGE_URL = "https://id.jobcan.jp/users/sign_in";
const PROFILE_PAGE_URL = "https://id.jobcan.jp/account/profile";
const TIMESTAMP_URL = "https://ssl.jobcan.jp/jbcoauth/login"

export const BROWSER = await puppeteer.launch({
  headless: false
});


export function login(credential: Credential): ResultAsync<Page, string> {
  const task = async () => {
    const page = await BROWSER.newPage()

    await page.goto(LOGIN_PAGE_URL, {waitUntil: "domcontentloaded"})
    await page.type("#user_email", credential.email)
    await page.type("#user_password", credential.password)
    await Promise.all([
      page.waitForNavigation({waitUntil: "domcontentloaded"}),
      page.click("input[type=submit]")
    ])

    if (page.url() != PROFILE_PAGE_URL) {
      await page.browser().close()

      throw new Error("Failed to login. Please check your credential. execute next subcommand")
    }

    return page
  }

  return ResultAsync.fromPromise(task(), e => {
    if (e != null) {
      console.error(e.toString())
    } else {
      console.error("Caught null or undefined")
    }

    Deno.exit(1)
  })
}

export function attend(page: Page): ResultAsync<void, string> {
  const task = async () => {
    await page.goto(TIMESTAMP_URL, {waitUntil: "domcontentloaded"})
    const workingStatus = await page.$("#working_status").then(elem => elem?.getProperty("textContent") as string | undefined)

    if (workingStatus !== "未出勤") {
      throw new Error("勤務中です。出勤することはできません。")
    }

    await page.click("#adit-button-work-start")
  }

  return ResultAsync.fromPromise(task(), e => {
    page.browser().close()

    if (e != null) {
      return e.toString()
    } else {
      return "Caught null or undefined"
    }
  }).map(() => page.browser().close())
}