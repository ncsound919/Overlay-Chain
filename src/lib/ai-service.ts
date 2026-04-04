/**
 * ChainFlow AI Service
 * Open-source AI integration for supply chain intelligence
 * Using z-ai-web-dev-sdk for LLM capabilities
 */

import ZAI from 'z-ai-web-dev-sdk';

// Types for AI operations
export interface DemandForecastInput {
  productId: string;
  historicalData: Array<{ date: Date; quantity: number }>;
  seasonality?: boolean;
  promotions?: Array<{ date: Date; impact: number }>;
  externalFactors?: {
    economicIndex?: number;
    weatherData?: Array<{ date: Date; temp: number; precipitation: number }>;
    marketTrends?: Array<{ date: Date; trend: number }>;
  };
}

export interface AnomalyDetectionInput {
  metric: string;
  dataPoints: Array<{ timestamp: Date; value: number }>;
  threshold?: number;
}

export interface RiskAssessmentInput {
  supplierId: string;
  supplierData: {
    performanceScore: number;
    riskScore: number;
    country: string;
    tier: number;
    leadTimeDays: number;
  };
  externalFactors?: {
    geopoliticalRisk?: number;
    naturalDisasterRisk?: number;
    financialRisk?: number;
  };
}

export interface ChatQueryInput {
  query: string;
  context?: {
    organizationId?: string;
    userId?: string;
    recentActivity?: string[];
  };
}

// AI Service Class
export class AIService {
  private zai: Awaited<ReturnType<typeof ZAI.create>> | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    this.zai = await ZAI.create();
    this.initialized = true;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Safely parse JSON from AI response with fallback
   */
  private safeJsonParse<T>(jsonString: string, fallback: T): T {
    try {
      // Extract JSON from markdown code blocks if present
      let cleanJson = jsonString.trim();
      
      // Remove markdown code block markers
      const jsonMatch = cleanJson.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleanJson = jsonMatch[1].trim();
      }
      
      return JSON.parse(cleanJson) as T;
    } catch (error) {
      console.error('[AI Service] Failed to parse JSON response:', error);
      console.error('[AI Service] Raw response:', jsonString.substring(0, 200));
      return fallback;
    }
  }

  /**
   * Generate demand forecast using AI
   */
  async generateDemandForecast(input: DemandForecastInput): Promise<{
    forecast: Array<{ date: Date; predictedQty: number; confidence: number }>;
    insights: string[];
    recommendations: string[];
  }> {
    await this.ensureInitialized();

    const prompt = `You are an expert supply chain analyst. Analyze the following historical demand data and generate a 30-day forecast.

Product ID: ${input.productId}
Historical Data (last 90 days):
${input.historicalData.map(d => `${d.date.toISOString().split('T')[0]}: ${d.quantity}`).join('\n')}

Seasonality: ${input.seasonality ? 'Yes' : 'No'}
${input.promotions ? `Upcoming Promotions: ${JSON.stringify(input.promotions)}` : ''}
${input.externalFactors ? `External Factors: ${JSON.stringify(input.externalFactors)}` : ''}

Provide:
1. A 30-day demand forecast with quantities and confidence levels (0-100%)
2. Key insights about demand patterns
3. Actionable recommendations for inventory planning

Format your response as JSON:
{
  "forecast": [{"date": "YYYY-MM-DD", "predictedQty": number, "confidence": number}],
  "insights": ["insight1", "insight2"],
  "recommendations": ["rec1", "rec2"]
}`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a supply chain AI expert. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return this.safeJsonParse(response, { forecast: [], insights: [], recommendations: [] });
  }

  /**
   * Detect anomalies in supply chain metrics
   */
  async detectAnomalies(input: AnomalyDetectionInput): Promise<{
    anomalies: Array<{ timestamp: Date; value: number; severity: 'low' | 'medium' | 'high'; reason: string }>;
    summary: string;
    recommendedActions: string[];
  }> {
    await this.ensureInitialized();

    const prompt = `Analyze the following ${input.metric} data for anomalies. Detect any unusual patterns, outliers, or concerning trends.

Data points:
${input.dataPoints.map(d => `${d.timestamp.toISOString()}: ${d.value}`).join('\n')}

Anomaly threshold: ${input.threshold || 'auto-detect'}

Identify:
1. Any anomalies with severity and reasoning
2. Overall summary of the data pattern
3. Recommended actions if anomalies are found

Format as JSON:
{
  "anomalies": [{"timestamp": "ISO", "value": number, "severity": "low|medium|high", "reason": "string"}],
  "summary": "string",
  "recommendedActions": ["action1", "action2"]
}`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a supply chain monitoring AI. Detect anomalies and provide actionable insights.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return this.safeJsonParse(response, { anomalies: [], summary: '', recommendedActions: [] });
  }

  /**
   * Assess supplier risk
   */
  async assessSupplierRisk(input: RiskAssessmentInput): Promise<{
    overallRiskScore: number;
    riskCategories: Array<{ category: string; score: number; factors: string[] }>;
    mitigationStrategies: string[];
    monitoringRecommendations: string[];
  }> {
    await this.ensureInitialized();

    const prompt = `You are a supply chain risk analyst. Assess the risk profile of the following supplier.

Supplier Data:
- Supplier ID: ${input.supplierId}
- Performance Score: ${input.supplierData.performanceScore}/100
- Current Risk Score: ${input.supplierData.riskScore}/100
- Country: ${input.supplierData.country}
- Tier: ${input.supplierData.tier}
- Lead Time: ${input.supplierData.leadTimeDays} days

External Factors:
${input.externalFactors ? JSON.stringify(input.externalFactors) : 'No additional external factors'}

Provide a comprehensive risk assessment including:
1. Overall risk score (0-100, higher = more risky)
2. Risk by category (supply, quality, delivery, financial, geopolitical)
3. Mitigation strategies
4. Monitoring recommendations

Format as JSON:
{
  "overallRiskScore": number,
  "riskCategories": [{"category": "string", "score": number, "factors": ["string"]}],
  "mitigationStrategies": ["string"],
  "monitoringRecommendations": ["string"]
}`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a supply chain risk expert. Provide thorough, data-driven assessments.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return this.safeJsonParse(response, {
      overallRiskScore: 50,
      riskCategories: [],
      mitigationStrategies: [],
      monitoringRecommendations: []
    });
  }

  /**
   * Natural language supply chain query
   */
  async processQuery(input: ChatQueryInput): Promise<{
    response: string;
    suggestedActions: Array<{ action: string; priority: 'low' | 'medium' | 'high' }>;
    relatedData?: Record<string, unknown>;
  }> {
    await this.ensureInitialized();

    const systemPrompt = `You are ChainFlow AI, an intelligent supply chain assistant. You help users:
- Understand supply chain metrics and KPIs
- Analyze demand forecasts and inventory levels
- Identify risks and recommend mitigation strategies
- Optimize logistics and shipment planning
- Navigate supplier relationships and performance

Be concise, actionable, and data-driven. When suggesting actions, prioritize by urgency.`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input.query }
      ],
      temperature: 0.4,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, I was unable to process your query.';

    return {
      response,
      suggestedActions: [
        { action: 'Review the analysis and take appropriate action', priority: 'medium' }
      ]
    };
  }

  /**
   * Generate supply chain insights from data
   */
  async generateInsights(data: {
    inventory: Array<{ product: string; quantity: number; reorderPoint: number }>;
    shipments: Array<{ status: string; count: number }>;
    suppliers: Array<{ name: string; performanceScore: number }>;
  }): Promise<{
    insights: Array<{ category: string; insight: string; impact: 'positive' | 'negative' | 'neutral' }>;
    alerts: Array<{ severity: 'info' | 'warning' | 'critical'; message: string }>;
    recommendations: string[];
  }> {
    await this.ensureInitialized();

    const prompt = `Analyze the following supply chain data and generate actionable insights.

Inventory Status:
${JSON.stringify(data.inventory, null, 2)}

Shipment Status Distribution:
${JSON.stringify(data.shipments, null, 2)}

Supplier Performance:
${JSON.stringify(data.suppliers, null, 2)}

Generate:
1. Key insights across categories (inventory, logistics, suppliers)
2. Alerts for any concerning patterns
3. Strategic recommendations

Format as JSON:
{
  "insights": [{"category": "string", "insight": "string", "impact": "positive|negative|neutral"}],
  "alerts": [{"severity": "info|warning|critical", "message": "string"}],
  "recommendations": ["string"]
}`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a supply chain analytics expert. Provide strategic insights.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return this.safeJsonParse(response, {
      insights: [],
      alerts: [],
      recommendations: []
    });
  }

  /**
   * Optimize inventory levels
   */
  async optimizeInventory(data: {
    products: Array<{
      id: string;
      name: string;
      currentStock: number;
      leadTime: number;
      avgDailyDemand: number;
      demandVariability: number;
      serviceLevelTarget: number;
    }>;
  }): Promise<{
    recommendations: Array<{
      productId: string;
      reorderPoint: number;
      safetyStock: number;
      orderQuantity: number;
      expectedServiceLevel: number;
      reasoning: string;
    }>;
    totalSavings: number;
    riskReduction: string;
  }> {
    await this.ensureInitialized();

    const prompt = `As a supply chain optimization expert, analyze the following inventory data and provide optimal stocking recommendations.

Products:
${JSON.stringify(data.products, null, 2)}

For each product, calculate and recommend:
1. Optimal reorder point
2. Safety stock level
3. Economic order quantity (EOQ)
4. Expected service level
5. Reasoning for the recommendation

Also provide:
- Estimated total carrying cost savings
- Overall risk reduction assessment

Format as JSON:
{
  "recommendations": [{"productId": "string", "reorderPoint": number, "safetyStock": number, "orderQuantity": number, "expectedServiceLevel": number, "reasoning": "string"}],
  "totalSavings": number,
  "riskReduction": "string"
}`;

    const completion = await this.zai!.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an inventory optimization specialist. Use EOQ, safety stock, and reorder point calculations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    return this.safeJsonParse(response, {
      recommendations: [],
      totalSavings: 0,
      riskReduction: 'Unable to calculate'
    });
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export convenient function for quick AI queries
export async function queryAI(prompt: string, context?: Record<string, unknown>) {
  return aiService.processQuery({
    query: prompt,
    context
  });
}
