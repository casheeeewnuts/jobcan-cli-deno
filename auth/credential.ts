import {z} from "https://deno.land/x/zod@v3.20.2/mod.ts"
import {ResultAsync} from "neverthrow";

const CredentialSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export type Credential = z.infer<typeof CredentialSchema>

export function readCredential(storePath: string): ResultAsync<Credential, string> {
  return ResultAsync.fromPromise(Deno.readTextFile(storePath), e => {
    if (e != null) {
      return e.toString()
    }

    return "Caught null or undefined"
  }).map(JSON.parse)
    .map(CredentialSchema.parse)
}

export function writeCredential(credential: Credential, path: string): ResultAsync<void, string> {
  return ResultAsync.fromPromise<void, string>(Deno.writeTextFile(path, JSON.stringify(credential)), e => {
    if (e != null) {
      return e.toString()
    }

    return "Caught null or undefined"
  })
}