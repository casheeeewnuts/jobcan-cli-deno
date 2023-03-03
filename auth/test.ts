import {readCredential} from "./credential.ts";
import {login} from "../lib/browser/jobcan.ts";

export async function test(configFilePath: string) {
  const credential = await readCredential(configFilePath);

  if (credential.isErr()) {
    console.error(credential.error);
    Deno.exit(1);
  }

  const loginResult = await login(credential.value);

  if (loginResult.isErr()) {
    console.error(loginResult.error);
    Deno.exit(1);
  }

  console.log("Login succeeded!");
  await loginResult.value.browser().close();
}
