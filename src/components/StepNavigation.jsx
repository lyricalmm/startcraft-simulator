// Step-by-step navigation for the simulator flow — used in Phase 6
export default function StepNavigation({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <button
            onClick={() => onStepClick?.(index)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              index === currentStep
                ? 'bg-cyan-500 text-slate-900'
                : index < currentStep
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-slate-800 text-slate-500 cursor-default'
            }`}
            disabled={index > currentStep}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-current/20">
              {index + 1}
            </span>
            {step.label}
          </button>
          {index < steps.length - 1 && (
            <div className={`h-px w-6 ${index < currentStep ? 'bg-cyan-500' : 'bg-slate-700'}`} />
          )}
        </div>
      ))}
    </div>
  )
}
