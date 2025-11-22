"use client"

import { useState } from "react"
import { Business, Servico } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
// I don't have Select component installed properly, I'll use native select for now or just map buttons.

export function BookingForm({ business }: { business: Business & { servicos: Servico[] } }) {
    const [step, setStep] = useState(1)
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [formData, setFormData] = useState({ name: "", phone: "", obs: "", waitlist: false })

    const services = business.servicos

    // Mock slots
    const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

    const handleSubmit = async () => {
        // Submit to API
        alert("Booking submitted (mock)")
    }

    if (step === 1) {
        return (
            <Card>
                <CardHeader><CardTitle>Selecione um serviço</CardTitle></CardHeader>
                <CardContent className="grid gap-2">
                    {services.map(s => (
                        <Button key={s.id} variant={selectedService === s.id ? "default" : "outline"}
                            className="justify-start h-auto py-3"
                            onClick={() => { setSelectedService(s.id); setStep(2); }}
                        >
                            <div className="text-left">
                                <div className="font-bold">{s.nome}</div>
                                <div className="text-sm opacity-80">R$ {(s.preco / 100).toFixed(2)} • {s.duracaoMin} min</div>
                            </div>
                        </Button>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (step === 2) {
        return (
            <Card>
                <CardHeader><CardTitle>Escolha o horário</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Data</Label>
                        <Input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    {selectedDate && (
                        <div className="grid grid-cols-3 gap-2">
                            {slots.map(slot => (
                                <Button key={slot} variant={selectedTime === slot ? "default" : "outline"}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
                        <Button disabled={!selectedTime || !selectedDate} onClick={() => setStep(3)}>Continuar</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (step === 3) {
        return (
            <Card>
                <CardHeader><CardTitle>Seus dados</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp</Label>
                        <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="waitlist" checked={formData.waitlist} onChange={e => setFormData({ ...formData, waitlist: e.target.checked })} className="h-4 w-4" />
                        <Label htmlFor="waitlist">Quero entrar na fila de espera se abrir horário mais cedo</Label>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
                        <Button onClick={handleSubmit}>Agendar</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return null
}
