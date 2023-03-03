import {Page} from "puppeteer";
import {readCredential} from "../auth/credential.ts";
import {login, TIMESTAMP_URL} from "../lib/browser/jobcan.ts";


export async function exit(configFilePath: string) {
  const task = async (page: Page) => {
    await page.goto(TIMESTAMP_URL, {waitUntil: "domcontentloaded"})
    // const workingStatus = await page.$("#working_status").then(elem => elem?.getProperty("textContent") as string | undefined)
    //
    // if (workingStatus !== "未出勤") {
    //   throw new Error("勤務中です。出勤することはできません。")
    // }

    // await page.click("#adit-button-work-end")

    return page
  }

  await readCredential(configFilePath)
    .andThen(login)
    .map(task)
    .map(async p => await p.browser().close())
}
