/**
 * ChainFlow Assessment API
 * Handles the supply chain maturity assessment workflow
 */

import { NextRequest, NextResponse } from 'next/server';

// Assessment questions with weights
const ASSESSMENT_QUESTIONS = {
  inventory: {
    weight: 1.0,
    questions: [
      { id: 'inv-1', text: 'How accurate is your demand forecasting?', weight: 0.35 },
      { id: 'inv-2', text: 'Do you have real-time inventory visibility across all locations?', weight: 0.30 },
      { id: 'inv-3', text: 'How often do you experience stockouts?', weight: 0.20 },
      { id: 'inv-4', text: 'Can you automatically reorder when stock reaches reorder point?', weight: 0.15 }
    ]
  },
  planning: {
    weight: 1.0,
    questions: [
      { id: 'plan-1', text: 'How integrated is your sales and operations planning?', weight: 0.30 },
      { id: 'plan-2', text: 'Can you quickly adjust plans when demand changes?', weight: 0.35 },
      { id: 'plan-3', text: 'How automated is your production scheduling?', weight: 0.20 },
      { id: 'plan-4', text: 'Do you use AI/ML for demand planning?', weight: 0.15 }
    ]
  },
  supplier: {
    weight: 1.0,
    questions: [
      { id: 'sup-1', text: 'Do you have real-time visibility into supplier performance?', weight: 0.30 },
      { id: 'sup-2', text: 'How quickly can you identify alternative suppliers?', weight: 0.25 },
      { id: 'sup-3', text: 'How collaborative is your supplier relationship?', weight: 0.25 },
      { id: 'sup-4', text: 'Do you have automated supplier risk monitoring?', weight: 0.20 }
    ]
  },
  logistics: {
    weight: 1.0,
    questions: [
      { id: 'log-1', text: 'Can you track shipments in real-time across all modes?', weight: 0.30 },
      { id: 'log-2', text: 'How proactive are your exception management processes?', weight: 0.25 },
      { id: 'log-3', text: 'Do you have end-to-end supply chain visibility?', weight: 0.25 },
      { id: 'log-4', text: 'Can you optimize routes dynamically?', weight: 0.20 }
    ]
  },
  disruption: {
    weight: 1.0,
    questions: [
      { id: 'dis-1', text: 'How quickly can you respond to supply disruptions?', weight: 0.30 },
      { id: 'dis-2', text: 'Do you have contingency plans for critical suppliers?', weight: 0.25 },
      { id: 'dis-3', text: 'Can you simulate different disruption scenarios?', weight: 0.25 },
      { id: 'dis-4', text: 'Do you have automated risk alerts?', weight: 0.20 }
    ]
  }
};

// Maturity levels
const MATURITY_LEVELS = [
  { min: 0, max: 39, level: 'Initial', color: '#ef4444', description: 'Ad-hoc processes, limited visibility, reactive approach' },
  { min: 40, max: 59, level: 'Basic', color: '#f97316', description: 'Some standardized processes, basic visibility, beginning to be proactive' },
  { min: 60, max: 79, level: 'Developing', color: '#eab308', description: 'Integrated processes, good visibility, proactive planning' },
  { min: 80, max: 89, level: 'Advanced', color: '#22c55e', description: 'Optimized processes, full visibility, predictive capabilities' },
  { min: 90, max: 100, level: 'Leading', color: '#06b6d4', description: 'Best-in-class, AI-driven, autonomous optimization' }
];

function calculateMaturityScore(answers: Record<string, number>): {
  overall: number;
  categories: Record<string, number>;
} {
  const categories: Record<string, number> = {};
  let totalScore = 0;
  let totalWeight = 0;

  for (const [category, data] of Object.entries(ASSESSMENT_QUESTIONS)) {
    let categoryScore = 0;
    let categoryWeight = 0;

    for (const question of data.questions) {
      const answer = answers[question.id];
      if (answer !== undefined) {
        categoryScore += answer * question.weight * 20;
        categoryWeight += question.weight;
      }
    }

    if (categoryWeight > 0) {
      categories[category] = Math.round(categoryScore / categoryWeight);
      totalScore += categories[category] * data.weight;
      totalWeight += data.weight;
    }
  }

  return {
    overall: totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0,
    categories
  };
}

function getMaturityLevel(score: number) {
  return MATURITY_LEVELS.find(l => score >= l.min && score <= l.max) || MATURITY_LEVELS[0];
}

function estimateAnnualLosses(score: number, industry?: string): {
  estimatedLoss: number;
  breakdown: Record<string, number>;
} {
  const baseLoss = industry === 'manufacturing' ? 8000000 : 
                   industry === 'retail' ? 5000000 : 
                   industry === 'healthcare' ? 12000000 : 6000000;
  
  const inefficiencyFactor = (100 - score) / 100;
  
  return {
    estimatedLoss: Math.round(baseLoss * inefficiencyFactor),
    breakdown: {
      'Inventory Carrying Costs': Math.round(baseLoss * inefficiencyFactor * 0.30),
      'Stockout Costs': Math.round(baseLoss * inefficiencyFactor * 0.25),
      'Expedited Shipping': Math.round(baseLoss * inefficiencyFactor * 0.20),
      'Quality Issues': Math.round(baseLoss * inefficiencyFactor * 0.15),
      'Process Inefficiency': Math.round(baseLoss * inefficiencyFactor * 0.10)
    }
  };
}

function getOptimizationRoadmap(score: number, categories: Record<string, number>): Array<{
  priority: number;
  category: string;
  action: string;
  impact: string;
  timeline: string;
}> {
  const roadmap: Array<{
    priority: number;
    category: string;
    action: string;
    impact: string;
    timeline: string;
  }> = [];
  
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => a - b);

  if (score < 50) {
    roadmap.push({
      priority: 1,
      category: sortedCategories[0]?.[0] || 'inventory',
      action: 'Implement real-time data visibility system',
      impact: 'Critical foundation for all supply chain improvements',
      timeline: '3-6 months'
    });
    roadmap.push({
      priority: 2,
      category: 'planning',
      action: 'Establish demand planning baseline with statistical forecasting',
      impact: 'Reduce forecast error by 20-30%',
      timeline: '2-4 months'
    });
    roadmap.push({
      priority: 3,
      category: 'supplier',
      action: 'Create supplier performance scorecards',
      impact: 'Enable strategic sourcing and risk mitigation',
      timeline: '1-3 months'
    });
  } else if (score < 70) {
    roadmap.push({
      priority: 1,
      category: sortedCategories[0]?.[0] || 'inventory',
      action: 'Deploy inventory orchestration platform',
      impact: 'Reduce carrying costs by 15-25%',
      timeline: '4-8 months'
    });
    roadmap.push({
      priority: 2,
      category: 'logistics',
      action: 'Implement transport routing optimization',
      impact: 'Lower logistics costs 10-20%',
      timeline: '3-6 months'
    });
    roadmap.push({
      priority: 3,
      category: 'disruption',
      action: 'Build scenario planning capabilities',
      impact: 'Improve disruption response time by 50%',
      timeline: '2-4 months'
    });
  } else {
    roadmap.push({
      priority: 1,
      category: 'planning',
      action: 'Deploy AI-driven demand sensing',
      impact: 'Achieve 95%+ forecast accuracy',
      timeline: '6-12 months'
    });
    roadmap.push({
      priority: 2,
      category: 'logistics',
      action: 'Implement control tower for end-to-end visibility',
      impact: 'Proactive exception management, 30% faster resolution',
      timeline: '4-8 months'
    });
    roadmap.push({
      priority: 3,
      category: 'supplier',
      action: 'Enable supplier collaboration network',
      impact: 'Reduce lead times by 20-30%',
      timeline: '6-12 months'
    });
  }

  return roadmap;
}

export async function POST(req: NextRequest) {
  try {
    // Limit request body size to prevent DoS
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10000) {
      return NextResponse.json(
        { success: false, error: 'Request body too large' },
        { status: 413 }
      );
    }

    const body = await req.json();
    const { action, answers, industry, email } = body;

    // Validate action parameter
    const validActions = ['get-questions', 'calculate-results', 'save-results'];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be one of: ' + validActions.join(', ') },
        { status: 400 }
      );
    }

    switch (action) {
      case 'get-questions': {
        return NextResponse.json({
          success: true,
          questions: ASSESSMENT_QUESTIONS,
          categories: Object.keys(ASSESSMENT_QUESTIONS)
        });
      }

      case 'calculate-results': {
        if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
          return NextResponse.json(
            { success: false, error: 'Missing or invalid answers. Must be an object.' },
            { status: 400 }
          );
        }

        // Validate answer values
        for (const [key, value] of Object.entries(answers)) {
          if (typeof value !== 'number' || value < 1 || value > 5) {
            return NextResponse.json(
              { success: false, error: `Invalid answer value for ${key}. Must be a number between 1 and 5.` },
              { status: 400 }
            );
          }
        }

        // Sanitize industry parameter
        const validIndustries = ['manufacturing', 'retail', 'healthcare', 'other'];
        const sanitizedIndustry = industry && validIndustries.includes(industry) ? industry : undefined;

        const scores = calculateMaturityScore(answers);
        const maturityLevel = getMaturityLevel(scores.overall);
        const losses = estimateAnnualLosses(scores.overall, sanitizedIndustry);
        const roadmap = getOptimizationRoadmap(scores.overall, scores.categories);

        const potentialSavings = {
          low: Math.round(losses.estimatedLoss * 0.40),
          high: Math.round(losses.estimatedLoss * 0.60)
        };

        return NextResponse.json({
          success: true,
          results: {
            maturityScore: scores.overall,
            maturityLevel: maturityLevel.level,
            maturityColor: maturityLevel.color,
            maturityDescription: maturityLevel.description,
            categoryScores: scores.categories,
            estimatedAnnualLosses: losses.estimatedLoss,
            lossBreakdown: losses.breakdown,
            potentialSavings,
            optimizationRoadmap: roadmap
          }
        });
      }

      case 'save-results': {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
          return NextResponse.json(
            { success: false, error: 'Valid email address is required' },
            { status: 400 }
          );
        }
        
        if (!answers || typeof answers !== 'object') {
          return NextResponse.json(
            { success: false, error: 'Missing or invalid answers' },
            { status: 400 }
          );
        }

        const scores = calculateMaturityScore(answers);
        
        console.log(`[Assessment] Saved results for ${email} - Score: ${scores.overall}`);

        return NextResponse.json({
          success: true,
          message: 'Assessment results saved',
          score: scores.overall
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Assessment API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'ChainFlow Assessment API',
    actions: ['get-questions', 'calculate-results', 'save-results']
  });
}
