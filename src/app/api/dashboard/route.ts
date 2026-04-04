/**
 * ChainFlow Dashboard API
 * Real-time supply chain metrics and KPIs
 */

import { NextRequest, NextResponse } from 'next/server';

// Simulated real-time data generators
function generateRealtimeData() {
  const now = Date.now();
  
  return {
    timestamp: now,
    kpis: {
      inventoryHealth: {
        value: 94.2 + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 3,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      onTimeDelivery: {
        value: 96.8 + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 2,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      stockoutRisk: {
        value: 3.2 + (Math.random() - 0.5) * 1,
        change: (Math.random() - 0.5) * 1,
        trend: Math.random() > 0.5 ? 'down' : 'up'
      },
      expediteSpend: {
        value: 127 + Math.round((Math.random() - 0.5) * 20),
        change: (Math.random() - 0.5) * 15,
        trend: Math.random() > 0.5 ? 'down' : 'up'
      }
    },
    shipments: generateShipments(),
    suppliers: generateSupplierPerformance(),
    alerts: generateAlerts(),
    recommendations: generateRecommendations()
  };
}

function generateShipments() {
  const origins = ['Shanghai', 'Shenzhen', 'Rotterdam', 'Hamburg', 'Singapore', 'Tokyo', 'Mumbai', 'Busan'];
  const destinations = ['Los Angeles', 'New York', 'Chicago', 'Miami', 'Seattle', 'Dallas', 'Atlanta', 'Boston'];
  const statuses = ['In Transit', 'Customs', 'Delivered', 'Delayed'];
  const statusWeights = [0.5, 0.2, 0.2, 0.1];
  
  return Array.from({ length: 8 }, (_, i) => {
    const statusIndex = weightedRandom(statusWeights);
    return {
      id: `SHP-${2800 + i}`,
      origin: origins[i % origins.length],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      status: statuses[statusIndex],
      progress: statuses[statusIndex] === 'Delivered' ? 100 : Math.floor(Math.random() * 60) + 20,
      eta: statuses[statusIndex] === 'Delivered' ? 'Completed' : `${Math.floor(Math.random() * 7) + 1} days`,
      lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString()
    };
  });
}

function generateSupplierPerformance() {
  const suppliers = [
    'Alpha Manufacturing',
    'Pacific Components',
    'EuroSource Ltd',
    'AsiaTech Solutions',
    'Global Materials Inc',
    'Precision Parts Co'
  ];
  
  return suppliers.map(name => ({
    name,
    score: Math.floor(Math.random() * 30) + 70,
    trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
    onTimeRate: Math.floor(Math.random() * 20) + 80,
    qualityRate: Math.floor(Math.random() * 15) + 85,
    responseTime: Math.floor(Math.random() * 24) + 4
  }));
}

function generateAlerts() {
  const alertTypes = [
    { severity: 'critical', message: 'Shipment SHP-2849 delayed 5 days - Chicago delivery at risk', category: 'logistics' },
    { severity: 'warning', message: 'EuroSource Ltd performance dropped below threshold', category: 'supplier' },
    { severity: 'info', message: 'New tariff regulations effective next month', category: 'compliance' },
    { severity: 'warning', message: 'Inventory levels for SKU-1420 series below safety stock', category: 'inventory' },
    { severity: 'critical', message: 'Port congestion in Shanghai - 3 day delay expected', category: 'logistics' }
  ];
  
  return alertTypes
    .filter(() => Math.random() > 0.3)
    .slice(0, 4)
    .map((alert, i) => ({
      ...alert,
      id: `ALT-${1000 + i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
}

function generateRecommendations() {
  return [
    {
      id: 1,
      priority: 'high',
      category: 'logistics',
      action: 'Expedite SHP-2849',
      impact: '5-day delay risk to Chicago',
      estimatedSavings: '$45,000'
    },
    {
      id: 2,
      priority: 'medium',
      category: 'supplier',
      action: 'Review EuroSource contract',
      impact: 'Performance dropped to 72%',
      estimatedSavings: '$120,000/year'
    },
    {
      id: 3,
      priority: 'low',
      category: 'inventory',
      action: 'Optimize SKUs 1420-1435',
      impact: 'Potential 12% cost savings',
      estimatedSavings: '$85,000'
    }
  ];
}

function weightedRandom(weights: number[]): number {
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return i;
  }
  return weights.length - 1;
}

// Historical trend data
function generateHistoricalTrends(days: number = 30) {
  const now = Date.now();
  const dayMs = 86400000;
  
  return {
    serviceLevel: Array.from({ length: days }, (_, i) => ({
      date: new Date(now - (days - i) * dayMs).toISOString().split('T')[0],
      value: 95 + Math.sin(i / 7) * 3 + (Math.random() - 0.5) * 2
    })),
    cost: Array.from({ length: days }, (_, i) => ({
      date: new Date(now - (days - i) * dayMs).toISOString().split('T')[0],
      value: 100 + Math.sin(i / 5) * 8 + (Math.random() - 0.5) * 5
    })),
    inventory: Array.from({ length: days }, (_, i) => ({
      date: new Date(now - (days - i) * dayMs).toISOString().split('T')[0],
      value: 92 + Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 3
    }))
  };
}

// Blockchain transaction feed
function generateBlockchainFeed() {
  return Array.from({ length: 5 }, (_, i) => ({
    txHash: '0x' + Math.random().toString(16).slice(2, 66),
    type: ['shipment_created', 'payment_released', 'document_verified', 'status_update', 'escrow_created'][i],
    timestamp: new Date(Date.now() - i * 300000).toISOString(),
    status: i === 0 ? 'pending' : 'confirmed',
    blockNumber: 18000000 + Math.floor(Math.random() * 100000)
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'get-realtime': {
        return NextResponse.json({
          success: true,
          data: generateRealtimeData()
        });
      }

      case 'get-trends': {
        const { days } = body;
        return NextResponse.json({
          success: true,
          trends: generateHistoricalTrends(days || 30)
        });
      }

      case 'get-blockchain-feed': {
        return NextResponse.json({
          success: true,
          feed: generateBlockchainFeed()
        });
      }

      case 'get-inventory-heatmap': {
        // Generate warehouse inventory heatmap data
        const warehouses = ['WH-NYC', 'WH-LAX', 'WH-CHI', 'WH-MIA', 'WH-SEA'];
        const categories = ['Electronics', 'Apparel', 'Food', 'Auto Parts', 'Medical'];
        
        const heatmap = warehouses.map(warehouse => 
          categories.map(category => ({
            warehouse,
            category,
            utilization: Math.floor(Math.random() * 60) + 40,
            risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
          }))
        ).flat();

        return NextResponse.json({
          success: true,
          heatmap
        });
      }

      case 'get-demand-forecast': {
        const products = ['SKU-1001', 'SKU-1002', 'SKU-1003', 'SKU-1004', 'SKU-1005'];
        const now = Date.now();
        
        const forecast = products.map(product => ({
          product,
          currentStock: Math.floor(Math.random() * 500) + 100,
          predictedDemand: Math.floor(Math.random() * 200) + 50,
          confidence: Math.floor(Math.random() * 20) + 80,
          stockoutRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
          recommendedOrder: Math.floor(Math.random() * 300) + 50
        }));

        return NextResponse.json({
          success: true,
          forecast,
          generatedAt: new Date().toISOString()
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'realtime') {
    return NextResponse.json({
      success: true,
      data: generateRealtimeData()
    });
  }

  return NextResponse.json({
    success: true,
    message: 'ChainFlow Dashboard API',
    actions: ['get-realtime', 'get-trends', 'get-blockchain-feed', 'get-inventory-heatmap', 'get-demand-forecast']
  });
}
