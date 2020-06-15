import React, { FC, HTMLAttributes } from "react"

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
}

export const Section: FC<SectionProps> = ({
  id,
  title,
  children,
  ...passthrough
}) => (
  <section {...passthrough} style={{ marginBottom: "3rem" }}>
    <h1 id={id}>{title}</h1>
    {children}
  </section>
)
