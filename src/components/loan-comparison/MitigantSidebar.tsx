
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mitigant } from '@/pages/LoanComparison';

interface MitigantSidebarProps {
  mitigants: Mitigant[];
  selectedMitigants: string[];
  onToggle: (mitigantId: string) => void;
  readonly?: boolean;
}

const MitigantSidebar = ({ 
  mitigants, 
  selectedMitigants, 
  onToggle,
  readonly = false
}: MitigantSidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">IRR Mitigants</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Select options to potentially lower your maximum rate:
        </p>
        
        <div className="space-y-4">
          {mitigants.map((mitigant) => (
            <div key={mitigant.id} className="flex items-start space-x-2">
              <Checkbox 
                id={mitigant.id}
                checked={selectedMitigants.includes(mitigant.id)}
                onCheckedChange={() => {
                  if (!readonly) {
                    onToggle(mitigant.id);
                  }
                }}
                disabled={readonly}
                className="mt-1"
              />
              <div>
                <label
                  htmlFor={mitigant.id}
                  className="font-medium cursor-pointer text-sm"
                >
                  {mitigant.label}
                </label>
                <p className="text-xs text-gray-500">{mitigant.description}</p>
                <p className="text-xs text-green-600 mt-1">
                  Reduces rate by {(mitigant.bpsReduction / 100).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {readonly && (
          <p className="text-xs text-gray-500 mt-4">
            These selections are from your saved plan. Visit the plan builder to make changes.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MitigantSidebar;
