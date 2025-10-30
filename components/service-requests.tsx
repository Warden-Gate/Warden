"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle2, AlertCircle, X } from "lucide-react"
import { useServiceRequests } from "@/contexts/service-request-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ServiceRequestsProps {
  walletAddress: string | null
}

export default function ServiceRequests({ walletAddress }: ServiceRequestsProps) {
  const { requests, createRequest, acceptRequest, completeRequest } = useServiceRequests()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward: "",
    requiredReputation: 1000,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "in_progress":
        return <Clock className="w-5 h-5 text-accent" />
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "failed":
        return <X className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-accent/20 text-accent border-accent/50">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">Failed</Badge>
      case "cancelled":
        return <Badge className="bg-muted/50 text-muted-foreground border-border/50">Cancelled</Badge>
      default:
        return null
    }
  }

  const handleCreateRequest = () => {
    if (formData.title && formData.description && walletAddress) {
      createRequest({
        title: formData.title,
        description: formData.description,
        type: "custom",
        status: "pending",
        requiredReputation: formData.requiredReputation,
        reward: formData.reward,
        createdBy: walletAddress,
        parameters: {},
      })
      setFormData({ title: "", description: "", reward: "", requiredReputation: 1000 })
      setIsOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Service Requests</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Service Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Title</Label>
                <Input
                  placeholder="Request title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Description</Label>
                <Textarea
                  placeholder="Describe your request"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Reward (SOL)</Label>
                <Input
                  placeholder="0.5"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label className="text-foreground">Required Reputation</Label>
                <Input
                  type="number"
                  value={formData.requiredReputation}
                  onChange={(e) => setFormData({ ...formData, requiredReputation: Number.parseInt(e.target.value) })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button
                onClick={handleCreateRequest}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Create Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="bg-card/50 border-border/50 backdrop-blur p-6 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {getStatusIcon(request.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Required Reputation</p>
                <p className="font-semibold text-foreground">{request.requiredReputation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reward</p>
                <p className="font-semibold text-accent">{request.reward}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="font-semibold text-foreground">
                  {request.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>

            {request.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                  onClick={() => acceptRequest(request.id, walletAddress || "")}
                >
                  Accept Request
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border text-foreground hover:bg-card flex-1 bg-transparent"
                >
                  View Details
                </Button>
              </div>
            )}

            {request.status === "in_progress" && (
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/50 flex-1"
                  onClick={() => completeRequest(request.id, 5)}
                >
                  Mark Complete
                </Button>
              </div>
            )}

            {request.status === "completed" && request.rating && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Rating: {request.rating}/5</p>
                {request.feedback && <p className="text-sm text-foreground italic">"{request.feedback}"</p>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
