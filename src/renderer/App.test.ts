import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("TODO creation form", () => {
  it("renders a labeled keyboard-submittable form and disclosed restore limit", () => {
    const markup = renderToStaticMarkup(createElement(App));

    expect(markup).toContain('<form class="todo-entry"');
    expect(markup).toContain('<label for="todo-title">Task title</label>');
    expect(markup).toContain('id="todo-title"');
    expect(markup).toContain('aria-describedby="todo-entry-hint"');
    expect(markup).toContain('type="submit"');
    expect(markup).toContain("press Enter to save it on this device");
    expect(markup).toContain(
      "Previously saved tasks are not loaded in this slice.",
    );
  });
});
