import { describe, it, expect } from "vitest";
import { fuzzyMatch, scoreCommand } from "./fuzzy";
import { completeCommand, runCommand, type ShellData } from "./shell-commands";
import { projectSlug, projectStatus } from "../data/projects";

const shell: ShellData = {
  whoami: "devops platform engineer @ CGI · London, UK",
  certs: ["✓ Certified Kubernetes Administrator (CKA)"],
  shipped: ["birthplan.co.uk", "lifevault"],
  cvUrl: "/cv.pdf",
  email: "me@example.com",
  links: { github: "https://github.com/x", linkedin: "https://linkedin.com/x" },
  projects: [
    { slug: "birth-your-way", href: "https://www.birthplan.co.uk" },
    { slug: "lifevault", href: "https://lifevault.example" },
  ],
};

describe("projects data helpers", () => {
  it("slugs titles the way kubectl would print them", () => {
    expect(projectSlug("Birth Your Way")).toBe("birth-your-way");
    expect(projectSlug("Azure Resource Inspector")).toBe(
      "azure-resource-inspector",
    );
    expect(projectSlug("todoctl")).toBe("todoctl");
  });

  it("derives status only from the url field", () => {
    expect(projectStatus({ url: "https://draw.ammaarm.com" })).toBe("live");
    expect(projectStatus({ url: undefined })).toBe("repo");
  });
});

describe("fuzzyMatch", () => {
  it("matches in-order subsequences, case-insensitively", () => {
    expect(fuzzyMatch("kbs", "Keyboard shortcuts")).toBe(true);
    expect(fuzzyMatch("copy em", "Copy email address")).toBe(true);
    expect(fuzzyMatch("", "anything")).toBe(true);
    expect(fuzzyMatch("zz", "Copy email address")).toBe(false);
  });
});

describe("scoreCommand", () => {
  it("ranks label prefixes above fuzzy and keyword hits", () => {
    expect(scoreCommand("todo", "todoctl")).toBeGreaterThan(
      scoreCommand("todo", "Intro", "window whoami hero"),
    );
    expect(scoreCommand("todo", "Intro", "window whoami hero")).toBe(0);
    expect(scoreCommand("resume", "Download CV", "resume")).toBe(1);
  });
});

describe("shell commands", () => {
  it("prints data for known commands", () => {
    expect(runCommand("whoami", shell).lines).toEqual([shell.whoami]);
    expect(runCommand("cat certs.txt", shell).lines).toEqual(shell.certs);
    expect(runCommand("ls ~/shipped", shell).lines).toEqual([
      "birthplan.co.uk",
      "lifevault",
    ]);
    expect(runCommand("ls -1 ~/shipped", shell).lines).toEqual(shell.shipped);
  });

  it("opens projects by slug and rejects unknown ones", () => {
    expect(runCommand("open lifevault", shell).effect).toEqual({
      type: "open",
      href: "https://lifevault.example",
    });
    expect(runCommand("open nope", shell).effect).toBeUndefined();
  });

  it("reports unknown commands", () => {
    expect(runCommand("rm -rf /", shell).lines[0]).toMatch(
      /command not found: rm/,
    );
  });

  it("tab-completes commands and project names", () => {
    expect(completeCommand("who", shell).value).toBe("whoami");
    expect(completeCommand("open l", shell).value).toBe("open lifevault");
    const ambiguous = completeCommand("c", shell);
    expect(ambiguous.options).toEqual(
      expect.arrayContaining(["cv", "contact", "clear", "cat certs.txt"]),
    );
  });
});
