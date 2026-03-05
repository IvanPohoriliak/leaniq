import { useState, useRef, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRINCIPLES = [
  { id:"P1", name:"Waste Avoidance", short:"WASTE", color:"#E07B39",
    methods:[{ id:"P1M1", name:"7 Types of Waste Hunting",
      L1:"Management is trained in understanding of the 7 Waste and the need of their elimination/reduction.",
      L2:"Training in 7 types of Muda conducted and well published. All Supervisors trained and can show application of countermeasures.",
      L3:"Waste reduction activities performed in most areas. Good results achieved and further activities ongoing.",
      L4:"Operators involved in understanding and avoiding 7 Waste. CI activities well established, results monitored and displayed.",
      L5:"Company-wide Muda elimination program in place monitored by management. All areas including IE, Logistics, Quality trained."
    }]
  },
  { id:"P2", name:"Employee Engagement & HSE", short:"EE & HSE", color:"#4A90D9",
    methods:[
      { id:"P2M1", name:"Employee Engagement & Autonomous Teams",
        L1:"Training conducted on showing-how basis. Operators capable of one job only. No real CI activities. Training records poorly maintained.",
        L2:"Formalized induction program exists. Qualification and Certification process set up. Some team activities with operator input.",
        L3:"Most operators trained across same process types. Line layouts set for safe operation. Some Kaizen ideas achieved.",
        L4:"Operators well trained in own process and related functions. Training records well maintained. Standardized reporting.",
        L5:"Operation clean and well lit. Operators cross-trained for several functions. All managers monitor training plan aligned to business needs."
      },
      { id:"P2M2", name:"Team Communication (Team Meetings)",
        L1:"Daily meeting established in all areas. Short and focused. Team leader is facilitator.",
        L2:"Shopfloor meeting on regular basis in front of LPMS-Board. Attended by operators up to department-head.",
        L3:"Formal communication protocol used during daily meeting. Team meeting records based on KPI results.",
        L4:"Monthly meeting at beginning of every month. Facilitated by responsible Team Leader or Manager.",
        L5:"Every Team (Production, Department, Management) has a monthly meeting."
      },
      { id:"P2M3", name:"Multiskilling and Flexibility",
        L1:"Skill matrix exists and training carried out as per plan. Training plan based on Skills Training Matrix.",
        L2:"Skill Matrix maintained. Sufficient multiskilled workforce exists within a cell/value stream.",
        L3:"Operator certification demonstrated in Qualification matrix.",
        L4:"Operators well trained within own process and other related functions.",
        L5:"Level of Multiskill and Flexibility of each Team member recorded and analyzed every 3 months."
      },
      { id:"P2M4", name:"Health, Safety and Environment (HSE)",
        L1:"Plant and surroundings are clean and tidy. Regular internal EHS audit performed.",
        L2:"Managers lead HSE related problem solving and improvement actions.",
        L3:"Plant identified main HSE issues and set up an improvement plan accordingly.",
        L4:"Support functions design and update risk analysis including know-how transfer.",
        L5:"HSE performance indicators and communication topics displayed and easily understood by everyone."
      }
    ]
  },
  { id:"P3", name:"Visual Management", short:"VISUAL", color:"#7BC67E",
    methods:[
      { id:"P3M1", name:"Visualization",
        L1:"Easy to update information display system used for QCDM operational monitoring (KPI Boards).",
        L2:"Communication areas set up close to workstations. Information display standards defined for each department.",
        L3:"Visualization applied in other areas: storage, floor marking, overhead displays, transport routes, Andon signals.",
        L4:"KPIs displayed and updated regularly.",
        L5:"Daily meetings held next to QCDM board for information transfer on newest records."
      },
      { id:"P3M2", name:"LPMS Boards",
        L1:"Some pilot zones have and utilize LPMS boards.",
        L2:"Most indicators reviewed in monthly meetings.",
        L3:"LPMS boards utilized everywhere in the Plant.",
        L4:"Most indicators show a progress trend.",
        L5:"Coherent link on results orientation between different areas of the Plant."
      }
    ]
  },
  { id:"P4", name:"Standardization", short:"STD", color:"#C678DD",
    methods:[
      { id:"P4M1", name:"Plant Layout (Flow Oriented)",
        L1:"Layout requirements known for MACRO, MESO, MICRO and NANO levels.",
        L2:"MESO Layout for Shop Floor including production cells, driveways, material flow defined.",
        L3:"MICRO Layouts for Assembly Lines exist for every new process and are updated for existing lines.",
        L4:"Workstations designed to enable several Takt-times. Zoning rules applied for 50% of production areas.",
        L5:"NANO Layouts exist for every new process. Zoning rules applied 100% in the plant."
      },
      { id:"P4M2", name:"Standard Line Design",
        L1:"25% of 74 line design criteria fulfilled.",
        L2:"50% of 74 line design criteria fulfilled.",
        L3:"75% of 74 line design criteria fulfilled.",
        L4:"90% of 74 line design criteria fulfilled.",
        L5:"100% of 74 line design criteria fulfilled."
      },
      { id:"P4M3", name:"Work Standards Documents",
        L1:"Limited number of Work Standards Documents existing in Production.",
        L2:"Clear working instructions exist, updated, known by associates. Work sequence, target cycle time, and control points included.",
        L3:"Work standards used by Team leaders for training and by managers to supervise. Deviations initiate containment actions.",
        L4:"Users involved in improvement of their work documentation leading to regular updates.",
        L5:"Standards implemented and users involved in standard development."
      },
      { id:"P4M4", name:"Standardized Work Documents",
        L1:"Standard Work Instructions exist and used to train employees.",
        L2:"Job Breakdown Sheets used to instruct new or temporary employees.",
        L3:"Standardized Work Combination Table (WCT) known and utilized for every new production.",
        L4:"Combination of PCS, WCT and WSC utilized before every new capacity utilization calculation.",
        L5:"Combination of PCS, WCT and WSC utilized before every product price calculation and RFQ."
      },
      { id:"P4M5", name:"Layered Process Audit (LPA)",
        L1:"System in place in some areas to conduct process audits.",
        L2:"LPA system in place and implemented, carried out by Quality Team including shift startup checklist, product safety, standardized work.",
        L3:"LPA system defined and primarily conducted by production responsible staff and some support functions.",
        L4:"LPA applied to whole facility, not just production. All support functions conducting LPAs.",
        L5:"Operation 100% process compliant as confirmed by zero recurrences of non-conformances in LPAs."
      }
    ]
  },
  { id:"P5", name:"Zero Defects / Total Quality", short:"QUALITY", color:"#E06C75",
    methods:[
      { id:"P5M1", name:"Zero Defects Quality Approach",
        L1:"Quality system in place and certified. Quality controlled through inspection. Operator instructions don't highlight key areas.",
        L2:"Reasonable level of quality training conducted. Documented instructions understood and user friendly.",
        L3:"High level quality training across operation. Quality systems well established. Quality tools used routinely.",
        L4:"All processes controlled through mistake proof devices. Zero defect mentality developing. Operators self-inspect in process.",
        L5:"Zero defect mentality exists throughout operation. Customer surveys used as CI tool. Jidoka systems prevent defect progression."
      },
      { id:"P5M2", name:"Fast Response Problem Solving",
        L1:"Fast Response approach known. Visualization and meeting points exist and are frequently utilized.",
        L2:"Plant Manager ensures timely completion of tracked items. Plant Staff actively participate in daily meeting.",
        L3:"Complex issues managed using 8D problem solving with 5Why, Ishikawa. Exit criteria with timing defined.",
        L4:"Read across of corrective actions to like operations. Lessons Learned Cards generated and communicated.",
        L5:"Effectiveness of FR documented and demonstrated. PFMEA and Control Plan updated as output of problem solving."
      },
      { id:"P5M3", name:"First Parts Production and Release",
        L1:"Start-up procedure exists, is known and applied at every start-up.",
        L2:"Start-up procedure includes checking of all poka yoke. Evidence that Poka Yoke are checked exists.",
        L3:"Set-up procedure exists, known and applied at every set-up.",
        L4:"First Part Approval procedure exists, known and applied at every start of production and reference change.",
        L5:"First Part Approval applied after every technical change in the process."
      },
      { id:"P5M4", name:"Non-Conforming Product Management",
        L1:"Processes defined to identify and segregate non-conforming products but not consistently applied.",
        L2:"Processes applied in most areas. Consistent tagging system used. Containment products properly identified.",
        L3:"All quarantined parts segregated with no contamination risk. Proper identification areas exist.",
        L4:"Containment method in place with effective breakpoint established. Nonconforming material form in use.",
        L5:"Improvement targets set for each line. KPIs followed daily. Traceability applied to finished products."
      },
      { id:"P5M5", name:"Stop at First Defect & Autonomation",
        L1:"Stop at first defect principle known. Machine stops and worker stops line when abnormal situation arises.",
        L2:"Defects registered on failure chart. Each defect has escalation limit and scenario of possible root causes.",
        L3:"Rules for reaction and action defined for containment and corrective actions when escalation limit passed.",
        L4:"Jidoka known and applied for every new production or process.",
        L5:"Root cause investigation in place to ensure process reliability."
      },
      { id:"P5M6", name:"Process Capability & Risk Reduction",
        L1:"Process FMEAs available. Workstations with SC/CC requirements marked and included in frequent process control.",
        L2:"All Process FMEAs up to date. Routine studies to identify critical processes requiring SPC and Cpk measurements.",
        L3:"Machine Capabilities monitored for SC/CC characteristics. Poka-Yoke supplements SPC program. Standard reaction defined for out-of-spec conditions.",
        L4:"All SPC performed as defined in control plan. Capability/SPC trainer exists in organization.",
        L5:"Cpk indicators followed. Process capability ≥ 1.67 on all Critical to Quality processes continuously improved."
      },
      { id:"P5M7", name:"Poka Yoke (Error Proofing)",
        L1:"Poka-Yoke devices used in some areas. Principle known and can be demonstrated.",
        L2:"Poka Yoke installed are simple, robust, inspect 100% of items, detect errors and provide quick feedback.",
        L3:"Poka Yoke applied especially for critical characteristics. Deviation process followed in case of failure.",
        L4:"Machines with Poka Yokes have visualization sign. PY maintenance is part of preventive maintenance. Verification system in place.",
        L5:"Teams identifying opportunities to change from detection to prevention error proofing."
      },
      { id:"P5M8", name:"Rework Management",
        L1:"Product for repair or rework removed from standard process.",
        L2:"Approved Quality person releases every rework.",
        L3:"Rework done only by trained operators at controlled rework areas.",
        L4:"Rework results documented and communicated internally.",
        L5:"Reworked products reintroduced at point of removal after release by process responsible."
      },
      { id:"P5M9", name:"Outgoing Inspection & Controlled Shipping",
        L1:"Quality inspections located after final process in separate area to avoid mixing with production.",
        L2:"Outgoing inspection done close to running production, minimum finished at end of each shift.",
        L3:"Outgoing inspection done only based on approved Work Instructions at organized workplaces.",
        L4:"Outgoing inspection done only by trained operators at controlled areas.",
        L5:"Identifiers show status of products (passed or rejected)."
      },
      { id:"P5M10", name:"Worker Self-Control (Quality at Workstation)",
        L1:"Worker Self-control principle known and applied.",
        L2:"Visual management for Q-KPIs in production areas. First Pass Yield tracking mechanism established.",
        L3:"All Control Plan requirements applied. OK/NOK visual standards displayed. Alarm and escalation process established.",
        L4:"Teams own all quality issues at workstation. Non-conformances contained at point of origin.",
        L5:"People from involved processes participate in analysis and problem solving."
      }
    ]
  },
  { id:"P6", name:"Extended Value Stream Mgmt", short:"E-VSM", color:"#56B6C2",
    methods:[
      { id:"P6M1", name:"Value Stream Management (VSM & VSD)",
        L1:"Product/process families formally defined. Value Stream Mapping being used as a tool in the plant.",
        L2:"VSM for Current State performed on families representing 20%+ of volume/sales. All VSMs done less than 1 year ago.",
        L3:"VSM performed on all families representing 50%+ of volume/sales. Plant High Level VSM performed.",
        L4:"VSM systematically done at beginning of all industrial projects. All VSMs updated for each major change.",
        L5:"All VSMs updated every 12 months and for each major change. Plant Level Ideal State road-mapped."
      },
      { id:"P6M2", name:"Demand Management & Planning",
        L1:"Customer demand known only for 1-3 months short term. Long term is extrapolation. Monthly review.",
        L2:"Mid-term forecast techniques used (12-18 months). Main gaps between demand and forecast measured.",
        L3:"At least 2 periods included: M-1 forecast and M-n depending on longest lead time.",
        L4:"Short-term forecast validity under control. M-n demand accuracy improving. Forecast reliability > 85% by family.",
        L5:"M-n demand accuracy better than target by family during last 6 months."
      },
      { id:"P6M3", name:"Inventory Management Process",
        L1:"Item categories identified and product portfolio classified for purchased parts and WIP.",
        L2:"Planning strategies and stock targets defined. Make/source-to-stock or make/source-to-order strategies in place.",
        L3:"Standard tool used to identify actual stock levels and Days on Hand by item category.",
        L4:"Procedure to implement cycle counting inventory (FG, raw material and WIP) in place.",
        L5:"Reliability of FG inventory >99% by reference."
      },
      { id:"P6M4", name:"Packaging Management Process",
        L1:"Packaging strategy defined and validated for Raw Materials, WIP and FG.",
        L2:"Strategy and standard for Packaging being followed. Packaging per item is defined.",
        L3:"Planning Strategy for each Packaging Material defined based on demand calculation and ABC/XYZ Analysis.",
        L4:"Raw Materials planned and ordered taking defined packaging method agreed with supplier.",
        L5:"Empty Boxes and Container management installed."
      },
      { id:"P6M5", name:"Raw Material Management",
        L1:"Local VSM and VSD for Raw Material Management created including action plans and PDCA for deviations.",
        L2:"All Raw Materials classified frequently. Planning Strategy defined according to ABC/XYZ Analysis.",
        L3:"Material Control done at receiving area with reaction rules for quantity check and shipping document comparison.",
        L4:"Advanced Shipping Note information systematically arrives from suppliers. Suppliers inform in advance of non-adherence.",
        L5:"All Raw Material demands monitored after MRP run. Escalation process in place for major deviations."
      },
      { id:"P6M6", name:"Warehouse Management Process",
        L1:"Strategy defined for item classifications for stock placement and shipment/receiving.",
        L2:"Daily Inbound schedule visualized to plan workload and monitor receipt status.",
        L3:"Freight papers checked when truck arrives. Dock number given to driver.",
        L4:"Goods receipt takes place with barcode scanners.",
        L5:"Incoming Quality Inspection performed if material not inspected at supplier."
      },
      { id:"P6M7", name:"Material Supply & Internal Logistics",
        L1:"Organized effort made to improve material layout and flow. Material delivered to lines frequently.",
        L2:"Milk runs organized via supply devices. Picking frequencies defined. Action plan based on VSM.",
        L3:"System in place to minimize material in manufacturing area. Action plan to reduce WIP. Supply trains cycle in standard loop.",
        L4:"Material delivered to lines on pull signal (replenishment or Kanban). All WIP and FG PFEP implemented.",
        L5:"Flat storage used for FG parts. Supply trains cycling standardized and managed in a visual manner."
      },
      { id:"P6M8", name:"Sales & Operational Planning (S&OP)",
        L1:"Production divided into segments. Customer demand data analyzed per segment based on actual releases.",
        L2:"Historical demand evaluated on rolling basis to define leveling pattern.",
        L3:"Available capacity checked against demands to identify potential bottlenecks.",
        L4:"S&OP inputs available: budget, forecasts, inventory, previous S&OP, current MPS.",
        L5:"Industrial capacity and workforce resource plan available for 12+ months. Capacity analysis extended to critical suppliers."
      },
      { id:"P6M9", name:"Master Production Scheduling (MPS)",
        L1:"MPS Organization defined. MPS procedure exists. Weekly meeting. Rough capacity analysis done.",
        L2:"Weekly MPS meeting chaired by Plant Manager. Meeting minutes exist and validated.",
        L3:"Internal capacity analysis done for key machines. External capacity confirmed by key suppliers for 15+ weeks.",
        L4:"MPS outputs available and reliable. Commitments taken from all relevant functions.",
        L5:"MPS process satisfies real customer demand. Capacities used with best efficiency."
      }
    ]
  },
  { id:"P7", name:"Shop Floor Control & Execution", short:"SFEC", color:"#F0C674",
    methods:[
      { id:"P7M1", name:"Shop Floor Production Control",
        L1:"No fixed machine allocation. Each process is a black box with separate targets. Firefighting mode on.",
        L2:"Fixed production plans with deviation management. Transparency of data allows prediction of throughput time.",
        L3:"Pull principle (Kanban Loop with Supermarket) implemented for Pilot Value Stream. Kanban rules in place.",
        L4:"Pull System implemented for 75%+ of all value streams. Pull principle understood by every department.",
        L5:"Pull System optimized with CIP approach. Only 1 Kanban loop for whole value stream. One-piece flow measures implemented."
      },
      { id:"P7M2", name:"Takt Time Oriented Production",
        L1:"Takt Time definition and calculation known and applied. Production pace dictated by process cycle time.",
        L2:"Customer Takt-time per product and per line calculated against available capacity.",
        L3:"Takt Time fixed daily based on real customer demand. Work content measured and validated for each end item.",
        L4:"Takt-time used to balance production step by step. Line Balance Charts identify bottlenecks.",
        L5:"Target cycle time for each line defined and production pace set accordingly."
      },
      { id:"P7M3", name:"Production Schedule Levelling & EPEI",
        L1:"Finished goods strategy determined. Production plan reviewed weekly. Every part produced at least once a week.",
        L2:"Production plan released and frozen for 1 week. Every part produced at least once a day.",
        L3:"Production plan forwarded to Pacemaker process only in standard format. Every part produced at least once a shift.",
        L4:"50% of downstream lines managed with sequenced orders. Every part produced at least once an hour.",
        L5:"75% of downstream lines managed with sequenced orders. Batch size reduced to one."
      },
      { id:"P7M4", name:"FLOW Manufacturing (Continuous Flow, PULL, FIFO)",
        L1:"Some awareness and training in pull system basics. Some standardization and 5S but not sufficient.",
        L2:"Pull, Supermarkets and build-to-shipping concepts known. Model pull process in place and being developed.",
        L3:"Model Pull/FIFO system in place, stable, producing to takt time. 25%+ of processes linked by FIFO lane.",
        L4:"50%+ of areas operating to Pull or FIFO system. FIFO lanes calculated based on variability.",
        L5:"High level knowledge of total system throughout operation. Production according to customer signals."
      },
      { id:"P7M5", name:"KANBAN",
        L1:"Withdrawal and Production Kanban known. At least 1 loop of each installed.",
        L2:"Loops in place between Sequencer and some lines.",
        L3:"Routine of daily, weekly and monthly audits of kanban system. Batch sizes regularly reviewed and reduced.",
        L4:"Number of kanban carefully reduced to lower inventories and reveal problems.",
        L5:"At least one kanban loop from sequencer to starting point of continuous flow processes."
      }
    ]
  },
  { id:"P8", name:"Continuous Improvement Culture", short:"CI", color:"#98C379",
    methods:[
      { id:"P8M1", name:"CI Culture and CI Organization",
        L1:"CI-Professionals in place driving CI culture. Dedicated CI responsible function in Plant Organization.",
        L2:"CI-Professionals, Plant Staff and Key Team Members driving CI with SMART goals. Managers systematically involved in Kaizen.",
        L3:"Supervisors, Coordinators & Technicians leading improvement projects at operation level.",
        L4:"Shop floor teams implementing tools. Main Kaizen activities defined as result of formal Value Stream Analysis.",
        L5:"All employees performing improvements. Kaizen closed at committed date with targets demonstrated on Gemba."
      },
      { id:"P8M2", name:"CI Training & Certification",
        L1:"CI Professionals trained and being certified. CI Training Plan available for Plant staff and Key members.",
        L2:"CI-Professionals certified.",
        L3:"Shop floor team members have received CI tools training (no more than 3 years ago).",
        L4:"All employees have records of continuous updates on their documents.",
        L5:"All employees trained and certified in CI based on their role."
      },
      { id:"P8M3", name:"System Continuous Improvement Planning",
        L1:"Top management explains how CIP activities are selected and prioritized. Customer requirements known but not yet analyzed.",
        L2:"Selected leaders act in line with documented vision and mission. Lean tools reflect V/M on shop floor. Requirements analyzed regularly.",
        L3:"Targets for KPIs derived logically. CIP cycles do not last longer than 6 months.",
        L4:"Vision and Mission acknowledged by entire workforce. Requirements analyzed regularly and used to update strategy.",
        L5:"All leaders derive target conditions for complete value streams. CIP cycles do not last longer than 3 months."
      },
      { id:"P8M4", name:"CI Workshops / Kaizen Events",
        L1:"CI Workshops activities and system exists. Kaizen Events used for short-term improvements. PDCA approach known.",
        L2:"More than one Kaizen Workshop defined and started. CI Workshops decided from CIP analysis.",
        L3:"Kaizen Teams follow standard Kaizen Event Procedure linked to PDCA. Standard workshop methodology respected.",
        L4:"CI Workshops include 30%+ of shop floor personnel. Improvements cover 7 types of waste plus Safety.",
        L5:"Proposals coming from formal VSA at Plant level. All workshop targets achieved on schedule."
      },
      { id:"P8M5", name:"Best Practice Sharing",
        L1:"Best Practice Metrics used to guide best practices.",
        L2:"Seek best practices by visiting plants or performing benchmark workshops.",
        L3:"Plant aware of Operations benchmarking activities and best practice dissemination.",
        L4:"Plant actively nominates best-in-class practices in any functional areas.",
        L5:"Industry best practices sought to continuously improve performance level."
      },
      { id:"P8M7", name:"Scrap and Rework Costs Improvement",
        L1:"Scrap Costs measured and main contributors identified.",
        L2:"Scrap management follows rules of problem solving utilizing statistical database.",
        L3:"All lines and workstations with rework operations organized professionally and standardized.",
        L4:"Rework operations regularly audited and validated. Records demonstrate following of standards.",
        L5:"Rework costs management follows rules of problem solving utilizing statistical database."
      },
      { id:"P8M8", name:"Material Handling Costs Improvement",
        L1:"Batch sizes on Raw materials ordering continuously reduced.",
        L2:"Picking frequencies at suppliers continuously increased.",
        L3:"External warehouses listed and minimum monitoring done if used for RM, WIP and FG.",
        L4:"Consignment stock listed and minimum monitoring done if used.",
        L5:"Improvement action plans in place to reduce transportation costs vs. budget."
      },
      { id:"P8M9", name:"Quick Change Over with SMED",
        L1:"Changeover time and duration systematically recorded and displayed. Plan for reduction defined.",
        L2:"Changeover time optimized and systematically reduced. SMED method known and applied.",
        L3:"At least one SMED workshop done in past 6 months. At least 25% improvement in changeover times reported.",
        L4:"At least 50% improvement in changeover times reported. SMED workshop done in past 3 months.",
        L5:"All assembly lines and equipment have changeover time within target."
      }
    ]
  },
  { id:"P9", name:"Total Productive Maintenance", short:"TPM", color:"#D19A66",
    methods:[
      { id:"P9M1", name:"TPM - The 5 TPM Pillars",
        L1:"Management team has formal knowledge of TPM concept. Formal TPM training held for Management and functional leaders.",
        L2:"Formal TPM training held for Supervisors. Some TPM knowledge passed to Team Leaders and Operators.",
        L3:"Downtimes monitored and root cause analysis done for Top 3 downtimes of observed area.",
        L4:"Downtimes continuously monitored and CI activities in place.",
        L5:"TPM concept is integral part of Manufacturing operation. All employees aware and operators trained."
      },
      { id:"P9M2", name:"TPM Foundation - 5S",
        L1:"Management trained and aware of 5S concept. 5S standard known and utilized in the Plant.",
        L2:"All new employees systematically trained in 5S rules. 5S floor marking and overhead identification done.",
        L3:"5S Layout exists. 5S coordinator assigned for each area. Housekeeping at good level. Improvement plan exists.",
        L4:"5S Audit checklist performed on regular basis and results reported. Each area has 5S communication board.",
        L5:"Operation at high level of cleanliness. Material and equipment locations highly visible. Continuous area cleaning."
      },
      { id:"P9M3", name:"TPM Pillar 1 - Eliminate Losses (OEE)",
        L1:"Eliminate Losses approach known and followed in the plant organization.",
        L2:"Sources of losses (Major 6 Losses) identified. Root causes analyzed and focused.",
        L3:"TPM Pillar 1 Improvement teams formed and active.",
        L4:"Countermeasures determined and implemented. OEE targets set and followed minimum weekly for each equipment.",
        L5:"Success controls of implemented measures carried out. Regular (min weekly) management follow-up of OEE results."
      },
      { id:"P9M4", name:"TPM Pillar 2 - Planned Maintenance",
        L1:"Planned Maintenance approach known and followed in plant organization.",
        L2:"Current condition of Planned Maintenance analyzed.",
        L3:"Data collected utilizing Information Planning and Control System (SAP, Excel, etc.)",
        L4:"Planned Maintenance started utilizing Maintenance Plans. Spare Parts management set up.",
        L5:"Machine Performance and reliability improving."
      },
      { id:"P9M5", name:"TPM Pillar 3 - Autonomous Maintenance",
        L1:"Autonomous Maintenance approach known and followed in plant organization.",
        L2:"Basic Inspection of Machines implemented: Cleaning Preparation, Deep Cleaning, Note abnormalities.",
        L3:"Provisional standards for Cleaning, Inspection and Lubrication developed and tested.",
        L4:"Simple adjustments done by operator with simple portable tools and work instruction.",
        L5:"Workplace organization systematized. System built to capitalize information for planned maintenance."
      },
      { id:"P9M6", name:"TPM Pillar 4 - Maintenance Prevention",
        L1:"Maintenance Prevention approach known and followed in plant organization.",
        L2:"Production knowledge regarding machine maintainability shared with Product and Process development.",
        L3:"Production/Maintenance engineers participate in Machine concept definition and design.",
        L4:"Production/Maintenance engineers support with Know-How in Machine/Equipment manufacturing.",
        L5:"Production/Maintenance engineers involved in Machine/Equipment installation and start-up."
      },
      { id:"P9M7", name:"TPM Pillar 5 - Maintenance Training",
        L1:"Maintenance Training approach known and followed in plant organization.",
        L2:"Production and Maintenance employees trained in TPM Basics.",
        L3:"Required level of Maintenance knowledge identified. Plan for level achievement defined.",
        L4:"Skills of Maintenance employees assessed. Plan for employees to get needed skills set up and followed.",
        L5:"Autonomous Maintenance and Planned Maintenance known, utilized and synergy can be demonstrated."
      }
    ]
  }
];

const LEVEL_LABELS = ["", "Awareness", "Developing", "Effective", "High Performing", "Most Capable"];
const LEVEL_COLORS = ["#ccc","#E06C75","#D19A66","#F0C674","#98C379","#56B6C2"];
const LEVEL_PCT = ["","0–20%","21–40%","41–60%","61–80%","81–100%"];

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
function buildSystemPrompt(principle, method) {
  return `You are a senior Lean Manufacturing consultant with 20+ years of hands-on plant experience. You are conducting a structured Lean Maturity Assessment interview.

METHOD TO ASSESS: "${method.name}"
PRINCIPLE: "${principle.name}"

LEVEL CRITERIA — use these to guide your questions:
L1 — Awareness: ${method.L1}
L2 — Developing: ${method.L2}
L3 — Effective: ${method.L3}
L4 — High Performing: ${method.L4}
L5 — Most Capable: ${method.L5}

YOUR ASSESSMENT METHOD — PROGRESSIVE LEVELS:
Start from L1 and work upward. Your goal is to find the highest level the plant genuinely meets.

STEP 1: Ask one simple yes/no or concrete question to check if L1 criteria is met.
STEP 2: If L1 confirmed — move to L2 question. If not — stay at L1 and conclude.
STEP 3: Continue upward until you find where they stop meeting criteria.
STEP 4: After 3-4 exchanges YOU MUST conclude. Never ask more than 4 questions total.

QUESTION STYLE:
- Ask about concrete reality only: "Do you have X?" or "Can you show me an example of Y?"
- One focused question per message — never multiple questions at once
- If answer is vague, ask for one specific example or number
- "we don't have it" or "no" = that level not met, conclude immediately

MANDATORY CONCLUSION — your final message MUST end with all three lines exactly like this:
ASSESSMENT: L[1-5] - [level name]
REASON: [1-2 sentences referencing their specific answers]
NEXT LEVEL: [1-2 concrete actions to reach L[current+1]]

RULES:
- Respond in the same language the user writes in (English or Ukrainian)
- Keep each message to 2-3 sentences max + one question
- Never say "thank you for your honesty" or similar filler phrases`;
}

// ─── API CALL ─────────────────────────────────────────────────────────────────
async function callAI(messages, systemPrompt) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: systemPrompt, messages })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text || "Sorry, I couldn't get a response. Please try again.";
}

function parseAssessment(text) {
  const match = text.match(/ASSESSMENT:\s*L(\d)/i);
  return match ? parseInt(match[1]) : null;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SetupScreen({ onStart }) {
  const [form, setForm] = useState({ name:"", industry:"", revenue:"", headcount:"", consultant:"" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const valid = form.name && form.revenue && form.headcount;

  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"52px 24px"}}>
      <div style={{marginBottom:40}}>
        <div style={{fontSize:12,color:"#56B6C2",letterSpacing:"0.15em",fontWeight:700,marginBottom:10}}>LEAN MATURITY ASSESSMENT</div>
        <div style={{fontSize:30,fontWeight:800,color:"#111",fontFamily:"'Syne',sans-serif",marginBottom:8}}>Plant Setup</div>
        <div style={{color:"#777",fontSize:14,lineHeight:1.6}}>Enter basic plant information to calibrate the financial impact calculator and personalise your report.</div>
      </div>
      {[
        {label:"Plant / Company Name *",key:"name",placeholder:"e.g. Precision Parts Swindon"},
        {label:"Industry",key:"industry",placeholder:"e.g. Automotive Tier 1, Aerospace, Electronics"},
        {label:"Annual Revenue (€) *",key:"revenue",placeholder:"e.g. 50000000",type:"number"},
        {label:"Total Headcount *",key:"headcount",placeholder:"e.g. 450",type:"number"},
        {label:"Consultant / Assessor Name",key:"consultant",placeholder:"e.g. Ivan Kovalenko"},
      ].map(f => (
        <div key={f.key} style={{marginBottom:18}}>
          <label style={{display:"block",fontSize:12,fontWeight:700,color:"#444",marginBottom:6,letterSpacing:"0.05em"}}>{f.label}</label>
          <input type={f.type||"text"} placeholder={f.placeholder} value={form[f.key]}
            onChange={e=>set(f.key,e.target.value)}
            style={{width:"100%",padding:"11px 14px",border:"1.5px solid #e4e4e4",borderRadius:8,fontSize:14,outline:"none",fontFamily:"inherit",color:"#111",background:"#fafafa",transition:"border 0.2s",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor="#56B6C2"}
            onBlur={e=>e.target.style.borderColor="#e4e4e4"}
          />
        </div>
      ))}
      <button onClick={()=>valid&&onStart(form)} style={{
        marginTop:12,width:"100%",padding:"13px",borderRadius:8,border:"none",
        background:valid?"#111":"#ddd",color:valid?"#fff":"#aaa",fontSize:14,fontWeight:700,
        cursor:valid?"pointer":"not-allowed",letterSpacing:"0.04em",fontFamily:"inherit",transition:"background 0.2s"
      }}>
        START ASSESSMENT →
      </button>
    </div>
  );
}

function ChatBubble({role,text}) {
  const isUser = role==="user";
  const isAssessment = !isUser && parseAssessment(text) !== null;

  const cleanText = text
    .replace(/ASSESSMENT:.*$/m,"")
    .replace(/REASON:.*$/m,"")
    .replace(/NEXT LEVEL:.*$/m,"")
    .trim();

  const reason = text.match(/REASON:\s*(.+?)(?=NEXT LEVEL:|$)/s)?.[1]?.trim();
  const nextLevel = text.match(/NEXT LEVEL:\s*(.+?)$/s)?.[1]?.trim();
  const level = parseAssessment(text);

  return (
    <div style={{display:"flex",gap:10,marginBottom:16,justifyContent:isUser?"flex-end":"flex-start"}}>
      {!isUser && (
        <div style={{width:32,height:32,borderRadius:8,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
          <span style={{fontSize:14}}>🔍</span>
        </div>
      )}
      <div style={{maxWidth:"78%"}}>
        <div style={{
          padding:"12px 16px",borderRadius:isUser?"12px 12px 4px 12px":"12px 12px 12px 4px",
          background:isUser?"#111":"#f4f5f7",
          color:isUser?"#fff":"#222",fontSize:14,lineHeight:1.6,
          whiteSpace:"pre-wrap"
        }}>
          {cleanText}
        </div>
        {isAssessment && level && (
          <div style={{marginTop:10,padding:"14px 16px",background:"#fff",border:"1.5px solid #e4e4e4",borderRadius:10,borderLeft:`4px solid ${LEVEL_COLORS[level]}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:18,fontWeight:800,color:LEVEL_COLORS[level],fontFamily:"'Syne',sans-serif"}}>L{level}</span>
              <span style={{fontSize:13,fontWeight:700,color:LEVEL_COLORS[level]}}>{LEVEL_LABELS[level]}</span>
              <span style={{fontSize:12,color:"#aaa",marginLeft:"auto"}}>{LEVEL_PCT[level]}</span>
            </div>
            {reason && <div style={{fontSize:13,color:"#555",marginBottom:reason&&nextLevel?8:0,lineHeight:1.5}}>{reason}</div>}
            {nextLevel && (
              <div style={{fontSize:12,color:"#1E6B3C",background:"#E9F7EF",padding:"8px 12px",borderRadius:6,lineHeight:1.5}}>
                <strong>To reach L{level+1}:</strong> {nextLevel}
              </div>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{width:32,height:32,borderRadius:8,background:"#56B6C2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
          <span style={{fontSize:13,color:"#fff",fontWeight:700}}>PM</span>
        </div>
      )}
    </div>
  );
}

// ─── PRINCIPLE GRID ───────────────────────────────────────────────────────────
function PrincipleGrid({ plant, scores, onOpenPrinciple }) {
  const totalMethods = PRINCIPLES.reduce((s,p)=>s+p.methods.length,0);
  const totalAssessed = Object.keys(scores).length;

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontSize:12,color:"#56B6C2",fontWeight:700,letterSpacing:"0.12em",marginBottom:6}}>STEP 2 OF 3</div>
        <div style={{fontSize:26,fontWeight:800,color:"#111",fontFamily:"'Syne',sans-serif",marginBottom:6}}>{plant.name} — Lean Assessment</div>
        <div style={{color:"#888",fontSize:14,marginBottom:16}}>Select any principle to start the AI-guided interview. You can pause and return at any time.</div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,height:6,background:"#eee",borderRadius:3}}>
            <div style={{height:"100%",width:`${(totalAssessed/totalMethods)*100}%`,background:"#56B6C2",borderRadius:3,transition:"width 0.5s"}}/>
          </div>
          <span style={{fontSize:12,color:"#aaa",fontWeight:600,whiteSpace:"nowrap"}}>{totalAssessed} / {totalMethods} methods</span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {PRINCIPLES.map((p,i) => {
          const methodScores = p.methods.map(m=>scores[`${p.id}_${m.id}`]||0).filter(s=>s>0);
          const avgScore = methodScores.length ? Math.round(methodScores.reduce((a,b)=>a+b,0)/methodScores.length) : 0;
          const done = methodScores.length;
          const total = p.methods.length;
          const pct = Math.round((done/total)*100);
          const started = done > 0;

          return (
            <div key={p.id} onClick={()=>onOpenPrinciple(i)}
              style={{
                background:"#fff",border:`1.5px solid ${started?p.color+"55":"#e8e8e8"}`,
                borderRadius:12,padding:"20px",cursor:"pointer",
                transition:"all 0.2s",position:"relative",overflow:"hidden"
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
            >
              {/* Color bar top */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:started?p.color:"#eee",borderRadius:"12px 12px 0 0"}}/>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:800,color:started?p.color:"#ccc",letterSpacing:"0.12em"}}>{p.short}</div>
                {avgScore>0 && (
                  <div style={{fontSize:13,fontWeight:800,color:LEVEL_COLORS[avgScore],background:LEVEL_COLORS[avgScore]+"18",padding:"2px 10px",borderRadius:20}}>
                    L{avgScore}
                  </div>
                )}
              </div>

              <div style={{fontSize:14,fontWeight:700,color:"#111",marginBottom:14,lineHeight:1.3}}>{p.name}</div>

              {/* Method dots */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                {p.methods.map(m=>{
                  const sc = scores[`${p.id}_${m.id}`];
                  return (
                    <div key={m.id} title={m.name} style={{
                      width:8,height:8,borderRadius:"50%",
                      background:sc?LEVEL_COLORS[sc]:"#e8e8e8",
                      transition:"background 0.3s"
                    }}/>
                  );
                })}
              </div>

              {/* Progress */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{flex:1,height:3,background:"#f0f0f0",borderRadius:2,marginRight:10}}>
                  <div style={{height:"100%",width:`${pct}%`,background:p.color,borderRadius:2,transition:"width 0.5s"}}/>
                </div>
                <span style={{fontSize:11,color:"#bbb",fontWeight:600}}>{done}/{total}</span>
              </div>

              {!started && (
                <div style={{marginTop:10,fontSize:11,color:"#bbb",display:"flex",alignItems:"center",gap:4}}>
                  <span>→</span> <span>Click to begin</span>
                </div>
              )}
              {started && done<total && (
                <div style={{marginTop:10,fontSize:11,color:p.color,fontWeight:600}}>In progress</div>
              )}
              {done===total && (
                <div style={{marginTop:10,fontSize:11,color:"#1E6B3C",fontWeight:600}}>✓ Complete</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PRINCIPLE CHAT ───────────────────────────────────────────────────────────
function PrincipleChat({ plant, principle, scores, onScore, onBack }) {
  const [activeMethodIdx, setActiveMethodIdx] = useState(()=>{
    // Start from first unassessed method
    const firstUnassessed = principle.methods.findIndex(m=>!scores[`${principle.id}_${m.id}`]);
    return firstUnassessed>=0?firstUnassessed:0;
  });
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const method = principle.methods[activeMethodIdx];
  const chatKey = `${principle.id}_${method.id}`;
  const messages = chats[chatKey] || [];
  const methodScore = scores[chatKey];

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[messages,loading]);

  useEffect(()=>{
    if(!chats[chatKey]||chats[chatKey].length===0) startChat();
  },[chatKey]);

  async function startChat() {
    setLoading(true);
    const systemPrompt = buildSystemPrompt(principle, method);
    try {
      const reply = await callAI([], systemPrompt);
      setChats(c=>({...c,[chatKey]:[{role:"assistant",content:reply}]}));
    } catch(e) {
      setChats(c=>({...c,[chatKey]:[{role:"assistant",content:`Let's assess "${method.name}". Can you describe how this is currently handled in your plant?`}]}));
    }
    setLoading(false);
  }

  async function sendMessage() {
    if(!input.trim()||loading) return;
    const userMsg = {role:"user",content:input.trim()};
    const newMessages = [...messages,userMsg];
    setChats(c=>({...c,[chatKey]:newMessages}));
    setInput("");
    setLoading(true);
    const systemPrompt = buildSystemPrompt(principle, method);
    const apiMessages = newMessages.map(m=>({role:m.role,content:m.content}));
    try {
      const reply = await callAI(apiMessages, systemPrompt);
      const updated = [...newMessages,{role:"assistant",content:reply}];
      setChats(c=>({...c,[chatKey]:updated}));
      const level = parseAssessment(reply);
      if(level) onScore(chatKey, level);
    } catch(e) {
      setChats(c=>({...c,[chatKey]:[...newMessages,{role:"assistant",content:"Error — please try again."}]}));
    }
    setLoading(false);
  }

  const doneCount = principle.methods.filter(m=>scores[`${principle.id}_${m.id}`]).length;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 60px)"}}>
      {/* Principle header */}
      <div style={{padding:"14px 24px",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",gap:14,background:"#fafafa"}}>
        <button onClick={onBack} style={{padding:"6px 12px",fontSize:12,border:"1px solid #e4e4e4",borderRadius:6,background:"#fff",cursor:"pointer",color:"#666",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
          ← Back
        </button>
        <div style={{width:10,height:10,borderRadius:"50%",background:principle.color,flexShrink:0}}/>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#111"}}>{principle.name}</div>
          <div style={{fontSize:11,color:"#aaa"}}>{doneCount}/{principle.methods.length} methods assessed</div>
        </div>
        {/* Method tabs */}
        <div style={{display:"flex",gap:6,marginLeft:"auto",flexWrap:"wrap"}}>
          {principle.methods.map((m,i)=>{
            const sc = scores[`${principle.id}_${m.id}`];
            const isActive = i===activeMethodIdx;
            return (
              <button key={m.id} onClick={()=>setActiveMethodIdx(i)} style={{
                padding:"5px 12px",fontSize:11,borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                border:`1.5px solid ${isActive?principle.color:sc?LEVEL_COLORS[sc]+"66":"#e8e8e8"}`,
                background:isActive?principle.color:sc?LEVEL_COLORS[sc]+"11":"#fff",
                color:isActive?"#fff":sc?LEVEL_COLORS[sc]:"#888",
                transition:"all 0.15s",whiteSpace:"nowrap"
              }}>
                {sc?`L${sc} `:""}{m.name.length>20?m.name.slice(0,18)+"…":m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",flex:1,overflow:"hidden"}}>
        {/* Messages */}
        <div style={{display:"flex",flexDirection:"column",borderRight:"1px solid #eee"}}>
          <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"24px"}}>
            {messages.map((m,i)=><ChatBubble key={i} role={m.role} text={m.content}/>)}
            {loading && (
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                <div style={{width:32,height:32,borderRadius:8,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:14}}>🔍</span>
                </div>
                <div style={{padding:"12px 16px",background:"#f4f5f7",borderRadius:"12px 12px 12px 4px",display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#ccc",animation:"pulse 1.2s infinite",animationDelay:`${i*0.2}s`}}/>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{padding:"12px 16px",borderTop:"1px solid #eee",display:"flex",gap:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
              placeholder="Describe the situation in your plant..."
              disabled={loading}
              style={{flex:1,padding:"11px 14px",border:"1.5px solid #e4e4e4",borderRadius:8,fontSize:14,outline:"none",fontFamily:"inherit",color:"#111",background:loading?"#f9f9f9":"#fff"}}
              onFocus={e=>e.target.style.borderColor="#56B6C2"}
              onBlur={e=>e.target.style.borderColor="#e4e4e4"}
            />
            <button onClick={sendMessage} disabled={loading||!input.trim()} style={{
              padding:"11px 20px",borderRadius:8,border:"none",
              background:loading||!input.trim()?"#eee":"#111",
              color:loading||!input.trim()?"#aaa":"#fff",
              cursor:loading||!input.trim()?"not-allowed":"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit",transition:"all 0.15s"
            }}>Send</button>
          </div>
        </div>

        {/* Right panel — method info */}
        <div style={{overflowY:"auto",padding:"20px",background:"#fafafa"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:"0.1em",marginBottom:12}}>CURRENT METHOD</div>
          <div style={{fontSize:14,fontWeight:700,color:"#111",marginBottom:16,lineHeight:1.4}}>{method.name}</div>

          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:"0.1em",marginBottom:10}}>MATURITY LEVELS</div>
          {["L1","L2","L3","L4","L5"].map((l,i)=>{
            const lv = i+1;
            const isCurrent = methodScore===lv;
            return (
              <div key={l} style={{marginBottom:8,padding:"10px 12px",borderRadius:8,background:isCurrent?LEVEL_COLORS[lv]+"18":"#fff",border:`1px solid ${isCurrent?LEVEL_COLORS[lv]:"#eee"}`,transition:"all 0.3s"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:800,color:isCurrent?LEVEL_COLORS[lv]:"#ccc"}}>{l}</span>
                  <span style={{fontSize:10,color:isCurrent?LEVEL_COLORS[lv]:"#bbb"}}>{LEVEL_LABELS[lv]}</span>
                  {isCurrent&&<span style={{marginLeft:"auto",fontSize:10,color:LEVEL_COLORS[lv],fontWeight:700}}>← assessed</span>}
                </div>
                <div style={{fontSize:11,color:isCurrent?"#444":"#aaa",lineHeight:1.4}}>{method[l]?.slice(0,100)}{method[l]?.length>100?"…":""}</div>
              </div>
            );
          })}

          {methodScore && methodScore<5 && (
            <div style={{marginTop:12,padding:"10px 12px",background:"#E9F7EF",borderRadius:8,border:"1px solid #C3E6CB"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#1E6B3C",marginBottom:4}}>NEXT LEVEL TARGET</div>
              <div style={{fontSize:11,color:"#1E6B3C",lineHeight:1.4}}>{method[`L${methodScore+1}`]?.slice(0,120)}…</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssessmentScreen({ plant, scores, onScore, onViewResults }) {
  const [openPrincipleIdx, setOpenPrincipleIdx] = useState(null);

  if (openPrincipleIdx !== null) {
    return (
      <PrincipleChat
        plant={plant}
        principle={PRINCIPLES[openPrincipleIdx]}
        scores={scores}
        onScore={onScore}
        onBack={()=>setOpenPrincipleIdx(null)}
      />
    );
  }

  return (
    <PrincipleGrid
      plant={plant}
      scores={scores}
      onOpenPrinciple={setOpenPrincipleIdx}
    />
  );
}

function ResultsScreen({ plant, scores, onBack }) {
  const revenue = parseFloat(plant.revenue)||50000000;
  const headcount = parseFloat(plant.headcount)||300;

  const principleScores = PRINCIPLES.map(p => {
    const methodScores = p.methods.map(m => scores[`${p.id}_${m.id}`]||0).filter(s=>s>0);
    const avg = methodScores.length ? Math.round(methodScores.reduce((a,b)=>a+b,0)/methodScores.length) : 0;
    return {...p, score:avg, assessed:methodScores.length, total:p.methods.length};
  });

  const assessed = principleScores.filter(p=>p.score>0);
  const overallAvg = assessed.length ? Math.round(assessed.reduce((s,p)=>s+p.score,0)/assessed.length) : 0;
  const overallPct = Math.round((overallAvg/5)*100);

  const SAVINGS = {
    P1: r=>({lo:r*.20*.20, hi:r*.20*.30}),
    P2: (r,h)=>({lo:h*.15*5000*.20, hi:h*.15*15000*.30}),
    P3: (r,h)=>({lo:h*25000*.17*.30, hi:h*25000*.17*.40}),
    P4: r=>({lo:r*.75*.05, hi:r*.75*.08}),
    P5: r=>({lo:r*.08*.25, hi:r*.08*.35}),
    P6: r=>({lo:r*.10*.08*.30, hi:r*.10*.08*.50}),
    P7: r=>({lo:r*.15*.03, hi:r*.15*.05}),
    P8: (r,h)=>({lo:h*4*500, hi:h*4*1500}),
    P9: r=>({lo:r*.04*.15+200*2000*.30, hi:r*.08*.15+200*2000*.50}),
  };

  const fmt = v => v>=1e6?`€${(v/1e6).toFixed(1)}M`:v>=1e3?`€${Math.round(v/1e3)}K`:`€${Math.round(v)}`;

  const withSavings = principleScores.map(p => {
    const fn = SAVINGS[p.id];
    const sav = fn ? fn(revenue,headcount) : {lo:0,hi:0};
    return {...p, savLo:sav.lo, savHi:sav.hi};
  });

  const totalLo = withSavings.reduce((s,p)=>s+p.savLo,0);
  const totalHi = withSavings.reduce((s,p)=>s+p.savHi,0);
  const weakest = [...withSavings].filter(p=>p.score>0).sort((a,b)=>a.score-b.score).slice(0,3);

  const radarData = principleScores.map(p=>({subject:p.short, score:p.score, fullMark:5}));

  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"32px 24px"}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{fontSize:12,color:"#56B6C2",fontWeight:700,letterSpacing:"0.12em",marginBottom:6}}>ASSESSMENT RESULTS</div>
          <div style={{fontSize:26,fontWeight:800,color:"#111",fontFamily:"'Syne',sans-serif"}}>{plant.name||"Your Plant"}</div>
          <div style={{color:"#888",fontSize:13,marginTop:3}}>
            LeanIQ Maturity Assessment · {new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"})}
            {plant.consultant&&` · Assessed by ${plant.consultant}`}
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:12,color:"#aaa",marginBottom:4}}>Overall Maturity</div>
          {overallAvg>0?(
            <>
              <div style={{fontSize:46,fontWeight:800,color:LEVEL_COLORS[overallAvg],fontFamily:"'Syne',sans-serif",lineHeight:1}}>L{overallAvg}</div>
              <div style={{fontSize:13,color:"#888",marginTop:4}}>{LEVEL_LABELS[overallAvg]} · {overallPct}%</div>
            </>
          ):(
            <div style={{fontSize:16,color:"#ccc"}}>Not enough data</div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {[
          {label:"Potential Annual Savings",value:`${fmt(totalLo)} – ${fmt(totalHi)}`,sub:"Based on industry benchmarks",bg:"#E9F7EF",color:"#1E6B3C"},
          {label:"Principles Below L3",value:`${principleScores.filter(p=>p.score>0&&p.score<3).length} of ${assessed.length} assessed`,sub:"Require priority focus",bg:"#FDEDEC",color:"#C0392B"},
          {label:"Methods Assessed",value:`${Object.keys(scores).length}/${PRINCIPLES.reduce((s,p)=>s+p.methods.length,0)}`,sub:assessed.length<9?"Assessment in progress":"All principles covered",bg:"#EBF9FB",color:"#0277BD"},
        ].map((c,i)=>(
          <div key={i} style={{background:c.bg,borderRadius:10,padding:"18px 20px"}}>
            <div style={{fontSize:11,color:"#888",letterSpacing:"0.08em",marginBottom:6}}>{c.label}</div>
            <div style={{fontSize:18,fontWeight:800,color:c.color,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{c.value}</div>
            <div style={{fontSize:11,color:"#888"}}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Radar + Breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>
        <div style={{background:"#fafafa",borderRadius:10,padding:20,border:"1px solid #eee"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:"0.1em",marginBottom:12}}>RADAR — 9 PRINCIPLES</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8e8e8"/>
              <PolarAngleAxis dataKey="subject" tick={{fill:"#888",fontSize:11,fontFamily:"inherit"}}/>
              <PolarRadiusAxis domain={[0,5]} tick={false} axisLine={false}/>
              <Radar dataKey="score" stroke="#56B6C2" fill="#56B6C2" fillOpacity={0.2} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:"#fafafa",borderRadius:10,padding:20,border:"1px solid #eee"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:"0.1em",marginBottom:14}}>MATURITY BY PRINCIPLE</div>
          {withSavings.map(p=>(
            <div key={p.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:"#555"}}>{p.short}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:"#aaa"}}>{p.score>0?fmt(p.savLo)+"+":""}</span>
                  <span style={{fontSize:11,fontWeight:700,color:p.score>0?LEVEL_COLORS[p.score]:"#ccc"}}>
                    {p.score>0?`L${p.score}`:"—"}
                  </span>
                </div>
              </div>
              <div style={{height:5,background:"#eee",borderRadius:3}}>
                <div style={{height:"100%",width:`${(p.score/5)*100}%`,background:p.score>0?LEVEL_COLORS[p.score]:"#eee",borderRadius:3,transition:"width 0.6s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Priorities */}
      {weakest.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",letterSpacing:"0.1em",marginBottom:14}}>TOP IMPROVEMENT PRIORITIES</div>
          {weakest.map((p,i)=>(
            <div key={p.id} style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"16px 18px",marginBottom:10,display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"#111",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>#{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#111"}}>{p.name}</div>
                <div style={{fontSize:12,color:"#aaa",marginTop:2}}>Currently L{p.score} — {LEVEL_LABELS[p.score]} · Target: L{p.score+1}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:15,fontWeight:800,color:"#1E6B3C"}}>{fmt(p.savLo)}+</div>
                <div style={{fontSize:11,color:"#aaa"}}>annual potential</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consulting box */}
      {overallAvg>0&&(
        <div style={{background:"#111",borderRadius:12,padding:"22px 24px",color:"#fff"}}>
          <div style={{fontSize:11,color:"#56B6C2",fontWeight:700,letterSpacing:"0.12em",marginBottom:8}}>CONSULTING RECOMMENDATION</div>
          <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>
            Estimated transformation value: {fmt(totalLo)} – {fmt(totalHi)}/year
          </div>
          <div style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>
            A structured Lean transformation programme targeting the top priorities identified above
            can deliver measurable results within 6–12 months.
            Investment in expert guidance typically returns 5–10× in the first year.
          </div>
          {plant.consultant&&(
            <div style={{marginTop:12,fontSize:12,color:"#56B6C2"}}>
              Prepared by: {plant.consultant} · {new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long"})}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function LeanIQ() {
  const [screen, setScreen] = useState("setup");
  const [plant, setPlant] = useState(null);
  const [scores, setScores] = useState({});

  const totalAssessed = Object.keys(scores).length;

  function setScore(key, level) {
    setScores(s=>({...s,[key]:level}));
  }

  return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button,input{font-family:inherit;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#f1f1f1;}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.8)}}
      `}</style>

      {/* Nav */}
      <div style={{borderBottom:"1px solid #eee",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,background:"#111",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:12,height:12,border:"2px solid #56B6C2",borderRadius:2}}/>
          </div>
          <div>
            <span style={{fontWeight:800,fontSize:17,color:"#111",fontFamily:"'Syne',sans-serif"}}>LeanIQ</span>
            <span style={{fontSize:11,color:"#bbb",marginLeft:8,letterSpacing:"0.08em"}}>MATURITY ASSESSMENT</span>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {screen!=="setup"&&(
            <>
              <button onClick={()=>setScreen("assess")} style={{
                padding:"6px 14px",fontSize:12,border:"none",background:"none",cursor:"pointer",
                color:screen==="assess"?"#111":"#aaa",fontWeight:screen==="assess"?700:400,
                borderBottom:screen==="assess"?"2px solid #111":"2px solid transparent",fontFamily:"inherit"
              }}>ASSESS</button>
              <button onClick={()=>setScreen("results")} style={{
                padding:"6px 14px",fontSize:12,border:"none",background:"none",cursor:"pointer",
                color:screen==="results"?"#111":"#aaa",fontWeight:screen==="results"?700:400,
                borderBottom:screen==="results"?"2px solid #111":"2px solid transparent",fontFamily:"inherit",
                display:"flex",alignItems:"center",gap:6
              }}>
                RESULTS
                {totalAssessed>0&&(
                  <span style={{background:"#56B6C2",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{totalAssessed}</span>
                )}
              </button>
              <button onClick={()=>{setScreen("setup");setPlant(null);setScores({});}} style={{
                padding:"5px 12px",fontSize:11,border:"1px solid #eee",borderRadius:6,background:"none",cursor:"pointer",color:"#aaa",fontFamily:"inherit",marginLeft:4
              }}>New</button>
            </>
          )}
        </div>
      </div>

      {screen==="setup"&&<SetupScreen onStart={p=>{setPlant(p);setScreen("assess");}}/>}
      {screen==="assess"&&plant&&<AssessmentScreen plant={plant} scores={scores} onScore={setScore} onViewResults={()=>setScreen("results")}/>}
      {screen==="results"&&plant&&<ResultsScreen plant={plant} scores={scores} onBack={()=>setScreen("assess")}/>}
    </div>
  );
}
