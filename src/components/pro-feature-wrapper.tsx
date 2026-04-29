"use client"

import React from "react"

interface ProFeatureWrapperProps {
  children: React.ReactNode
  featureName?: string
  featureDescription?: string
  className?: string
}

export function ProFeatureWrapper({ children }: ProFeatureWrapperProps) {
  return <>{children}</>
}
