import {Command} from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import "./subcommand/auth.ts";
import "./lib/browser/jobcan.ts";

if (import.meta.main) {
  await new Command()
    .name("jobcan-cli")
    .version("0.0.1")
    .description("CommandLine tool for automate routine in JobCan")
    .command("auth [operation]", "configure authentication").executable()
    .command("timestamp [operation]", "execute timestamping ").executable()
    .command("man-hour", "input man-hour").executable()
    .parse(Deno.args);
}