"use client";

import * as React from "react";
import { useState } from "react";
import { IconChartLine, IconDotsVertical, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ChartDataItem } from "@/lib/data/types";
import { 
  TechnicalAnalysisMethod, 
  technicalAnalysisMethods,
  calculateSMA,
  calculateEMA
} from "@/lib/data/technical-analysis";

interface ChartTechnicalAnalysisProps {
  chartData: ChartDataItem[];
  onApplyIndicator: (
    indicatorId: string, 
    data: (number | null)[], 
    options: { period: number; color: string; name: string }
  ) => void;
  onRemoveIndicator: (indicatorId: string) => void;
}

export function ChartTechnicalAnalysis({
  chartData,
  onApplyIndicator,
  onRemoveIndicator,
}: ChartTechnicalAnalysisProps) {
  const [selectedMethod, setSelectedMethod] = useState<TechnicalAnalysisMethod | null>(null);
  const [period, setPeriod] = useState<number>(20);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  // Handle selecting a method
  const handleSelectMethod = (method: TechnicalAnalysisMethod) => {
    setSelectedMethod(method);
    setPeriod(method.defaultPeriod || 20);
    setIsPopoverOpen(false);
    
    // Apply the indicator immediately with default settings
    applyIndicator(method, method.defaultPeriod || 20);
  };

  // Apply the selected indicator to the chart
  const applyIndicator = (method: TechnicalAnalysisMethod, periodValue: number) => {
    if (!chartData.length) return;
    
    let indicatorData: (number | null)[] = [];
    
    // Calculate the indicator data based on the method
    switch (method.id) {
      case "sma":
        indicatorData = calculateSMA(chartData, periodValue);
        break;
      case "ema":
        indicatorData = calculateEMA(chartData, periodValue);
        break;
      default:
        return;
    }
    
    // Add to active indicators if not already active
    if (!activeIndicators.includes(method.id)) {
      setActiveIndicators([...activeIndicators, method.id]);
    }
    
    // Call the parent component's callback to apply the indicator
    onApplyIndicator(method.id, indicatorData, {
      period: periodValue,
      color: method.color || "rgba(75, 192, 192, 1)",
      name: `${method.name} (${periodValue})`
    });
  };

  // Remove an indicator from the chart
  const handleRemoveIndicator = (indicatorId: string) => {
    setActiveIndicators(activeIndicators.filter(id => id !== indicatorId));
    onRemoveIndicator(indicatorId);
    
    // If the removed indicator is the selected one, reset the selected method
    if (selectedMethod?.id === indicatorId) {
      setSelectedMethod(null);
    }
  };

  // Update indicator settings
  const handleUpdateSettings = () => {
    if (selectedMethod) {
      applyIndicator(selectedMethod, period);
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
          >
            <IconChartLine className="size-4" />
            <span>Technical Analysis</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search analysis methods..." />
            <CommandList>
              <CommandEmpty>No methods found.</CommandEmpty>
              <CommandGroup heading="Available Methods">
                {technicalAnalysisMethods.map((method) => (
                  <CommandItem
                    key={method.id}
                    onSelect={() => handleSelectMethod(method)}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span>{method.name}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {method.description}
                      </p>
                    </div>
                    {activeIndicators.includes(method.id) && (
                      <Badge variant="secondary" className="ml-2">Active</Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Active Indicators */}
      <div className="flex items-center gap-2">
        {activeIndicators.map((indicatorId) => {
          const method = technicalAnalysisMethods.find(m => m.id === indicatorId);
          if (!method) return null;
          
          return (
            <div key={indicatorId} className="flex items-center">
              <Badge 
                variant="outline" 
                className="flex items-center gap-1"
                style={{ borderColor: method.color, color: method.color }}
              >
                <span>{method.name}</span>
                <div className="flex items-center">
                  <Popover open={isSettingsOpen && selectedMethod?.id === indicatorId} onOpenChange={(open) => {
                    setIsSettingsOpen(open);
                    if (open) setSelectedMethod(method);
                  }}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                        <IconDotsVertical className="size-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">{method.name} Settings</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Period</span>
                            <span className="text-sm font-medium">{period}</span>
                          </div>
                          <Slider
                            value={[period]}
                            min={method.minPeriod || 5}
                            max={method.maxPeriod || 200}
                            step={1}
                            onValueChange={(value) => setPeriod(value[0])}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button size="sm" onClick={handleUpdateSettings}>Apply</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => handleRemoveIndicator(indicatorId)}
                  >
                    <IconX className="size-3" />
                  </Button>
                </div>
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}