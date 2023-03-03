import {z, ZodError} from "https://deno.land/x/zod@v3.20.2/mod.ts";
import {err, ok, ResultAsync} from "neverthrow";

const CredentialSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type Credential = z.infer<typeof CredentialSchema>;

export function readCredential(
  storePath: string,
): ResultAsync<Credential, string> {
  return ResultAsync.fromPromise(Deno.readTextFile(storePath), (e) => {
    if (e != null) {
      return e.toString();
    }

    return "Caught null or undefined";
  }).andThen((rawText) => {
    try {
      return ok(JSON.parse(rawText));
    } catch (e) {
      return err(e ? e.toString() : "Caught null or undefined");
    }
  })
    .andThen((maybeCredential) => {
      try {
        return ok(CredentialSchema.parse(maybeCredential));
      } catch (e) {
        if (e instanceof ZodError) {
          return err(e.format());
        } else if (e) {
          return err(e.toString());
        } else {
          return err("Caught null or undefined");
        }
      }
    });
}

export function writeCredential(
  credential: Credential,
  path: string,
): ResultAsync<void, string> {
  return ResultAsync.fromPromise<void, string>(
    Deno.writeTextFile(path, JSON.stringify(credential)),
    (e) => {
      if (e != null) {
        return e.toString();
      }

      return "Caught null or undefined";
    },
  );
}
