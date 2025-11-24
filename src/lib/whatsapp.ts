import { Booking, Business, WaitlistEntry } from "@prisma/client"

const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

async function sendTemplateMessage(to: string, templateName: string, languageCode: string = "en_US") {
    if (!WHATSAPP_TOKEN) {
        console.error("WHATSAPP_ACCESS_TOKEN is missing")
        return
    }

    try {
        const res = await fetch(WHATSAPP_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: languageCode
                    }
                }
            })
        })

        const data = await res.json()
        if (!res.ok) {
            console.error("WhatsApp API Error:", data)
        } else {
            console.log("WhatsApp Message Sent:", data)
        }
    } catch (error) {
        console.error("WhatsApp Fetch Error:", error)
    }
}

export async function sendWhatsAppMessage(to: string, body: string) {
    if (!WHATSAPP_TOKEN) {
        console.error("WHATSAPP_ACCESS_TOKEN is missing")
        return
    }

    try {
        const res = await fetch(WHATSAPP_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: { body: body }
            })
        })

        const data = await res.json()
        if (!res.ok) {
            console.error("WhatsApp Text API Error:", data)
        } else {
            console.log("WhatsApp Text Sent:", data)
        }
    } catch (error) {
        console.error("WhatsApp Text Fetch Error:", error)
    }
}

export async function sendBookingConfirmation(booking: Booking, business: Business) {
    // Use hello_world template for testing as it's pre-approved
    console.log(`Sending booking confirmation to ${booking.clienteWhats}`)
    await sendTemplateMessage(booking.clienteWhats, "hello_world")
}

export async function sendCancellationNotification(booking: Booking, business: Business) {
    console.log(`Sending cancellation to ${booking.clienteWhats}`)
    await sendTemplateMessage(booking.clienteWhats, "hello_world")
}

export async function sendWaitlistOffer(entry: WaitlistEntry, booking: Booking, business: Business) {
    console.log(`Sending waitlist offer to ${entry.clienteWhats}`)
    await sendTemplateMessage(entry.clienteWhats, "hello_world")
}
