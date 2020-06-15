import React, { FC } from "react"
import { Code } from "../components/Code"

interface Props {
  id: string
}

const SAMPLE_MARKUP = `
<ul class="dropdown-menu textcomplete-dropdown">
  <li class="textcomplete-header">
    HEADER
  </li>
  <li class="textcomplete-item active">
    <span>ACTIVE SEARCH RESULT</span>
  </li>
  <li class="textcomplete-item">
    <span>SEARCH RESULT</span>
  </li>
  <li class="textcomplete-footer">
    FOOTER
  </li>
</ul>
`

const SAMPLE_CSS = `
/* This page uses this style. */

.textcomplete-dropdown {
  border: 1px solid #ddd;
  background-color: white;
  list-style: none;
  padding: 0;
  margin: 0;
}

.textcomplete-dropdown li {
  margin: 0;
}

.textcomplete-footer,
.textcomplete-item {
  border-top: 1px solid #ddd;
}

.textcomplete-item {
  padding: 2px 5px;
  cursor: pointer;
}

.textcomplete-item:hover,
.textcomplete-item.active {
  background-color: rgb(110, 183, 219);
}
`

export const Style: FC<Props> = ({ id }) => (
  <section>
    <h1 id={id}>Style</h1>
    <p>
      A dropdown UI is marked up as below. The inner HTML of header, footer and{" "}
      <code>span</code> elements are generated using the <code>header</code>,{" "}
      <code>footer</code> options and
      <code>template</code> parameter respectively.
    </p>
    <Code code={SAMPLE_MARKUP} language="html" />
    <p>
      Note that it is compatible with Bootstrap&apos;s dropdown widget. So if
      your site is using Bootstrap, you have nothing to do. Otherwise, you can
      use the following sample as base line:
    </p>
    <Code code={SAMPLE_CSS} language="css" />
  </section>
)
