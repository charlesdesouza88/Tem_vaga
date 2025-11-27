export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            User: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    passwordHash: string
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    passwordHash: string
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    passwordHash?: string
                    createdAt?: string
                    updatedAt?: string
                }
            }
            Business: {
                Row: {
                    id: string
                    ownerId: string
                    nome: string
                    slug: string
                    endereco: string | null
                    cidade: string | null
                    estado: string | null
                    telefoneWhats: string
                    politicaCancel: string | null
                    autoReplyEnabled: boolean
                    autoReplyConfig: Json | null
                    googleRefreshToken: string | null
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    ownerId: string
                    nome: string
                    slug: string
                    endereco?: string | null
                    cidade?: string | null
                    estado?: string | null
                    telefoneWhats: string
                    politicaCancel?: string | null
                    autoReplyEnabled?: boolean
                    autoReplyConfig?: Json | null
                    googleRefreshToken?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    ownerId?: string
                    nome?: string
                    slug?: string
                    endereco?: string | null
                    cidade?: string | null
                    estado?: string | null
                    telefoneWhats?: string
                    politicaCancel?: string | null
                    autoReplyEnabled?: boolean
                    autoReplyConfig?: Json | null
                    googleRefreshToken?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
            }
            Servico: {
                Row: {
                    id: string
                    businessId: string
                    nome: string
                    descricao: string | null
                    preco: number
                    duracaoMin: number
                    ativo: boolean
                }
                Insert: {
                    id?: string
                    businessId: string
                    nome: string
                    descricao?: string | null
                    preco: number
                    duracaoMin: number
                    ativo?: boolean
                }
                Update: {
                    id?: string
                    businessId?: string
                    nome?: string
                    descricao?: string | null
                    preco?: number
                    duracaoMin?: number
                    ativo?: boolean
                }
            }
            HorarioAtendimento: {
                Row: {
                    id: string
                    businessId: string
                    diaSemana: number
                    inicioMin: number
                    fimMin: number
                    ativo: boolean
                }
                Insert: {
                    id?: string
                    businessId: string
                    diaSemana: number
                    inicioMin: number
                    fimMin: number
                    ativo?: boolean
                }
                Update: {
                    id?: string
                    businessId?: string
                    diaSemana?: number
                    inicioMin?: number
                    fimMin?: number
                    ativo?: boolean
                }
            }
            Booking: {
                Row: {
                    id: string
                    businessId: string
                    servicoId: string
                    clienteNome: string
                    clienteWhats: string
                    dataHora: string
                    status: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
                    cancellationReason: string | null
                    cancelledAt: string | null
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    businessId: string
                    servicoId: string
                    clienteNome: string
                    clienteWhats: string
                    dataHora: string
                    status?: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
                    cancellationReason?: string | null
                    cancelledAt?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    businessId?: string
                    servicoId?: string
                    clienteNome?: string
                    clienteWhats?: string
                    dataHora?: string
                    status?: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
                    cancellationReason?: string | null
                    cancelledAt?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
            }
            WaitlistEntry: {
                Row: {
                    id: string
                    businessId: string
                    clienteNome: string
                    clienteWhats: string
                    dataDesejada: string
                    preferencia: string | null
                    status: 'ATIVO' | 'OFERECIDO' | 'ACEITO' | 'PULADO'
                    createdAt: string
                    updatedAt: string
                    bookingId: string | null
                }
                Insert: {
                    id?: string
                    businessId: string
                    clienteNome: string
                    clienteWhats: string
                    dataDesejada: string
                    preferencia?: string | null
                    status?: 'ATIVO' | 'OFERECIDO' | 'ACEITO' | 'PULADO'
                    createdAt?: string
                    updatedAt?: string
                    bookingId?: string | null
                }
                Update: {
                    id?: string
                    businessId?: string
                    clienteNome?: string
                    clienteWhats?: string
                    dataDesejada?: string
                    preferencia?: string | null
                    status?: 'ATIVO' | 'OFERECIDO' | 'ACEITO' | 'PULADO'
                    createdAt?: string
                    updatedAt?: string
                    bookingId?: string | null
                }
            }
        }
        Views: {
            [_: string]: {
                Row: {
                    [key: string]: Json
                }
            }
        }
        Functions: {
            [_: string]: {
                Args: {
                    [key: string]: Json
                }
                Returns: Json
            }
        }
        Enums: {
            BookingStatus: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
            WaitlistStatus: 'ATIVO' | 'OFERECIDO' | 'ACEITO' | 'PULADO'
        }
    }
}
