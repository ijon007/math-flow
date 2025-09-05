"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function AgentSettings() {
  const [responseDetail, setResponseDetail] = useState([2])
  const [explanationStyle, setExplanationStyle] = useState("mixed")

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-4">AI Preferences</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Response Detail Level</Label>
            <div className="px-1 mt-3">
              <Slider
                value={responseDetail}
                onValueChange={setResponseDetail}
                max={3}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Concise</span>
                <span>Detailed</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Explanation Style</Label>
            <Select value={explanationStyle} onValueChange={setExplanationStyle}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner-friendly</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Learning Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Default Difficulty</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
