import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import {
  Command,
  EnumType,
} from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import {configure, show, test} from "../auth/mod.ts";

if (import.meta.main) {
  const HOME_PATH = Deno.env.get("HOME")!;
  const CONFIG_FILE_PATH = path.resolve(
    HOME_PATH,
    ".config/",
    "jobcan-cli/",
    "store/",
    "credential.json",
  );
  const OPERATION = new EnumType(["configure", "show", "test"]);

  await new Command()
    .name("jobcan-cli-auth")
    .type("operation", OPERATION)
    .arguments("[operation:operation]")
    .command("configure", "configure credential").action(() =>
      configure(CONFIG_FILE_PATH)
    )
    .command("show", "show saved credential").action(() =>
      show(CONFIG_FILE_PATH)
    )
    .command("test", "test login with saved credential").action(() =>
      test(CONFIG_FILE_PATH)
    )
    .parse();
}
