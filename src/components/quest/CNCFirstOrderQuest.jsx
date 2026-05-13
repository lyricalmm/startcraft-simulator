import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  SkipForward,
  XCircle,
} from 'lucide-react'
import { cncQuestData } from '../../data/cncQuestData'
import GuidebookCards from './GuidebookCards'
import QuestIntro from './QuestIntro'
import QuestProgress from './QuestProgress'
import QuestResults from './QuestResults'

const slideVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

const MISSIONS = [
  {
    title: 'Mission 1',
    fullTitle: 'RFQ Clarification',
    subtitle: 'Start with the customer problem, not the machine.',
    educationalNote:
      'In the Awareness and RFQ stage, your job is to reduce uncertainty. The client wants confidence that you understand the request before you talk about price.',
    question:
      'A new customer sends a drawing for 500 parts and says the current supplier is too slow. What is your best first response?',
    choices: [
      {
        id: 'a',
        text: 'Send the lowest possible price in the first reply',
        correct: false,
        feedback:
          'Price-first replies can win attention, but they do not build trust when technical uncertainty is still high.',
      },
      {
        id: 'b',
        text: 'Ask about tolerances, deadline, material grade and what failed with the previous supplier',
        correct: true,
        feedback:
          'Correct. This response addresses the customer journey properly: you clarify the technical need and the business pain before quoting.',
      },
      {
        id: 'c',
        text: 'Promise a 5-day delivery before checking material availability',
        correct: false,
        feedback:
          'Overpromising in the first interaction increases risk and weakens trust if the delivery plan changes later.',
      },
    ],
  },
  {
    title: 'Mission 2',
    fullTitle: 'Evaluation Stage',
    subtitle: 'The quote is where trust and risk meet.',
    educationalNote:
      'During Evaluation, the customer compares suppliers on price, realism, technical confidence and delivery reliability. Your quote must show control, not desperation.',
    question:
      'Which quote message best supports the Evaluation stage for a first CNC order?',
    choices: [
      {
        id: 'a',
        text: 'We are the cheapest option and can probably make it work somehow',
        correct: false,
        feedback:
          'Probably and cheapest are weak signals in the Evaluation stage. They increase doubt instead of confidence.',
      },
      {
        id: 'b',
        text: 'We checked the drawing, the material lead time and the critical dimensions. Our quote includes a realistic schedule and quality control.',
        correct: true,
        feedback:
          'Correct. This is what a strong Evaluation-stage message sounds like: transparent, technical and credible.',
      },
      {
        id: 'c',
        text: 'We accept any complexity and can confirm everything after you place the order',
        correct: false,
        feedback:
          'That shifts risk to the customer and makes your process feel unsafe.',
      },
    ],
  },
  {
    title: 'Mission 3',
    fullTitle: 'Production Transparency',
    subtitle: 'Use-stage communication turns execution into confidence.',
    educationalNote:
      'When production starts, the customer still evaluates you emotionally. Clear status updates reduce anxiety and make your process feel reliable.',
    question:
      'What update creates the best Use-stage experience while the order is in production?',
    choices: [
      {
        id: 'a',
        text: 'Stay silent until delivery day so you do not waste time on communication',
        correct: false,
        feedback:
          'Silence increases uncertainty. Even a short operational update can protect trust.',
      },
      {
        id: 'b',
        text: 'Tell the client the material arrived, machining started and the delivery date remains on track',
        correct: true,
        feedback:
          'Correct. A concise update supports the Use-stage experience and makes the workshop feel organized and dependable.',
      },
      {
        id: 'c',
        text: 'Send raw shop-floor photos without context or delivery information',
        correct: false,
        feedback:
          'Visuals without operational meaning do not answer the customer’s real question: are we still on plan?',
      },
    ],
  },
  {
    title: 'Mission 4',
    fullTitle: 'Delivery and Retention',
    subtitle: 'The last meter decides whether the next order happens.',
    educationalNote:
      'The Feedback stage begins at delivery. Packaging, cleanliness, measurement evidence and follow-up all influence whether the customer comes back.',
    question:
      'What delivery approach most increases the chance of a repeat order?',
    choices: [
      {
        id: 'a',
        text: 'Deliver the parts fast, even if they are poorly packed and undocumented',
        correct: false,
        feedback:
          'Speed alone is not enough. Poor delivery quality weakens the final impression of your workshop.',
      },
      {
        id: 'b',
        text: 'Deliver on time, with clean parts, careful packaging and a short measurement summary',
        correct: true,
        feedback:
          'Correct. This closes the customer journey strongly and increases the probability of trust, feedback and repeat business.',
      },
      {
        id: 'c',
        text: 'Wait for the client to complain before discussing quality or next steps',
        correct: false,
        feedback:
          'A passive finish wastes the feedback stage and makes retention less likely.',
      },
    ],
  },
  {
    title: 'Mission 5',
    fullTitle: 'Retention Strategy',
    subtitle: 'Link customer journey thinking to business outcomes.',
    educationalNote:
      'Retention is not magic. It comes from a better experience across awareness, evaluation, use and delivery. Better journey decisions improve repeat-order probability.',
    question:
      'Why does a strong customer journey matter directly for the simulator business model?',
    choices: [
      {
        id: 'a',
        text: 'Because a better experience can improve conversion, retention and the chance of repeat orders',
        correct: true,
        feedback:
          'Correct. Customer journey quality affects real business metrics: more trust can mean more won quotes and more recurring work.',
      },
      {
        id: 'b',
        text: 'Because it changes machine power and spindle speed automatically',
        correct: false,
        feedback:
          'Customer journey affects customer behavior and business performance, not the physical machine parameters.',
      },
      {
        id: 'c',
        text: 'Because technical details stop mattering once the first order is delivered',
        correct: false,
        feedback:
          'Technical control still matters. The best results come from combining technical precision with good customer experience.',
      },
    ],
  },
]

const JOURNEY_OUTCOMES = {
  a: 'low_price',
  b: 'balanced',
  c: 'premium',
}

export default function CNCFirstOrderQuest({ onComplete, onSkip }) {
  const [phase, setPhase] = useState('intro')
  const [missionIndex, setMissionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [completedChoices, setCompletedChoices] = useState([])

  const currentMission = MISSIONS[missionIndex]
  const isLastMission = missionIndex === MISSIONS.length - 1
  const showFeedback = selectedChoice !== null

  const handleStart = useCallback(() => setPhase('guidebook'), [])
  const handleGuidebookDone = useCallback(() => setPhase('mission'), [])

  const handleChoiceSelect = useCallback(
    (choiceId) => {
      if (selectedChoice !== null) return
      setSelectedChoice(choiceId)
    },
    [selectedChoice],
  )

  const handleNext = useCallback(() => {
    const newChoices = [...completedChoices, selectedChoice]
    setCompletedChoices(newChoices)
    setSelectedChoice(null)

    if (!isLastMission) {
      setMissionIndex((prev) => prev + 1)
      return
    }

    setPhase('results')
  }, [completedChoices, isLastMission, selectedChoice])

  const handleUnlock = useCallback(() => {
    const scores = completedChoices.map((choiceId, idx) =>
      MISSIONS[idx].choices.find((choice) => choice.id === choiceId)?.correct ?? false,
    )

    onComplete({
      completed: true,
      niche: cncQuestData.niche,
      completedAt: new Date().toISOString(),
      scores,
      chosenStrategy: JOURNEY_OUTCOMES[completedChoices[3]] ?? 'balanced',
      simulatorAdjustments: null,
    })
  }, [completedChoices, onComplete])

  if (phase === 'intro') {
    return (
      <AnimatePresence mode="wait">
        <QuestIntro key="intro" onStart={handleStart} onSkip={onSkip} />
      </AnimatePresence>
    )
  }

  if (phase === 'guidebook') {
    return (
      <AnimatePresence mode="wait">
        <GuidebookCards key="guidebook" onComplete={handleGuidebookDone} />
      </AnimatePresence>
    )
  }

  if (phase === 'results') {
    const scores = completedChoices.map((choiceId, idx) =>
      MISSIONS[idx].choices.find((choice) => choice.id === choiceId)?.correct ?? false,
    )

    return (
      <AnimatePresence mode="wait">
        <QuestResults key="results" scores={scores} onUnlock={handleUnlock} />
      </AnimatePresence>
    )
  }

  const selectedChoiceData = currentMission.choices.find(
    (choice) => choice.id === selectedChoice,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-[1480px] px-4 py-12 md:px-6 xl:px-10"
    >
      <div className="mb-8">
        <QuestProgress
          current={missionIndex + 1}
          total={MISSIONS.length}
          missionTitle={currentMission.fullTitle}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={missionIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="rounded-[1.75rem] border border-slate-800 bg-slate-900/75 p-7 shadow-xl md:p-10"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
            {currentMission.title}
          </span>
          <h2 className="mt-3 mb-3 text-3xl font-semibold text-white">
            {currentMission.fullTitle}
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-8 text-slate-400">
            {currentMission.subtitle}
          </p>

          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/45 p-5">
            <BookOpen size={20} className="mt-0.5 flex-shrink-0 text-violet-400" />
            <p className="text-base leading-8 text-slate-300">
              {currentMission.educationalNote}
            </p>
          </div>

          <p className="mb-6 max-w-4xl text-lg font-medium leading-8 text-slate-200">
            {currentMission.question}
          </p>

          <div className="mb-8 space-y-4">
            {currentMission.choices.map((choice) => {
              const isSelected = selectedChoice === choice.id
              const isCorrect = choice.correct

              let cls =
                'w-full rounded-2xl border px-5 py-5 text-left text-base font-normal transition-all duration-200 shadow-sm '

              if (!showFeedback) {
                cls += 'cursor-pointer border-slate-700 bg-slate-800/40 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800/70'
              } else if (isCorrect) {
                cls += 'cursor-default border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              } else if (isSelected) {
                cls += 'cursor-default border-red-500/40 bg-red-500/10 text-red-300'
              } else {
                cls += 'cursor-default border-slate-700/40 bg-slate-800/30 text-slate-500'
              }

              return (
                <motion.button
                  key={choice.id}
                  whileHover={!showFeedback ? { scale: 1.005 } : {}}
                  whileTap={!showFeedback ? { scale: 0.995 } : {}}
                  onClick={() => handleChoiceSelect(choice.id)}
                  disabled={showFeedback}
                  className={cls}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 shrink-0 text-sm font-semibold opacity-50">
                      {choice.id.toUpperCase()}.
                    </span>
                    <span className="flex-1 leading-7">{choice.text}</span>
                    {showFeedback && isCorrect && (
                      <CheckCircle2 size={24} className="shrink-0 text-emerald-400" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle size={24} className="shrink-0 text-red-400" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {showFeedback && selectedChoiceData && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-10 rounded-2xl border p-6 text-base font-normal leading-8 ${
                  selectedChoiceData.correct
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                }`}
              >
                {selectedChoiceData.feedback}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              onClick={onSkip}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-300"
            >
              <SkipForward size={16} />
              Skip quest
            </button>

            <motion.button
              whileHover={showFeedback ? { scale: 1.04 } : {}}
              whileTap={showFeedback ? { scale: 0.96 } : {}}
              onClick={showFeedback ? handleNext : undefined}
              disabled={!showFeedback}
              className={`flex items-center gap-3 rounded-2xl px-7 py-4 text-base font-semibold transition-all shadow-lg ${
                showFeedback
                  ? 'cursor-pointer bg-cyan-500 text-slate-900 shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-500/40'
                  : 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-600'
              }`}
            >
              {isLastMission ? (
                <>
                  See Results <CheckCircle2 size={20} />
                </>
              ) : (
                <>
                  Next Mission <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
