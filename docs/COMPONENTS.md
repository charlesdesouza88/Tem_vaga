# Component Guide

Quick reference for common UI components in the Tem_vaga design system.

## Buttons

### Primary Button
Use for main actions (submit, confirm, create).

```tsx
<button className="px-6 py-4 bg-primary-600 text-white font-bold text-base rounded-xl hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 transition-colors shadow-lg hover:shadow-xl">
  Confirmar Agendamento
</button>
```

### Secondary Button
Use for alternative actions (cancel, back, secondary options).

```tsx
<button className="px-6 py-3 bg-white text-neutral-700 font-semibold text-base rounded-xl border-2 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all">
  Cancelar
</button>
```

### Icon Button
Use for actions with icons.

```tsx
<button className="p-3 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 border-2 border-primary-200 transition-colors">
  <Calendar size={20} />
</button>
```

---

## Form Elements

### Text Input
```tsx
<div>
  <label className="block text-sm font-semibold text-neutral-700 mb-2">
    Nome Completo *
  </label>
  <input
    type="text"
    required
    className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
    placeholder="Ex: Maria Silva"
  />
</div>
```

### Textarea
```tsx
<div>
  <label className="block text-sm font-semibold text-neutral-700 mb-2">
    Observações (Opcional)
  </label>
  <textarea
    className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
    rows={3}
    placeholder="Alguma preferência?"
  />
</div>
```

### Checkbox
```tsx
<div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="waitlist"
    className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-200"
  />
  <label htmlFor="waitlist" className="text-sm text-neutral-700">
    Quero entrar na fila de espera
  </label>
</div>
```

---

## Cards

### Basic Card
```tsx
<div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
  <h2 className="text-xl font-bold text-neutral-900 mb-2">
    Card Title
  </h2>
  <p className="text-neutral-600">
    Card content goes here
  </p>
</div>
```

### Interactive Card (Clickable)
```tsx
<button className="w-full text-left p-6 rounded-2xl bg-white border-2 border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all">
  <h3 className="font-semibold text-neutral-900 text-lg mb-1">
    Service Name
  </h3>
  <p className="text-sm text-neutral-600">
    Service description
  </p>
</button>
```

### Header Card
```tsx
<div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
  <h1 className="text-3xl font-bold text-neutral-900">
    Page Title
  </h1>
  <p className="text-neutral-600 mt-1">
    Page description
  </p>
</div>
```

---

## Badges

### Status Badge (Success)
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
  Confirmado
</span>
```

### Status Badge (Error)
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
  Cancelado
</span>
```

### Status Badge (Warning)
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
  Pendente
</span>
```

---

## Alerts

### Error Alert
```tsx
<div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm">
  Erro ao processar sua solicitação. Tente novamente.
</div>
```

### Success Alert
```tsx
<div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl text-sm">
  ✓ Operação realizada com sucesso!
</div>
```

### Info Alert
```tsx
<div className="bg-primary-50 border-2 border-primary-200 text-primary-700 p-4 rounded-xl text-sm">
  ℹ️ Informação importante para o usuário.
</div>
```

---

## Loading States

### Button Loading
```tsx
<button
  disabled
  className="px-6 py-4 bg-primary-600 text-white font-bold rounded-xl opacity-50 cursor-not-allowed"
>
  Carregando...
</button>
```

### Spinner
```tsx
<div className="text-center py-12">
  <Clock className="animate-spin mx-auto mb-3 text-primary-600" size={32} />
  <p className="text-sm text-neutral-500">Carregando...</p>
</div>
```

### Skeleton (Placeholder)
```tsx
<div className="space-y-3">
  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
  <div className="h-12 bg-neutral-200 rounded-xl animate-pulse" />
</div>
```

---

## Empty States

### No Data
```tsx
<div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-neutral-300">
  <Calendar className="mx-auto mb-4 text-neutral-400" size={48} />
  <p className="text-neutral-600 font-medium">Nenhum item encontrado</p>
  <p className="text-neutral-500 text-sm mt-1">
    Novos itens aparecerão aqui
  </p>
</div>
```

---

## Navigation

### Back Button
```tsx
<button
  onClick={() => window.history.back()}
  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
>
  <ChevronLeft size={20} />
  <span className="font-medium">Voltar</span>
</button>
```

### Breadcrumb
```tsx
<div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
  <button onClick={() => setStep(1)} className="hover:text-primary-600 font-medium transition-colors">
    Serviços
  </button>
  <ChevronRight size={14} />
  <span className="font-semibold text-neutral-700">Data e Hora</span>
</div>
```

---

## Progress Indicators

### Progress Bar
```tsx
<div className="flex gap-2">
  {[1, 2, 3].map((s) => (
    <div
      key={s}
      className={`flex-1 h-2 rounded-full transition-all ${
        step >= s ? 'bg-primary-600' : 'bg-neutral-200'
      }`}
    />
  ))}
</div>
```

---

## Grids & Layouts

### Two-Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Three-Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Stack (Vertical Spacing)
```tsx
<div className="space-y-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## Common Patterns

### Page Container
```tsx
<div className="min-h-screen bg-neutral-50 py-12 px-4">
  <div className="max-w-7xl mx-auto space-y-6">
    {/* Page content */}
  </div>
</div>
```

### Centered Content
```tsx
<div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
  <div className="max-w-md w-full">
    {/* Centered content */}
  </div>
</div>
```

### Form Container
```tsx
<form className="space-y-5">
  {/* Form fields */}
</form>
```

---

## Icons

Using Lucide React:

```tsx
import { Calendar, Clock, Check, X, ChevronRight } from "lucide-react"

<Calendar size={20} className="text-primary-600" />
<Clock size={16} className="text-neutral-500" />
<Check size={24} strokeWidth={2.5} />
```

Common sizes:
- Small: 16px
- Medium: 20px
- Large: 24px
- Extra Large: 32px

---

## Responsive Utilities

### Show/Hide on Mobile
```tsx
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

### Responsive Text
```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### Responsive Padding
```tsx
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## Accessibility

### Focus Visible
All interactive elements should have:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
```

### ARIA Labels
```tsx
<button aria-label="Close dialog">
  <X size={20} />
</button>
```

### Semantic HTML
Use proper elements:
- `<button>` for actions
- `<a>` for navigation
- `<h1>-<h6>` for headings
- `<label>` for form labels

---

## Copy-Paste Examples

### Complete Form
```tsx
<form className="space-y-5">
  <div>
    <label className="block text-sm font-semibold text-neutral-700 mb-2">
      Nome *
    </label>
    <input
      type="text"
      required
      className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
    />
  </div>

  <button
    type="submit"
    className="w-full px-6 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
  >
    Enviar
  </button>
</form>
```

### Complete Card
```tsx
<div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all">
  <div className="flex items-center gap-4 mb-4">
    <div className="p-4 bg-primary-100 text-primary-600 rounded-xl">
      <Calendar size={28} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Card Title</h2>
      <p className="text-sm text-neutral-500">Subtitle</p>
    </div>
  </div>
  <p className="text-neutral-600 mb-4">
    Card description goes here
  </p>
  <button className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
    Action
  </button>
</div>
```

---

For more details, see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
