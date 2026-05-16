# 🤖 PROMPT DE IMPLEMENTAÇÃO: DESIGN SYSTEM ZENITH FLOW

## 📌 OBJETIVO
Aplicar o design system **Zenith Flow** em um projeto Next.js (App Router) + Tailwind CSS. Substituir estilos existentes, configurar tokens de design, criar componentes base reutilizáveis e garantir a estética Minimalist-Glassmorphic com estados de `Foco` e `Pausa`.

## 🛠️ REGRAS DE EXECUÇÃO PARA O CLAUDE
1. Não remova lógica de negócio existente. Apenas substitua/adicione estilos e componentes UI.
2. Siga estritamente a paleta, tipografia e espaçamento definidos abaixo.
3. Use CSS Variables para cores e Tailwind para utilitários.
4. Mantenha acessibilidade (contraste, `aria-labels`, estados `:focus-visible`).
5. Crie os arquivos exatamente nos caminhos indicados.
6. Após a implementação, valide visualmente os estados de `Foco` (Indigo) e `Break` (Sage Green).

---

## 📐 PASSO 1: CONFIGURAÇÃO DO TAILWIND (`tailwind.config.ts`)
Substitua ou mescle com seu `tailwind.config.ts` existente:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--color-surface)',
          dim: 'var(--color-surface-dim)',
          bright: 'var(--color-surface-bright)',
          container: {
            lowest: 'var(--color-surface-container-lowest)',
            low: 'var(--color-surface-container-low)',
            DEFAULT: 'var(--color-surface-container)',
            high: 'var(--color-surface-container-high)',
            highest: 'var(--color-surface-container-highest)',
          },
        },
        on: {
          surface: 'var(--color-on-surface)',
          'surface-variant': 'var(--color-on-surface-variant)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          container: 'var(--color-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          container: 'var(--color-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          container: 'var(--color-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          container: 'var(--color-error-container)',
        },
      },
      fontFamily: {
        display: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        '4px': '4px',
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '40px': '40px',
        '64px': '64px',
        gutter: '20px',
        margin: '24px',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🌍 PASSO 2: ESTILOS GLOBAIS (`app/globals.css`)
Adicione/substitua no topo do seu CSS global:

```css
@import "tailwindcss";

:root {
  /* Cores Base */
  --color-surface: #051424;
  --color-surface-dim: #051424;
  --color-surface-bright: #2c3a4c;
  --color-surface-container-lowest: #010f1f;
  --color-surface-container-low: #0d1c2d;
  --color-surface-container: #122131;
  --color-surface-container-high: #1c2b3c;
  --color-surface-container-highest: #273647;
  
  --color-on-surface: #d4e4fa;
  --color-on-surface-variant: #c8c5d0;
  --color-outline: #928f9a;
  --color-outline-variant: #47464f;
  --color-surface-tint: #c4c1fb;

  /* Estados & Ações */
  --color-primary: #c4c1fb;
  --color-on-primary: #2d2a5b;
  --color-primary-container: #1e1b4b;
  --color-secondary: #4edea3;
  --color-on-secondary: #003824;
  --color-secondary-container: #00a572;
  --color-tertiary: #ffb95f;
  --color-on-tertiary: #472a00;
  --color-tertiary-container: #331d00;
  --color-error: #ffb4ab;
  --color-on-error: #690005;
  --color-error-container: #93000a;

  /* Tipografia */
  --font-geist: 'Geist', system-ui, sans-serif;
  --font-inter: 'Inter', system-ui, sans-serif;
}

@theme inline {
  --color-background: var(--color-surface);
  --color-foreground: var(--color-on-surface);
}

body {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
  font-family: var(--font-inter);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Glassmorphism Utilities */
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg, 1rem);
}

.glass-float {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md, 0.75rem);
  box-shadow: 0 8px 32px rgba(30, 27, 75, 0.15);
}
```

---

## 🧩 PASSO 3: COMPONENTES BASE (`components/ui/`)

### `components/ui/GlassCard.tsx`
```tsx
import { ReactNode } from 'react';

export default function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass-panel p-6 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}
```

### `components/ui/Button.tsx`
```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  state?: 'focus' | 'break';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', state = 'focus', className = '', ...props }, ref) => {
    const base = 'font-display font-medium text-sm tracking-wide transition-all duration-200 rounded-md px-5 py-2.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-primary';
    
    const variants: Record<Variant, string> = {
      primary: state === 'focus' 
        ? 'bg-primary text-on-primary hover:bg-primary/90' 
        : 'bg-secondary text-on-secondary hover:bg-secondary/90',
      secondary: state === 'focus'
        ? 'bg-primary-container text-primary hover:bg-primary-container/80'
        : 'bg-secondary-container text-on-secondary hover:bg-secondary-container/80',
      ghost: 'bg-white/5 text-on-surface border border-white/20 hover:bg-white/10',
    };

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = 'Button';
```

### `components/ui/Input.tsx`
```tsx
import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full bg-white/5 border-b-2 border-outline-variant text-on-surface px-3 py-2.5 focus:border-secondary focus:outline-none focus:bg-white/8 transition-all placeholder:text-on-surface-variant/50 ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';
```

### `components/ui/Chip.tsx`
```tsx
import { ReactNode } from 'react';

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wider transition-colors ${
      active 
        ? 'bg-secondary/20 text-secondary border border-secondary/30' 
        : 'bg-white/10 text-on-surface-variant border border-white/10'
    }`}>
      {children}
    </span>
  );
}
```

### `components/ui/CircularProgress.tsx`
```tsx
interface Props {
  progress: number; // 0 a 100
  state: 'focus' | 'break';
  label: string;
}

export function CircularProgress({ progress, state, label }: Props) {
  const color = state === 'focus' ? 'var(--color-primary)' : 'var(--color-secondary)';
  const trackColor = state === 'focus' ? 'rgba(196,193,251,0.1)' : 'rgba(78,222,163,0.1)';
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke={trackColor} strokeWidth="12" />
        <circle
          cx="100" cy="100" r={radius} fill="none" stroke={color}
          strokeWidth="12" strokeDasharray={circumference}
          strokeDashoffset={offset} strokeLinecap="butt"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display font-bold text-4xl text-on-surface tracking-tight">{label}</span>
      </div>
    </div>
  );
}
```

### `components/ui/AIRecordingIndicator.tsx`
```tsx
export function AIRecordingIndicator({ isRecording }: { isRecording: boolean }) {
  if (!isRecording) return null;
  return (
    <div className="flex items-center gap-2 text-secondary">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
      </span>
      <span className="text-sm font-medium tracking-wide">Gravando...</span>
    </div>
  );
}
```

---

## ✅ PASSO 4: VALIDAÇÃO & REGRAS FINAIS
1. **Layout Desktop**: Centralize o conteúdo principal com `max-w-[1200px] mx-auto px-gutter`.
2. **Reflow Mobile**: Use `flex-col md:flex-row` para painéis secundários. O `CircularProgress` deve ficar no topo centralizado.
3. **Estados de Foco/Pausa**: Troque variáveis de cor via classe ou estado React. Ex: `<CircularProgress state={isFocus ? 'focus' : 'break'} ... />`
4. **Tipografia**:
   - Títulos/Dados numéricos: `font-display`
   - Corpo/Notas: `font-body`
5. **Sombras**: Use apenas `shadow-ambient` customizado se necessário: `box-shadow: 0 8px 32px rgba(30,27,75,0.15);`

🟢 **Ao finalizar, execute:** `pnpm dev` (ou `npm run dev`) e verifique:
- [ ] Contraste adequado em todos os estados
- [ ] Efeito glassmorphic funcionando sem "sujeira" visual
- [ ] Transições suaves entre Foco ↔ Pausa
- [ ] Inputs com cursor secundário (sage green) ao focar
- [ ] Componentes responsivos (stack em mobile)

Se algum componente existir no projeto, adapte-o para usar as classes `glass-panel`, `font-display`, `font-body` e as variáveis de cor definidas. Não altere a lógica interna, apenas a camada visual.
```

### 💡 Como usar com o Claude:
1. Copie todo o conteúdo acima.
2. Cole no prompt do Claude com o contexto: `"Siga este guia passo a passo para aplicar o design system no meu projeto Next.js. Não pule etapas. Confirme quando cada arquivo for criado."`
3. O Claude vai gerar/alterar os arquivos automaticamente. Se você já tem componentes prontos, ele vai injetar as classes do Zenith Flow neles.
