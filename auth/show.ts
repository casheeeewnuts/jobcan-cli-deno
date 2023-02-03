import {readCredential} from "./credential.ts";

export async function show(configFilePath: string) {
  await readCredential(configFilePath).map(c => {
    console.log(`email:    ${c.email}`)
    console.log(`password: ${mask(c.password)}`)
  }).orElse(e => {
    console.error(e)
    Deno.exit(1)
  })
}

function mask(str: string): string {
  return [...str].map(() => "*").join("")
}