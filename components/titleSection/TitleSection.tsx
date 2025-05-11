import React from 'react'
import { TitleSectionProps } from './TitleSection.type'

export default function TitleSection({title, styles}: TitleSectionProps) {
  return (
    <h1 className={`text-2xl font-semibold ${styles}`}>
      {title}
    </h1>
  )
}
