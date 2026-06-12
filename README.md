# Premium Doctor Appointment Booking Portal (3D & Interactive)

A high-performance, fully responsive Next.js 14 App Router booking system for a single-doctor clinical practice, styled like a clean professional SaaS analytics dashboard. Features a fully interactive 3D DNA double helix on the homepage, secure Razorpay integration, automated WhatsApp confirmations, and a complete admin slot and patient manager dashboard.

---

## Technical Stack
- **Frontend Framework:** Next.js 14 (App Router)
- **Programming Language:** TypeScript
- **Styling Engine:** Tailwind CSS (v4) with custom themes
- **Component Primitives:** shadcn/ui and Radix UI
- **Animations:** Framer Motion
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **Database Engine:** PostgreSQL via Prisma ORM
- **Payment Processor:** Razorpay SDK (with automatic fallback testing/mocks)
- **Notification Client:** Meta WhatsApp Cloud Business API (with mock console loggers)
- **Deployment Platform:** Stitch deployment pipeline config (`stitch.sh` / `stitch.json` / `Dockerfile`)

---

## Directory Architecture
```bash
Car_Project/
├── app/                      # Next.js App Router Pages & APIs
│   ├── api/                  # Node.js API handlers
│   │   ├── admin/            # Dashboard metrics endpoint
│   │   ├── appointments/     # Booking transactions and details endpoints
│   │   ├── auth/             # Session/cookie login controllers
│   │   └── payments/         # Razorpay checkout creation & verification
│   │   └── slots/            # Schedule generation endpoint
│   ├── admin/                # Dashboard interface (multi-tab panels)
│   ├── book/                 # Stepper scheduler booking page
│   ├── confirmation/[id]/    # Checkout success checkup lists
│   └── page.tsx              # Landing homepage containing 3D elements
├── components/
│   ├── ui/                   # Reusable interface components (button, card, input, etc.)
│   └── medical-3d.tsx        # Client Three.js Canvas (DNA Double Helix)
├── lib/
│   ├── auth.ts               # JWT, bcrypt hashing operations
│   ├── payment.ts            # Razorpay API and signature validation
│   ├── prisma.ts             # Database client singleton
│   └── whatsapp.ts           # WhatsApp templates notification dispatcher
├── prisma/
│   └── schema.prisma         # Database tables models definitions
├── Dockerfile                # Production packaging config
├── stitch.json               # Deployment variables checklist
└── stitch.sh                 # Deployment building script
```

---

## Local Development Installation

### 1. Configure Environment Variables
Create a `.env` file in the root workspace directory with the following variables:
```env
# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/clinic_db?schema=public"

# Auth Secret
JWT_SECRET="generate-a-secure-random-phrase-here"

# Razorpay credentials (Optional - falls back to testing mocks if empty)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# WhatsApp credentials (Optional - falls back to developer terminal logs if empty)
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
```

### 2. Install Packages
Initialize dependencies:
```bash
npm install
```

### 3. Synchronize Database
Push the Prisma database schema into your active PostgreSQL database:
```bash
npx prisma db push
```

### 4. Boot Dev Server
Launch local client server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Testing / Evaluation Checklist

### 1. Default Admin Logins
To log in as the doctor on the Admin Panel (`/admin`), use the pre-configured credentials:
- **Email:** `admin@clinic.com`
- **Password:** `password123`

*(The database will automatically seed this admin user on the first login request if the `User` table is empty.)*

### 2. Slot Creation
As the admin, navigate to **Slots Manager** inside `/admin` to bulk-generate available times (e.g. 9:00 AM - 5:00 PM in 30-minute intervals) for a specific date so patients can book appointments.

### 3. Frictionless Booking Checkouts
Patients booking at `/book` will choose a slot, complete details, and proceed to checkout.
- If **Razorpay keys are omitted**, the app automatically displays a **Mock Checkout Payment** option. Clicking this simulates a successful Razorpay gateway handshake and transitions DB records to paid statuses.
- Confirmation receipts will load on screen, and the mock WhatsApp message details will print directly to your development terminal.

---

## Deploying using Stitch

The project includes `stitch.json` and a `stitch.sh` script to compile and launch.

To run migrations, compile, and spin up production builds:
```bash
# Set script as executable (Unix systems)
chmod +x stitch.sh

# Run migrations and start production deployment
./stitch.sh deploy
```
This script will:
1. Parse variables from `.env`.
2. Sync the Prisma DB schema (`prisma db push`).
3. Compile the production Next.js bundle (`next build`).
4. Generate the Docker package image (`docker build`).
