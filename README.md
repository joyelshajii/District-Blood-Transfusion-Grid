# District Blood Transfusion Grid &bull; Ernakulam Sector Pilot

> High-concurrency civic healthcare coordination infrastructure engineered for sub-10ms algorithmic matching latency, zero external runtime microservices, strict cryptographic contact data isolation, and standards-compliant optical verification.

---

## 1. Problem Statement & Mission

Broad WhatsApp broadcast chains fail during medical emergencies. They flood civic groups, disturb donors who donated recently, expose personal telephone numbers to commercial marketing scrapers, and waste hours while acute trauma patients wait for compatible blood.

The **District Blood Transfusion Grid** replaces unencrypted broadcast spam with deterministic, consent-driven algorithmic coordination:
- **Verified Hospital Demand**: Requisitions originate strictly from accredited hospital coordinators.
- **Clinical Interval Guard**: Enforces strict NBTC recovery intervals (90 days male / 120 days female for Whole Blood, 14 days for Platelet Apheresis).
- **Cryptographic Token Vault**: Volunteer phone numbers and identities are locked behind transient pseudonym tokens (`DONOR-EKM-XXX`) until explicit voluntary consent.
- **Zero Third-Party Dependencies**: Pure Go HTTP engine with embedded SQLite (zero CGO) and a standalone React 18 SPA.

---

## 2. Core Architecture Topology

```
┌─────────────────────────────────────────────────────────────┐
│                 1. Presentation Layer (SPA)                 │
│    React 18 + TypeScript • Clinical Dispatch Design System  │
│     Pure Math QR Model 2 • Code 128 / ISBT 128 Barcodes     │
│       Web Audio API Synthesizers • Web Push Telemetry       │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API (sub-10ms)
┌──────────────────────────────▼──────────────────────────────┐
│                    2. Go API Core (Engine)                  │
│       High-throughput Goroutine dispatch • Golang 1.27      │
│      Haversine Great-Circle radial distance math (km)       │
│        NBTC clinical cooldown filter (90d / 120d / 14d)     │
│        Cryptographic transient pseudonym token vault        │
└──────────────────────────────┬──────────────────────────────┘
                               │ ACID Transactions
┌──────────────────────────────▼──────────────────────────────┐
│                  3. Relational Vault (SQLite)               │
│        Pure Go SQLite Driver (modernc.org/sqlite)           │
│    Zero CGO compiler requirement • Standalone database file │
│       Immutable tamper-evident privacy access ledger        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Subsystem Enhancements

### A. Mathematical QR Code Model 2 Engine (`frontend/src/utils/qrCode.tsx`)
- Zero external npm libraries or cloud generator APIs.
- ISO/IEC 18004 specification implemented in pure TypeScript.
- Galois Field GF(256) arithmetic, generator polynomials, and Reed-Solomon Error Correction (Levels L, M, Q, H).
- Outputs scalable vector SVG path data for offline on-site admission vouchers.

### B. Optical Code 128 & ISBT 128 DIN Barcodes (`frontend/src/utils/barcode.tsx`)
- High-density Code 128 (Subset B) and Code 39 barcode engine with modulo-103 checksums.
- Automatic formatting of international ISBT 128 Donation Identification Numbers (`=W4821 26 104820 00`) for transfusion bags and physical manifests.

### C. On-Site Digital Admission Scanner Desk (`frontend/src/components/QRVoucherScanner.tsx`)
- Multi-channel verification desk:
  1. Live optical camera reticle scanner (`navigator.mediaDevices.getUserMedia`).
  2. Image screenshot dropzone with simulated decoding.
  3. Alphanumeric Voucher Token direct keyboard entry.
- Direct backend audit logging (`POST /api/requests/{id}/checkin`) and parking bay allocation.

### D. Web Audio API Acoustic Dispatch Synthesizer (`frontend/src/utils/soundEngine.ts`)
- Synthesizes real-time clinical audio telemetry without external audio files:
  - **Code Crimson Alarm**: Alternating 880Hz / 659Hz urgent warning chime.
  - **Acceptance Chime**: Ascending 4-tone harmonic chord (C5 &rarr; E5 &rarr; G5 &rarr; C6).
  - **Scan Verified Ping**: High-precision 1046Hz &rarr; 1318Hz terminal confirmation ping.
  - Global audio mute/unmute control with localStorage state persistence.

### E. Print-Ready Cold-Chain Transport Manifests (`frontend/src/components/TransportSlipModal.tsx`)
- Schedule F Part XII-B compliant physical transport slips for insulated bio-transport containers (+2°C to +6°C).
- Chain-of-custody handover tables, courier vehicle records, and thermal sign-offs.

---

## 4. Single-Command Deployment

The entire system compiles into a single, self-sufficient binary combining the embedded SQLite database and the compiled React production bundle:

```bash
# 1. Compile frontend client bundle
cd frontend
npm run build

# 2. Compile standalone Go backend executable
cd ..
go build -o server.exe .

# 3. Launch on port 8080 (or cloud PORT environment)
./server.exe -port 8080 -frontend frontend/dist
```

---

## 5. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and readiness check |
| `GET` | `/api/stats` | District-wide donor registry and anti-spam metrics |
| `GET` | `/api/requests` | List all hospital blood requisitions |
| `POST` | `/api/requests` | Create an emergency hospital requisition |
| `POST` | `/api/requests/{id}/match` | Run algorithmic compatibility and interval matching |
| `POST` | `/api/requests/{id}/dispatch` | Dispatch tokenized alerts to eligible candidates |
| `GET` | `/api/requests/{id}/accepted-donors` | Retrieve unmasked contact desk for accepted donors |
| `POST` | `/api/requests/{id}/checkin` | Verify on-site voucher pass and record audit event |
| `GET` | `/api/donor/dispatch/{token}` | Anonymous volunteer decision portal |
| `POST` | `/api/donor/dispatch/{token}/respond` | Volunteer explicit Accept or Decline action |
| `GET` | `/api/donors` | Public volunteer registry (masked phone numbers) |
| `POST` | `/api/donors` | Register volunteer donor with privacy protection |
| `GET` | `/api/audit-logs` | Immutable privacy and access audit ledger |

---

## 6. Engineering Credits

- **Challenge**: SC-12 District Blood Donor Matching (Track 3: Public Welfare)
- **Selection Round**: AANAVANDITHON 2026 &bull; Jain School of Future, Kochi
- **Engineering Institution**: Amal Jyothi College of Engineering (AJCE), Autonomous, Kerala
