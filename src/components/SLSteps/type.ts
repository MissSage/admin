export interface SLStep {
  index: number
  title: string
  completeTitle?: string
}

export interface SLStepsConfig {
  steps: SLStep[] | (() => SLStep[])
}
