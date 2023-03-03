import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import {Command} from "https://deno.land/x/cliffy@v0.25.7/command/command.ts";
import {EnumType} from "https://deno.land/x/cliffy@v0.25.7/command/types/enum.ts";
import {attend} from "../timestamp/attend.ts";
import {exit} from "../timestamp/exit.ts";

if (import.meta.main) {
  const HOME_PATH = Deno.env.get("HOME")!;
  const CONFIG_FILE_PATH = path.resolve(
    HOME_PATH,
    ".config/",
    "jobcan-cli/",
    "store/",
    "credential.json",
  );
  const TIMESTAMP_TYPE = new EnumType(["attend", "exit", "break-start", "break-end"]);

  await new Command()
    .name("jobcan-cli-timestamp")
    .type("type", TIMESTAMP_TYPE)
    .arguments("[timestamp:type]")
    .command("attend", "timestamp as attend").action(() =>
      attend(CONFIG_FILE_PATH)
    )
    .command("exit", "timestamp as exit").action(() =>
      exit(CONFIG_FILE_PATH)
    )
    .parse()
}