# Factory export price rebalance — awaiting owner approval

**Proposal only. No recipes, copper inputs, production times or live export prices have been modified.**

The original catalogue is profitable around the $0.60/g equilibrium under minimal staffing, but most products lose opportunity value around $1/g. This proposal gives commodity products modest margins and complex goods larger value-added margins at $1/g. It leaves substantial high-copper-price risk.

## Exact assumptions

- One funded output per job, neutral country, no news, quality, reputation or agreement bonus; no optional workers. All figures are fictional game money.
- Copper cost is the **current sale opportunity** of the exact Standard copper consumed. Historical purchase cost is separate. Raw-copper direct sales have no buy spread; no 1% copper-purchase fee is counted here. If copper is bought for production, add its actual purchase spread to cash accounting.
- Manufacturing fee = authored fee × 85%, applying the existing specified A2 production-fee discount. Copper inputs get no discount.
- Minimum paid automation wages: F01–10 Operator $1B/job; F11–20 Operator + Supervisor $21B/job; F21–25 Operator + Factory Manager $101B/job. Shared hires are permanent capital costs, not recharged per product. No workers are granted by this proposal. Manual net is the listed net plus those wages.
- **Proposed freight per dispatch:** `ceil[(0.0075 × locked gross + $250M × occupied cargo-volume × route base minutes / 15) × (1 − 0.03 × Export Logistics rank)]`. Ranks 0–10; never negative. The comparison uses Australia’s 15-minute route and rank 0. Other countries use the authored route lengths; vessel speed changes ETA, not this freight distance factor. For multiple goods, compute percentage freight per line plus handling for total occupied volume, and round the final dispatch total once.
- No wages during idle time or return voyages. Wages are reserved once when a paid production job starts. Batch N multiplies copper/fees, while a job’s wages are amortized across N outputs; shipping handling scales by cargo volume.
- Net margin = `(locked gross − current copper opportunity − fee − allocated wages − freight) / locked gross`. No gross revenue is called profit. No facility, vessel or worker purchase amortization is assumed; those are shown separately below.
- Proposed prices are the smallest whole-$1B prices reaching the product-specific margin floor at $1/g, never below the original. Floors span 8–35% according to processing complexity; prices and floors are design proposals requiring approval.

## Comparison

Each cell is **original margin → proposed margin** at that copper price, after A2 fees, minimal wages and proposed freight. Exact dollar net results are in [the CSV](rebalance.csv). Displayed B/T/Q prices retain every whole-$1B step exactly; the CSV also retains whole-dollar net results.

| Product | Original export | Proposed export | $0.30/g | $0.60/g | $1.00/g | $1.50/g | $2.00/g |
|---|---:|---:|---:|---:|---:|---:|---:|
| F01 Copper Wire Bundle | $450B | $615B | 52.4% → 65.0% | 19.1% → 40.6% | -25.4% → 8.1% | -80.9% → -32.6% | -136.5% → -73.2% |
| F02 Industrial Copper Cable | $950B | $1.265T | 54.1% → 65.3% | 22.5% → 41.6% | -19.6% → 10.0% | -72.2% → -29.5% | -124.8% → -69.0% |
| F03 Copper Plumbing Pipe Set | $1.45T | $1.86T | 54.6% → 64.5% | 23.6% → 40.3% | -17.8% → 8.0% | -69.5% → -32.3% | -121.2% → -72.6% |
| F04 Copper Sheet Pallet | $2T | $2.492T | 55.6% → 64.2% | 25.6% → 40.1% | -14.4% → 8.0% | -64.4% → -32.1% | -114.4% → -72.2% |
| F05 Copper Cooling Tube Assembly | $3.1T | $4.217T | 56.5% → 67.8% | 27.4% → 46.5% | -11.3% → 18.0% | -59.7% → -17.6% | -108.0% → -53.1% |
| F06 Electric Motor Winding Set | $4.2T | $5.456T | 56.5% → 66.3% | 27.9% → 44.3% | -10.2% → 15.0% | -57.8% → -21.6% | -105.4% → -58.3% |
| F07 Transformer Coil Assembly | $5.3T | $6.845T | 56.5% → 66.1% | 28.2% → 44.2% | -9.6% → 15.0% | -56.7% → -21.5% | -103.9% → -58.0% |
| F08 Industrial Wiring Harness | $7.5T | $9.978T | 56.5% → 67.1% | 28.5% → 46.1% | -8.8% → 18.0% | -55.5% → -17.1% | -102.2% → -52.1% |
| F09 Generator Stator Winding | $10.8T | $14.298T | 56.5% → 67.0% | 28.7% → 46.0% | -8.3% → 18.0% | -54.6% → -17.0% | -100.9% → -51.9% |
| F10 Copper Heat Exchanger | $16.5T | $22.148T | 56.5% → 67.4% | 29.2% → 47.1% | -7.1% → 20.0% | -52.6% → -13.8% | -98.0% → -47.7% |
| F11 Precision Copper Connector Kit | $22T | $33.823T | 56.4% → 71.4% | 29.1% → 53.6% | -7.2% → 30.0% | -52.7% → 0.4% | -98.1% → -29.1% |
| F12 Power Distribution Busbar Set | $33T | $40.255T | 56.5% → 64.2% | 29.2% → 41.8% | -7.2% → 12.0% | -52.6% → -25.3% | -98.1% → -62.5% |
| F13 Industrial Cooling Module | $56T | $78.818T | 57.2% → 69.4% | 30.5% → 50.4% | -5.3% → 25.0% | -49.9% → -6.7% | -94.5% → -38.4% |
| F14 High-Voltage Cable Assembly | $86T | $105.19T | 57.2% → 64.9% | 31.1% → 43.5% | -3.8% → 15.0% | -47.4% → -20.6% | -91.0% → -56.3% |
| F15 Industrial Generator Module | $115T | $149.807T | 56.9% → 66.7% | 30.8% → 46.7% | -4.0% → 20.0% | -47.5% → -13.4% | -90.9% → -46.8% |
| F16 Heavy Transformer Assembly | $175T | $221.259T | 56.5% → 65.5% | 30.8% → 45.1% | -3.5% → 18.0% | -46.3% → -15.9% | -89.2% → -49.8% |
| F17 Advanced Power Grid Module | $295T | $379.839T | 56.5% → 66.1% | 31.1% → 46.3% | -2.8% → 20.0% | -45.2% → -12.9% | -87.5% → -45.8% |
| F18 Industrial Motor System | $480T | $627.861T | 56.5% → 66.6% | 31.5% → 47.5% | -1.8% → 22.0% | -43.5% → -9.8% | -85.1% → -41.7% |
| F19 Gigawatt Electrical Converter | $800T | $1.115119Q | 56.8% → 68.8% | 32.4% → 51.3% | -0.1% → 28.0% | -40.7% → -1.1% | -81.3% → -30.3% |
| F20 Integrated Power Distribution Station | $1.25Q | $1.655923Q | 56.9% → 67.3% | 32.9% → 49.1% | 0.9% → 25.0% | -39.1% → -5.2% | -79.1% → -35.4% |
| F21 Modular Generator Complex | $2.55Q | $3.323372Q | 57.4% → 67.1% | 33.9% → 49.1% | 2.5% → 25.0% | -36.7% → -5.1% | -76.0% → -35.2% |
| F22 Continental Power Grid Assembly | $5.2Q | $6.926462Q | 58.2% → 68.4% | 35.1% → 51.1% | 4.3% → 28.0% | -34.1% → -0.9% | -72.6% → -29.7% |
| F23 Automated Industrial Megaplant | $10.6Q | $14.375601Q | 58.2% → 69.0% | 35.5% → 52.3% | 5.3% → 30.0% | -32.4% → 2.2% | -70.1% → -25.6% |
| F24 Global Copper Infrastructure System | $20.5Q | $27.992719Q | 58.6% → 69.5% | 36.7% → 53.4% | 7.4% → 32.0% | -29.2% → 5.2% | -65.8% → -21.6% |
| F25 Copper Empire Industrial Power Complex | $42Q | $58.599383Q | 59.6% → 70.8% | 38.2% → 55.5% | 9.6% → 35.0% | -26.1% → 9.4% | -61.8% → -16.2% |

## What this changes

- At $0.30/g: 25/25 original recipes and 25/25 proposed recipes have positive net under these assumptions.
- At $0.60/g: 25/25 original recipes and 25/25 proposed recipes have positive net under these assumptions.
- At $1.00/g: 6/25 original recipes and 25/25 proposed recipes have positive net under these assumptions.
- At $1.50/g: 0/25 original recipes and 4/25 proposed recipes have positive net under these assumptions.
- At $2.00/g: 0/25 original recipes and 0/25 proposed recipes have positive net under these assumptions.

At $1.50/g, the most complex products retain some opportunity margin while commodity recipes favor selling copper directly. At $2/g, neutral exports are loss-making across this proposal; country demand, relationships and favorable world events can selectively improve offers, but no profit is promised. The production screen should compare actual quotes and require an explicit loss confirmation before reserving a negative-margin job.

## Capital and sensitivity

F01 minimum automated capital is the $1T factory + $50B license + $50B Operator hire + $100B Coastal Ship, plus 5Mt construction copper. This is $1.2T cash plus copper opportunity ($3T at equilibrium); capital should be recovered through repeated jobs, not hidden in the first per-unit margin. A2 reset does not grant these resources. Higher-tier research consumes authored goods and money; these remain investments. Ships take real outbound and return time, so throughput is constrained even when per-unit margin is positive.

All optional staff together cost $168B/job (Operator 1 + Handler 2 + Inspector 5 + Supervisor 20 + Logistics 40 + Manager 100). Buying every worker for a single cheap product can erase its margin; only assigned staff should be charged. Quality bonuses need to be compared with their real extra wages. For a more conservative long-route estimate, Brazil’s route handling charge is six times Australia’s, before any logistics reduction; the percentage portion stays 0.75%.

**Approval requested:** these 25 proposed export reference prices, the freight formula, and loss-confirmation behavior. No changes will be applied before approval. The original prices remain the sole implementation baseline until then.
