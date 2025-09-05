"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AgentSettings } from "./agent-settings"
import { User, Bot, CreditCard } from "lucide-react"
import { GeneralSection } from "./general-settings"
import { BillingSettings } from "./billing-settings"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    name: string
    email: string
    avatar: string
  }
}

const settingsTabs = [
  { id: "general", label: "General", icon: User },
  { id: "agent", label: "Agent", icon: Bot },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export function SettingsDialog({ open, onOpenChange, user }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("general")

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSection user={user} />
      case "agent":
        return <AgentSettings />
      case "billing":
        return <BillingSettings />
      default:
        return <GeneralSection user={user} />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1000px] h-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          <div className="w-48 border-r bg-neutral-50/50">
            <nav className="p-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1 h-9"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-1 overflow-auto">
            {renderTabContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
