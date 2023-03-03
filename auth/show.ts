import {readCredential} from "./credential.ts";

export async function show(configFilePath: string) {
  const credential = await readCredential(configFilePath);

  if (credential.isErr()) {
    console.error(credential.error);
    Deno.exit(1);
  }

  const safeCredential = credential._unsafeUnwrap();

  console.log(`email:    ${safeCredential.email}`);
  console.log(`password: ${mask(safeCredential.password)}`);
}

function mask(str: string): string {
  return "*".repeat(str.length);
}
