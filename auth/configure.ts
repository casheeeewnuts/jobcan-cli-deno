import {ensureDir} from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import {readCredential, writeCredential} from "./credential.ts";
import {Input} from "https://deno.land/x/cliffy@v0.25.7/prompt/input.ts";
import {Secret} from "https://deno.land/x/cliffy@v0.25.7/prompt/secret.ts";

export async function configure(configPath: string) {
  await ensureDir(path.dirname(configPath))

  const defaultCredential = await readCredential(configPath).unwrapOr({
    email: "",
    password: ""
  })

  const email = await Input.prompt({
    message: "Input your email",
    default: defaultCredential.email
  });
  const password = await Secret.prompt({
    message: "Input your password",
    default: defaultCredential.password
  });

  const result = await writeCredential({...defaultCredential, email, password}, configPath)

  if (result.isErr()) {
    console.error(result.error)
    Deno.exit(1)
  }
}