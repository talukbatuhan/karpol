# KARPOL — Global Industrial Manufacturing Website

> **Precision Engineered. Globally Delivered.**

---

## 🏭 About

Premium industrial manufacturing website for **KARPOL** — specializing in polyurethane, rubber, silicone, Viton, PTFE, aluminum, and engineering plastic components for global industries.

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, TypeScript) |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **Styling** | Vanilla CSS + CSS Custom Properties |
| **Deployment** | Vercel |
| **Analytics** | Google Analytics 4 |

## 📁 Project Structure

```
karpolnet/
├── docs/                         # Project documentation
│   ├── strategy/                 # Website strategy & architecture
│   ├── development/              # Dev guides, changelog, tracker, SQL schema
│   ├── design/                   # Visual design system
│   ├── seo/                      # SEO playbook & keywords
│   ├── content/                  # Content calendar & articles
│   └── notes/                    # Session notes
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/
│   │   ├── products/
│   │   ├── industries/
│   │   ├── custom-manufacturing/
│   │   ├── factory-technology/
│   │   ├── knowledge/
│   │   ├── catalog/
│   │   └── contact/
│   ├── components/               # React components
│   │   ├── ui/                   # Buttons, cards, modals
│   │   ├── layout/               # Header, footer, navigation
│   │   ├── sections/             # Homepage sections
│   │   ├── products/             # Product-specific components
│   │   └── forms/                # RFQ, contact forms
│   ├── lib/                      # Supabase clients, config
│   ├── types/                    # TypeScript type definitions
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
└── public/                       # Static assets
    └── images/                   # Products, factory, hero, industries
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the SQL schema: `docs/development/supabase_schema.sql`

## 📋 Documentation

| Document | Description |
|---|---|
| [Website Strategy](docs/strategy/website_strategy.md) | Full 14-section digital strategy |
| [Development Guide](docs/development/development_guide.md) | Tech standards & workflow |
| [Development Tracker](docs/development/tracker.md) | Task progress tracking |
| [Component Checklist](docs/development/component_checklist.md) | 38 components to build |
| [Supabase Schema](docs/development/supabase_schema.sql) | Database tables & seed data |
| [Design System](docs/design/design_system.md) | Colors, typography, spacing |
| [SEO Playbook](docs/seo/seo_playbook.md) | Keywords, schema.org, i18n |
| [Content Calendar](docs/content/content_calendar.md) | Article schedule & templates |
| [Session Notes](docs/notes/session_notes.md) | Development session logs |
| [Changelog](docs/development/CHANGELOG.md) | Version history |

---

*KARPOL © 2026 — All Rights Reserved*
