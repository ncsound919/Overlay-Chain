/**
 * ChainFlow Scenario Simulator API
 * Real-time supply chain scenario modeling and impact analysis
 */

import { NextRequest, NextResponse } from 'next/server';

// Simulation models and parameters
interface SimulationInput {
  supplierDelay: number;      // days
  tariffIncrease: number;     // percentage
  warehouseCapacity: number;  // percentage
  inventoryBuffer: number;    // days
  routeDisruptions: number;   // count
  demandVariance?: number;    // percentage
  currencyFluctuation?: number; // percentage
  laborCostIncrease?: number;  // percentage
}

interface SimulationOutput {
  serviceLevel: number;
  costIncrease: number;
  fulfillmentSpeed: number;
  inventoryTurnover: number;
  cashFlowImpact: number;
  riskScore: number;
  recommendations: string[];
}

// Monte Carlo simulation for uncertainty
function runMonteCarloSimulation(input: SimulationInput, iterations: number = 1000): SimulationOutput {
  const results: SimulationOutput[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Add randomness to each variable
    const noise = () => (Math.random() - 0.5) * 0.1; // ±5% noise
    
    const delayedInput = {
      supplierDelay: input.supplierDelay * (1 + noise()),
      tariffIncrease: input.tariffIncrease * (1 + noise()),
      warehouseCapacity: input.warehouseCapacity * (1 + noise()),
      inventoryBuffer: input.inventoryBuffer * (1 + noise()),
      routeDisruptions: input.routeDisruptions * (1 + noise()),
    };
    
    results.push(calculateDeterministicImpact(delayedInput));
  }
  
  // Average the results
  return {
    serviceLevel: Math.round(results.reduce((s, r) => s + r.serviceLevel, 0) / iterations * 10) / 10,
    costIncrease: Math.round(results.reduce((s, r) => s + r.costIncrease, 0) / iterations * 10) / 10,
    fulfillmentSpeed: Math.round(results.reduce((s, r) => s + r.fulfillmentSpeed, 0) / iterations * 10) / 10,
    inventoryTurnover: Math.round(results.reduce((s, r) => s + r.inventoryTurnover, 0) / iterations * 10) / 10,
    cashFlowImpact: Math.round(results.reduce((s, r) => s + r.cashFlowImpact, 0) / iterations),
    riskScore: Math.round(results.reduce((s, r) => s + r.riskScore, 0) / iterations),
    recommendations: results[0].recommendations // Use first result's recommendations
  };
}

function calculateDeterministicImpact(input: SimulationInput): SimulationOutput {
  // Base values (optimal conditions)
  const baseServiceLevel = 98;
  const baseCost = 100;
  const baseSpeed = 100;
  const baseTurnover = 12; // turns per year
  
  // Impact calculations based on supply chain dynamics
  // Supplier delays directly impact service level and fulfillment speed
  const supplierDelayImpact = {
    service: -input.supplierDelay * 0.8,
    speed: -input.supplierDelay * 1.5,
    cost: input.supplierDelay * 1.2
  };
  
  // Tariff increases primarily affect cost
  const tariffImpact = {
    service: -input.tariffIncrease * 0.2,
    speed: 0,
    cost: input.tariffIncrease * 2.0
  };
  
  // Warehouse capacity affects flexibility and service
  const warehouseImpact = {
    service: input.warehouseCapacity * 0.02 - 2, // Diminishing returns above optimal
    speed: (input.warehouseCapacity - 85) * 0.1,
    cost: -input.warehouseCapacity * 0.1
  };
  
  // Inventory buffer is a double-edged sword
  const inventoryImpact = {
    service: input.inventoryBuffer * 0.1,
    speed: 0,
    cost: input.inventoryBuffer * 0.5
  };
  
  // Route disruptions have major impacts
  const routeImpact = {
    service: -input.routeDisruptions * 1.5,
    speed: -input.routeDisruptions * 2.0,
    cost: input.routeDisruptions * 3.0
  };
  
  // Calculate final values
  const serviceLevel = Math.max(50, Math.min(100, 
    baseServiceLevel + 
    supplierDelayImpact.service + 
    tariffImpact.service + 
    warehouseImpact.service + 
    inventoryImpact.service + 
    routeImpact.service
  ));
  
  const costIncrease = Math.max(0,
    supplierDelayImpact.cost +
    tariffImpact.cost +
    warehouseImpact.cost +
    inventoryImpact.cost +
    routeImpact.cost
  );
  
  const fulfillmentSpeed = Math.max(30, Math.min(100,
    baseSpeed +
    supplierDelayImpact.speed +
    tariffImpact.speed +
    warehouseImpact.speed +
    inventoryImpact.speed +
    routeImpact.speed
  ));
  
  const inventoryTurnover = Math.max(4, baseTurnover - (input.inventoryBuffer / 10) - (input.supplierDelay / 5));
  
  // Cash flow impact (in thousands)
  const cashFlowImpact = Math.round(
    -costIncrease * 1000 - 
    input.inventoryBuffer * 50 -
    input.supplierDelay * 200
  );
  
  // Risk score (0-100, higher is riskier)
  const riskScore = Math.round(
    50 +
    input.supplierDelay * 1.5 +
    input.tariffIncrease -
    input.warehouseCapacity * 0.2 +
    (100 - input.inventoryBuffer) * 0.3 +
    input.routeDisruptions * 10
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(input, { serviceLevel, costIncrease, fulfillmentSpeed, riskScore });
  
  return {
    serviceLevel,
    costIncrease,
    fulfillmentSpeed,
    inventoryTurnover,
    cashFlowImpact,
    riskScore,
    recommendations
  };
}

function generateRecommendations(input: SimulationInput, output: Partial<SimulationOutput>): string[] {
  const recommendations: string[] = [];
  
  if (input.supplierDelay > 7) {
    recommendations.push('Consider dual-sourcing critical components to mitigate supplier delays');
  }
  
  if (input.tariffIncrease > 10) {
    recommendations.push('Explore nearshoring options or tariff engineering strategies');
  }
  
  if (input.warehouseCapacity < 70) {
    recommendations.push('Expand warehouse capacity or implement dynamic overflow partnerships');
  }
  
  if (input.inventoryBuffer > 30 && output.costIncrease && output.costIncrease > 15) {
    recommendations.push('Optimize inventory buffers using AI-driven demand sensing to reduce carrying costs');
  }
  
  if (input.routeDisruptions > 2) {
    recommendations.push('Implement multi-modal transport options and real-time route optimization');
  }
  
  if (output.serviceLevel && output.serviceLevel < 85) {
    recommendations.push('Deploy safety stock optimization across all critical SKUs');
  }
  
  if (output.riskScore && output.riskScore > 70) {
    recommendations.push('Establish supply chain control tower for proactive risk management');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Supply chain is operating well - focus on continuous improvement');
  }
  
  return recommendations;
}

// Preset scenarios
const PRESET_SCENARIOS = {
  'baseline': {
    name: 'Baseline (Optimal Conditions)',
    description: 'Normal operations with no disruptions',
    input: {
      supplierDelay: 0,
      tariffIncrease: 0,
      warehouseCapacity: 85,
      inventoryBuffer: 14,
      routeDisruptions: 0
    }
  },
  'trade-war': {
    name: 'Trade War Scenario',
    description: '25% tariff increase with supply chain restructuring',
    input: {
      supplierDelay: 5,
      tariffIncrease: 25,
      warehouseCapacity: 75,
      inventoryBuffer: 30,
      routeDisruptions: 1
    }
  },
  'pandemic': {
    name: 'Pandemic Disruption',
    description: 'Severe supply disruptions similar to COVID-19',
    input: {
      supplierDelay: 21,
      tariffIncrease: 0,
      warehouseCapacity: 60,
      inventoryBuffer: 45,
      routeDisruptions: 3
    }
  },
  'natural-disaster': {
    name: 'Natural Disaster',
    description: 'Major route disruptions and supplier impacts',
    input: {
      supplierDelay: 14,
      tariffIncrease: 0,
      warehouseCapacity: 70,
      inventoryBuffer: 30,
      routeDisruptions: 4
    }
  },
  'optimal': {
    name: 'Optimized Supply Chain',
    description: 'Best practices implementation',
    input: {
      supplierDelay: 0,
      tariffIncrease: 0,
      warehouseCapacity: 95,
      inventoryBuffer: 7,
      routeDisruptions: 0
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, input, useMonteCarlo, iterations } = body;

    switch (action) {
      case 'simulate': {
        if (!input) {
          return NextResponse.json(
            { success: false, error: 'Missing simulation input' },
            { status: 400 }
          );
        }

        const result = useMonteCarlo 
          ? runMonteCarloSimulation(input, iterations || 1000)
          : calculateDeterministicImpact(input);

        return NextResponse.json({
          success: true,
          input,
          result
        });
      }

      case 'compare-scenarios': {
        const scenarios = body.scenarios || ['baseline', 'trade-war', 'pandemic'];
        const results: Record<string, { input: SimulationInput; output: SimulationOutput }> = {};

        for (const scenarioKey of scenarios) {
          const preset = PRESET_SCENARIOS[scenarioKey as keyof typeof PRESET_SCENARIOS];
          if (preset) {
            results[scenarioKey] = {
              input: preset.input,
              output: calculateDeterministicImpact(preset.input)
            };
          }
        }

        return NextResponse.json({
          success: true,
          scenarios: results
        });
      }

      case 'get-presets': {
        return NextResponse.json({
          success: true,
          presets: PRESET_SCENARIOS
        });
      }

      case 'sensitivity-analysis': {
        const { variable, range, baseInput } = body;
        
        if (!variable || !range || !baseInput) {
          return NextResponse.json(
            { success: false, error: 'Missing sensitivity analysis parameters' },
            { status: 400 }
          );
        }

        const results: Array<{ value: number; output: SimulationOutput }> = [];
        const steps = range.steps || 10;
        const stepSize = (range.max - range.min) / steps;

        for (let i = 0; i <= steps; i++) {
          const value = range.min + (stepSize * i);
          const testInput = { ...baseInput, [variable]: value };
          results.push({
            value: Math.round(value * 10) / 10,
            output: calculateDeterministicImpact(testInput)
          });
        }

        return NextResponse.json({
          success: true,
          variable,
          results
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Simulator API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'ChainFlow Scenario Simulator API',
    actions: ['simulate', 'compare-scenarios', 'get-presets', 'sensitivity-analysis'],
    presets: Object.keys(PRESET_SCENARIOS)
  });
}
