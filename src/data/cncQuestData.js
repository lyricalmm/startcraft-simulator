export const cncQuestData = {
  id: 'cnc_first_order_quest',
  niche: 'cnc_micro_factory',
  title: 'CNC First Order Quest',
  subtitle: 'Understand your first CNC customer before entering the simulator.',
  totalMissions: 5,
  intro: {
    story:
      'You have just opened a small CNC micro-factory. A potential customer contacts you for a first order: 50 aluminum bushings for a prototype assembly. Your job is not only to calculate the price, but to understand the customer, reduce uncertainty and build a viable business relationship.',
    learningGoals: [
      "Understand the customer's technical requirements before quoting",
      'Map the customer journey from awareness to repeat order',
      'Choose a value proposition that builds trust, not just price',
      'Connect pricing decisions with conversion, margin and risk',
      'Link customer behavior to financial indicators in the simulator',
    ],
  },
  missions: [
    {
      id: 'understand_customer',
      index: 0,
      title: 'Mission 1',
      fullTitle: 'Understand the Customer',
      subtitle: 'Ask the right questions before preparing a quote',
      type: 'multi_select',
      maxSelections: 4,
      prompt:
        'Your first customer asks for 50 aluminum bushings. Choose the 4 best questions to ask before preparing the CNC quote.',
      educationalNote:
        "Before pricing, you need technical clarity. Smart questions reduce uncertainty and improve the customer's confidence in you.",
      choices: [
        { id: 'material_grade', text: 'What material grade is required?', score: 10, category: 'good' },
        { id: 'drawing', text: 'Do you have a technical drawing or CAD file?', score: 10, category: 'good' },
        { id: 'tolerances', text: 'What tolerances are critical?', score: 10, category: 'good' },
        { id: 'deadline', text: 'What is the required delivery deadline?', score: 10, category: 'good' },
        { id: 'prototype_or_batch', text: 'Is this a prototype or a recurring batch?', score: 10, category: 'good' },
        { id: 'consequences', text: 'What happens if the part is delayed or out of tolerance?', score: 10, category: 'good' },
        { id: 'cheap', text: 'Do you want the cheapest possible option?', score: -5, category: 'weak' },
        { id: 'budget_first', text: 'What is your maximum budget before I check the drawing?', score: -5, category: 'weak' },
        { id: 'no_specs', text: 'Can you pay in advance without more technical details?', score: -5, category: 'weak' },
        { id: 'start_without_confirm', text: 'Should I start production without confirming tolerances?', score: -5, category: 'weak' },
      ],
      feedback: {
        positive:
          'Good technical questions reduce uncertainty and improve your positioning in the Evaluation stage of the customer journey.',
        negative:
          'Weak or price-first questions can create pricing errors, quality problems or customer mistrust.',
      },
      maxScore: 40,
    },
    {
      id: 'map_journey',
      index: 1,
      title: 'Mission 2',
      fullTitle: 'Map the Customer Journey',
      subtitle: 'Match each customer action to the correct journey stage',
      type: 'match',
      prompt:
        'Your customer goes through several stages before and after placing the order. Match each action to the correct customer journey stage.',
      educationalNote:
        'Understanding where the customer is in their journey helps you communicate the right message at the right time.',
      stages: ['Awareness', 'Interest', 'Evaluation', 'Decision', 'Use', 'Feedback'],
      items: [
        { id: 'slow_supplier', text: 'Client realizes the current supplier is too slow', correctStage: 'Awareness', score: 10 },
        { id: 'search_local', text: 'Client searches for local CNC workshops online', correctStage: 'Interest', score: 10 },
        { id: 'compare_quotes', text: 'Client compares your quote with another supplier', correctStage: 'Evaluation', score: 10 },
        { id: 'accept_order', text: 'Client accepts the quote and sends the purchase order', correctStage: 'Decision', score: 10 },
        { id: 'test_parts', text: 'Client receives and tests the machined parts', correctStage: 'Use', score: 10 },
        { id: 'repeat_order', text: 'Client gives feedback and asks for a repeat order', correctStage: 'Feedback', score: 10 },
      ],
      maxScore: 60,
    },
    {
      id: 'value_proposition',
      index: 2,
      title: 'Mission 3',
      fullTitle: 'Choose the Value Proposition',
      subtitle: 'Position your CNC micro-factory correctly',
      type: 'single_choice',
      prompt:
        'A potential customer asks: "Why should I choose your workshop?" Choose the best answer that builds trust and differentiates you.',
      educationalNote:
        'Positioning is not just about price. Trust, clarity and reliability convert prospects into long-term clients.',
      choices: [
        {
          id: 'cheapest',
          text: '"The cheapest CNC workshop in town."',
          score: 15,
          category: 'weak',
          explanation:
            'Price-only positioning attracts price-sensitive clients and makes you vulnerable to any cheaper competitor.',
        },
        {
          id: 'balanced',
          text: '"Fast and transparent CNC prototyping with clear technical feedback, realistic delivery time and quality control."',
          score: 40,
          category: 'best',
          explanation:
            'This builds trust because it combines speed, technical clarity, realistic delivery and quality control — supporting both confidence and long-term retention.',
        },
        {
          id: 'overpromise',
          text: '"We accept any job, no matter how complex, with no need for detailed specifications."',
          score: -10,
          category: 'bad',
          explanation:
            'Overpromising without technical clarity leads to misunderstandings, quality failures and damaged trust.',
        },
      ],
      maxScore: 40,
    },
    {
      id: 'quote_strategy',
      index: 3,
      title: 'Mission 4',
      fullTitle: 'Quote Strategy & Business Impact',
      subtitle: 'Choose your pricing approach for the first order',
      type: 'single_choice',
      prompt:
        'You now need to price the 50 aluminum bushings. Each strategy has a different impact on conversion, margin and risk. Which do you choose?',
      educationalNote:
        'Pricing is a strategic decision. For a first order, balance the chance of winning the order with financial viability.',
      choices: [
        {
          id: 'low_price',
          text: 'Low Price Strategy',
          subtitle: 'Higher chance of winning the order, but low margin and high risk if costs increase.',
          score: 15,
          category: 'weak',
          effects: { conversion: '+12%', price: '-10%', margin: '-15%', risk: '+8%' },
          simulatorModifiers: {
            conversionRateModifier: 0.12,
            priceModifier: -0.10,
            scrapRiskModifier: 0.08,
            retentionRateModifier: -0.05,
          },
        },
        {
          id: 'balanced',
          text: 'Balanced Strategy',
          subtitle: 'Moderate conversion chance, healthy margin, realistic production buffer.',
          score: 40,
          category: 'best',
          effects: { conversion: '+4%', price: '0%', margin: '0%', risk: '0%' },
          simulatorModifiers: {
            conversionRateModifier: 0.04,
            priceModifier: 0,
            scrapRiskModifier: 0,
            retentionRateModifier: 0.03,
          },
        },
        {
          id: 'premium',
          text: 'Premium Strategy',
          subtitle: 'High margin, lower conversion chance, requires strong trust and clear technical differentiation.',
          score: 25,
          category: 'good',
          effects: { conversion: '-10%', price: '+18%', margin: '+15%', risk: '+5%' },
          simulatorModifiers: {
            conversionRateModifier: -0.10,
            priceModifier: 0.18,
            scrapRiskModifier: 0.05,
            retentionRateModifier: 0.06,
          },
        },
      ],
      maxScore: 40,
    },
    {
      id: 'knowledge_check',
      index: 4,
      title: 'Mission 5',
      fullTitle: 'Final Knowledge Check',
      subtitle: 'Test your understanding of customer journey and business impact',
      type: 'quiz',
      prompt:
        'Answer 5 short questions to demonstrate you understand the connection between customer journey and business indicators.',
      educationalNote:
        'The final check connects all four missions: customer understanding, journey stages, value positioning and pricing decisions.',
      questions: [
        {
          id: 'q1',
          text: 'What does the Awareness stage of the customer journey represent?',
          score: 10,
          choices: [
            { id: 'q1a', text: 'The customer discovers or realizes a problem.', correct: true },
            { id: 'q1b', text: 'The customer pays the invoice.', correct: false },
            { id: 'q1c', text: 'The supplier orders raw material.', correct: false },
          ],
          feedbackCorrect: 'Correct. Awareness is when the customer first recognizes a need or problem your product can solve.',
          feedbackIncorrect: 'Awareness is when the customer first recognizes a need — not when payment happens.',
        },
        {
          id: 'q2',
          text: 'Which stage is most related to comparing quotes from multiple suppliers?',
          score: 10,
          choices: [
            { id: 'q2a', text: 'Feedback', correct: false },
            { id: 'q2b', text: 'Evaluation', correct: true },
            { id: 'q2c', text: 'Use', correct: false },
          ],
          feedbackCorrect: 'Correct. The Evaluation stage is where the customer assesses price, quality, trust and delivery time across options.',
          feedbackIncorrect: 'Quote comparison belongs to the Evaluation stage, where customers compare suppliers.',
        },
        {
          id: 'q3',
          text: 'What does conversion rate directly influence in your business model?',
          score: 10,
          choices: [
            { id: 'q3a', text: 'Number of orders converted from leads', correct: true },
            { id: 'q3b', text: 'Material density of aluminum', correct: false },
            { id: 'q3c', text: 'Machine spindle speed', correct: false },
          ],
          feedbackCorrect: 'Correct. Conversion rate determines how many of your leads become actual paying orders.',
          feedbackIncorrect: 'Conversion rate is purely a business metric: the ratio of leads that become orders.',
        },
        {
          id: 'q4',
          text: 'Why does retention rate matter for a CNC micro-factory?',
          score: 10,
          choices: [
            { id: 'q4a', text: 'It increases the chance of repeat orders and reduces lead acquisition cost.', correct: true },
            { id: 'q4b', text: 'It reduces tool diameter and machining time.', correct: false },
            { id: 'q4c', text: 'It changes the material grade automatically.', correct: false },
          ],
          feedbackCorrect: 'Correct. A higher retention rate means more repeat customers, reducing sales costs and stabilizing revenue.',
          feedbackIncorrect: 'Retention is about keeping customers: more repeat orders, lower acquisition cost, more predictable revenue.',
        },
        {
          id: 'q5',
          text: 'What is the main financial risk of setting your price too low?',
          score: 10,
          choices: [
            { id: 'q5a', text: 'The margin may become too small to cover real production costs.', correct: true },
            { id: 'q5b', text: 'The customer journey disappears entirely.', correct: false },
            { id: 'q5c', text: 'The machine becomes faster automatically.', correct: false },
          ],
          feedbackCorrect: 'Correct. Low pricing erodes margin and can make it impossible to cover fixed costs, tooling wear, scrap and overheads.',
          feedbackIncorrect: 'The main risk of underpricing is margin erosion — revenue may not cover the real cost of production.',
        },
      ],
      maxScore: 50,
    },
  ],
}
