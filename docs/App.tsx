import React, { FC, useEffect } from "react"

import { EMOJI_STRATEGY } from "./strategy"
import { Textarea } from "./components/Textarea"
import { Usage } from "./sections/Usage"
import { Editors } from "./sections/Editors"

const USAGE = "usage"
const EDITORS = "editors"
const CURRENT_YEAR = new Date().getFullYear()

export const App: FC = () => {
  useEffect(() => {
    if (location.hash === "") {
      // Without this code, window initially scrolls to bottom by unknown reason.
      scroll(0, 0)
    }
  }, [])
  return (
    <>
      <header>
        <h1>Textcomplete</h1>
        <p>
          <i>Autocomplete for Textarea and more.</i>
        </p>
        <nav>
          <a href={`#${USAGE}`}>Usage</a>
          {" / "}
          <a href={`#${EDITORS}`}>Editors</a>
          {" / "}
          <a href="https://github.com/yuku/textcomplete">GitHub</a>
        </nav>
      </header>
      <section>
        <Textarea
          triggerImmediately
          focus
          strategies={[EMOJI_STRATEGY]}
          option={{ dropdown: { maxCount: 3 } }}
          defaultValue="Hello, this is textcomplete demo :smi"
        />
      </section>
      <Usage id={USAGE} />
      <Editors id={EDITORS} />
      <footer style={{ textAlign: "center" }}>
        <p>
          <small>
            &copy; Yuku Takahashi {CURRENT_YEAR} - This software is licensed
            under the MTI license
          </small>
        </p>
      </footer>
    </>
  )
}
