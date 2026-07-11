'use client';

import { Brain, Clock } from 'lucide-react';
import { AIAnalysis } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { timeAgo } from '../../lib/utils';

export function AIAnalysisCard({ analysis }: { analysis: AIAnalysis | null }) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" />
              AI Analysis
            </div>
          </CardTitle>
        </CardHeader>
        <div className="text-center py-6 text-gray-500 text-sm">
          Analysis pending... (updates every 90 seconds)
        </div>
      </Card>
    );
  }

  const severityVariant = (s: string) => {
    if (s === 'CRITICAL') return 'critical';
    if (s === 'WARNING') return 'warning';
    if (s === 'INFO') return 'info';
    return 'success';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            AI Analysis
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={severityVariant(analysis.severity) as 'critical' | 'warning' | 'info' | 'success'}>
            {analysis.severity}
          </Badge>
          {analysis.updatedAt && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {timeAgo(analysis.updatedAt)}
            </div>
          )}
        </div>
      </CardHeader>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-1">{analysis.title}</h4>
          <p className="text-sm text-gray-400 leading-relaxed">{analysis.message}</p>
        </div>

        <div className="bg-bg-secondary rounded-lg p-3 border border-bg-border">
          <p className="text-xs font-medium text-accent mb-1">Recommended Action</p>
          <p className="text-sm text-gray-300">{analysis.actionRequired}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 bg-bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{analysis.confidence}%</span>
            </div>
          </div>
          {analysis.estimatedDailyLoss > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Est. Daily Loss</p>
              <p className="text-sm font-medium text-red-400">₹{analysis.estimatedDailyLoss}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
