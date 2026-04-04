/**
 * ChainFlow API - Supply Chain Intelligence Routes
 * Comprehensive REST API for supply chain management
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { blockchainService } from '@/lib/blockchain-service';

// Helper to extract JSON body
async function getBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

// Helper for API responses
function apiResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * AI Demand Forecast Endpoint
 * POST /api/chainflow
 */
export async function POST(req: NextRequest) {
  const body = await getBody(req);
  const { action } = body;

  try {
    switch (action) {
      case 'demand-forecast': {
        const { productId, historicalData, seasonality, promotions, externalFactors } = body;
        
        if (!productId || !historicalData) {
          return apiError('Missing required fields: productId, historicalData');
        }

        const result = await aiService.generateDemandForecast({
          productId: productId as string,
          historicalData: (historicalData as Array<{ date: string; quantity: number }>).map(d => ({
            date: new Date(d.date),
            quantity: d.quantity
          })),
          seasonality: seasonality as boolean,
          promotions: promotions as Array<{ date: Date; impact: number }> | undefined,
          externalFactors: externalFactors as { economicIndex?: number; weatherData?: unknown[]; marketTrends?: unknown[] } | undefined
        });

        return apiResponse({
          success: true,
          forecast: result.forecast,
          insights: result.insights,
          recommendations: result.recommendations
        });
      }

      case 'anomaly-detection': {
        const { metric, dataPoints, threshold } = body;

        if (!metric || !dataPoints) {
          return apiError('Missing required fields: metric, dataPoints');
        }

        const result = await aiService.detectAnomalies({
          metric: metric as string,
          dataPoints: (dataPoints as Array<{ timestamp: string; value: number }>).map(d => ({
            timestamp: new Date(d.timestamp),
            value: d.value
          })),
          threshold: threshold as number | undefined
        });

        return apiResponse({
          success: true,
          ...result
        });
      }

      case 'risk-assessment': {
        const { supplierId, supplierData, externalFactors } = body;

        if (!supplierId || !supplierData) {
          return apiError('Missing required fields: supplierId, supplierData');
        }

        const result = await aiService.assessSupplierRisk({
          supplierId: supplierId as string,
          supplierData: supplierData as {
            performanceScore: number;
            riskScore: number;
            country: string;
            tier: number;
            leadTimeDays: number;
          },
          externalFactors: externalFactors as {
            geopoliticalRisk?: number;
            naturalDisasterRisk?: number;
            financialRisk?: number;
          } | undefined
        });

        return apiResponse({
          success: true,
          riskAssessment: result
        });
      }

      case 'supply-chain-query': {
        const { query, context } = body;

        if (!query) {
          return apiError('Missing required field: query');
        }

        const result = await aiService.processQuery({
          query: query as string,
          context: context as { organizationId?: string; userId?: string; recentActivity?: string[] } | undefined
        });

        return apiResponse({
          success: true,
          ...result
        });
      }

      case 'inventory-optimization': {
        const { products } = body;

        if (!products || !Array.isArray(products)) {
          return apiError('Missing required field: products array');
        }

        const result = await aiService.optimizeInventory({
          products: products as Array<{
            id: string;
            name: string;
            currentStock: number;
            leadTime: number;
            avgDailyDemand: number;
            demandVariability: number;
            serviceLevelTarget: number;
          }>
        });

        return apiResponse({
          success: true,
          ...result
        });
      }

      case 'generate-insights': {
        const { inventory, shipments, suppliers } = body;

        const result = await aiService.generateInsights({
          inventory: (inventory || []) as Array<{ product: string; quantity: number; reorderPoint: number }>,
          shipments: (shipments || []) as Array<{ status: string; count: number }>,
          suppliers: (suppliers || []) as Array<{ name: string; performanceScore: number }>
        });

        return apiResponse({
          success: true,
          ...result
        });
      }

      // Blockchain operations
      case 'blockchain-create-shipment': {
        const { shipmentId, origin, destination, carrier, documents } = body;

        if (!shipmentId || !origin || !destination) {
          return apiError('Missing required fields for shipment');
        }

        const result = await blockchainService.createShipment({
          shipmentId: shipmentId as string,
          origin: origin as string,
          destination: destination as string,
          carrier: (carrier as string) || 'Unknown',
          timestamp: Date.now(),
          status: 'created',
          documents: (documents as string[]) || []
        });

        return apiResponse({
          success: result.success,
          txHash: result.txHash,
          blockNumber: result.blockNumber,
          error: result.error
        });
      }

      case 'blockchain-update-shipment': {
        const { shipmentId, status, location } = body;

        if (!shipmentId || !status) {
          return apiError('Missing required fields: shipmentId, status');
        }

        const result = await blockchainService.updateShipmentStatus(
          shipmentId as string,
          status as string,
          (location as string) || ''
        );

        return apiResponse({
          success: result.success,
          txHash: result.txHash,
          error: result.error
        });
      }

      case 'blockchain-create-escrow': {
        const { supplierAddress, amount, currency, releaseConditions } = body;

        if (!supplierAddress || !amount) {
          return apiError('Missing required fields for escrow');
        }

        const result = await blockchainService.createEscrowPayment(
          supplierAddress as string,
          amount as string,
          (currency as string) || 'USDC',
          (releaseConditions as string) || 'delivery_confirmed'
        );

        return apiResponse({
          success: result.success,
          escrowId: result.escrowId,
          txHash: result.txHash,
          error: result.error
        });
      }

      case 'blockchain-release-escrow': {
        const { escrowId } = body;

        if (!escrowId) {
          return apiError('Missing required field: escrowId');
        }

        const result = await blockchainService.releaseEscrowPayment(escrowId as string);

        return apiResponse({
          success: result.success,
          txHash: result.txHash,
          error: result.error
        });
      }

      case 'blockchain-record-traceability': {
        const { productId, stage, data, actor } = body;

        if (!productId || !stage) {
          return apiError('Missing required fields for traceability');
        }

        const result = await blockchainService.recordTraceabilityEvent(
          productId as string,
          stage as string,
          (data as Record<string, unknown>) || {},
          (actor as string) || 'system'
        );

        return apiResponse({
          success: result.success,
          txHash: result.txHash,
          error: result.error
        });
      }

      case 'blockchain-get-history': {
        const { productId } = body;

        if (!productId) {
          return apiError('Missing required field: productId');
        }

        const result = await blockchainService.getProductHistory(productId as string);

        return apiResponse({
          success: result.success,
          history: result.history,
          error: result.error
        });
      }

      default:
        return apiError(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return apiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
}

/**
 * GET endpoint for blockchain stats and health
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'blockchain-stats': {
        const stats = await blockchainService.getBlockchainStats();
        return apiResponse({ success: true, stats });
      }

      case 'transaction-status': {
        const txHash = searchParams.get('txHash');
        if (!txHash) {
          return apiError('Missing required parameter: txHash');
        }
        const status = await blockchainService.getTransactionStatus(txHash);
        return apiResponse({ success: true, ...status });
      }

      case 'verify-document': {
        const documentHash = searchParams.get('documentHash');
        if (!documentHash) {
          return apiError('Missing required parameter: documentHash');
        }
        const result = await blockchainService.verifyDocument(documentHash);
        return apiResponse({ success: true, ...result });
      }

      default:
        return apiResponse({
          success: true,
          message: 'ChainFlow Supply Chain API',
          version: '2.0.0',
          endpoints: {
            'POST /api/chainflow': {
              actions: [
                'demand-forecast',
                'anomaly-detection',
                'risk-assessment',
                'supply-chain-query',
                'inventory-optimization',
                'generate-insights',
                'blockchain-create-shipment',
                'blockchain-update-shipment',
                'blockchain-create-escrow',
                'blockchain-release-escrow',
                'blockchain-record-traceability',
                'blockchain-get-history'
              ]
            },
            'GET /api/chainflow': {
              actions: [
                'blockchain-stats',
                'transaction-status',
                'verify-document'
              ]
            }
          }
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return apiError(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
}
