import { Booking, Business, WaitlistEntry } from "@prisma/client"

export async function sendWhatsAppMessage(to: string, body: string) {
    // For now, just console.log. Later: call WhatsApp Cloud API.
    console.log("[WHATSAPP MOCK]", { to, body });
}

export async function sendBookingConfirmation(booking: Booking, business: Business) {
    const message = `Olá ${booking.clienteNome}, seu agendamento com ${business.nome} está confirmado para ${booking.dataHora.toLocaleString('pt-BR')}.`
    await sendWhatsAppMessage(booking.clienteWhats, message)
}

export async function sendCancellationNotification(booking: Booking, business: Business) {
    const message = `Olá ${booking.clienteNome}, seu agendamento com ${business.nome} para ${booking.dataHora.toLocaleString('pt-BR')} foi cancelado.`
    await sendWhatsAppMessage(booking.clienteWhats, message)
}

export async function sendWaitlistOffer(entry: WaitlistEntry, booking: Booking, business: Business) {
    const message = `Olá ${entry.clienteNome}, surgiu uma vaga com ${business.nome} em ${booking.dataHora.toLocaleString('pt-BR')}. Responda SIM para agendar.`
    await sendWhatsAppMessage(entry.clienteWhats, message)
}
