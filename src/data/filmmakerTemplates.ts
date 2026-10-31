export interface ProductionTemplate {
  id: string;
  title: string;
  bengaliTitle: string;
  category: string;
  description: string;
  content: string;
  fileFormat: string;
  fileSizeEst: string;
}

export const PRODUCTION_TEMPLATES: ProductionTemplate[] = [
  {
    id: 'daily-call-sheet',
    title: 'Standard Production Daily Call Sheet',
    bengaliTitle: 'দৈনিক শুটিং কল শিট টেমপ্লেট',
    category: 'Production Management',
    description: 'Industry-standard daily call sheet template with department schedules, hospital notes, sunrise/sunset, and scene breakdown.',
    fileFormat: 'TEXT / PDF PRINTABLE',
    fileSizeEst: '12 KB',
    content: `================================================================================
                    DAILY PRODUCTION CALL SHEET - DAY 04 OF 14
================================================================================
PROJECT TITLE:   "CHAKRA: CYCLES OF ABSENCE"
PRODUCTION CO:   Auteur Film Works / Zeehad Haque Films
DIRECTOR:        Zeehad Haque (Ph: +880 1712-XXXXXX)
PRODUCER:        Independent Cine Guild
DATE:            OCTOBER 24, 2026
CREW CALL:       06:30 AM (Breakfast Ready at 06:00 AM)
SHOOTING CALL:   07:15 AM
WEATHER FORECAST: Overcast, 28°C / 82°F, Humidity 68%, Light haze
SUNRISE:         05:58 AM  |  SUNSET: 05:24 PM
NEAREST HOSPITAL: Gazipur Central Medical Hospital, Station Road, Gazipur
                 Emergency Room Dispatch: +880 2-926XXXX / Dial 999
--------------------------------------------------------------------------------
LOCATION 1 (MORNING):
Address:         Old Railway Junction, Sreepur, Gazipur
Parking:         East gate lot (Pass code: REEL-24)
Basecamp:        Station Master Dormitory Hall
--------------------------------------------------------------------------------
SCENE BREAKDOWN:
SCENE | D/N | PAGES | LOCATION / DESCRIPTION                          | CAST
--------------------------------------------------------------------------------
SC. 14| DAY | 1 4/8 | EXT. RAILWAY PLATFORM - JAHID MEETS RAFIA      | [1], [2]
SC. 15| DAY | 2 1/8 | INT. THIRD-CLASS COMPARTMENT - TICKET DISPUTE  | [1], [3], BG
SC. 18| DUSK| 0 6/8 | EXT. SIGNAL TOWER - JAHID BURNS THE TELEGRAM   | [1]
--------------------------------------------------------------------------------
CAST SCHEDULE:
ID | CHARACTER   | ACTOR NAME         | PICKUP   | CALL TIME| H/MU     | ON SET
--------------------------------------------------------------------------------
[1]| JAHID       | Arman Chowdhury    | 05:30 AM | 06:15 AM | 06:30 AM | 07:15 AM
[2]| RAFIA       | Nusrat Jahan       | 05:45 AM | 06:30 AM | 06:45 AM | 07:30 AM
[3]| TICKET MAN  | Tarek Masud K.     | 06:30 AM | 07:15 AM | 07:30 AM | 08:15 AM
BG | PASSENGERS  | 14 Background Extra| On Site  | 07:00 AM | Wardrobe | 07:45 AM
--------------------------------------------------------------------------------
CAMERA & LIGHTING GEAR ORDER:
- A-Camera: RED V-Raptor 8K VV / Sony FX6 Rigged
- Lenses: Cooke Anamorphic /i Prime Set (25mm, 35mm, 50mm, 75mm, 100mm)
- Filters: Firecrest IRND 0.6, 1.2, 1.8 | 1/8 Black Pro-Mist
- Lighting: Aputure 600d Pro (x2), 300c RGBWW (x2), 4x4 Solid Floppies (x4)
--------------------------------------------------------------------------------
IMPORTANT SAFETY & ADVANCE NOTICES:
1. Live active tracks: DO NOT step onto rails without the Safety Officer whistle.
2. Rain contingency: Cover all electrical distro boxes with rubber tarps.
3. Quiet on set protocol: Mobile phones MUST be placed on Airplane Mode.
================================================================================`,
  },
  {
    id: 'camera-log-sheet',
    title: '35mm & Digital Cinema Camera Report Log',
    bengaliTitle: 'ক্যামেরা রিপোর্ট ও রোল লগ শিট',
    category: 'Camera Department',
    description: '2nd AC camera report log tracking reel numbers, media cards, lenses, T-stops, filter stacks, and director notes.',
    fileFormat: 'TEXT / SPREADSHEET',
    fileSizeEst: '9 KB',
    content: `================================================================================
                       CINEMATOGRAPHY CAMERA REPORT LOG
================================================================================
ROLL / CARD: A004        CAMERA: A-CAM (Sony FX6)       FORMAT: 4K DCI XAVC-I
FPS: 24.000             SHUTTER: 180.0° (1/48s)        GAMMA: S-Log3 / S-Gamut3.Cine
BASE ISO: 800           WHITE BALANCE: 4300K           COLOR TEMP: Custom Gel
--------------------------------------------------------------------------------
SCENE | TAKE | LENS  | T-STOP | ND FILTER | FOCUS (FT) | SOUND ROLL | STATUS / NOTES
--------------------------------------------------------------------------------
14A   | 01   | 35mm  | T/2.8  | ND 1.2    | 6' 4"      | SR-002     | FS (False Start)
14A   | 02   | 35mm  | T/2.8  | ND 1.2    | 6' 2"      | SR-002     | Soft focus on turn
14A   | 03   | 35mm  | T/2.8  | ND 1.2    | 6' 3"      | SR-002     | GOOD (PRINT TAKE)
14B   | 01   | 75mm  | T/2.0  | ND 1.8    | 4' 1"      | SR-002     | Sound boom in frame
14B   | 02   | 75mm  | T/2.0  | ND 1.8    | 4' 0"      | SR-002     | Eye reflection crisp
14B   | 03   | 75mm  | T/2.0  | ND 1.8    | 4' 0"      | SR-002     | BEST (DIRECTOR PICK)
15    | 01   | 24mm  | T/4.0  | Clear     | 3' 8"      | SR-003     | Handheld train wobble
--------------------------------------------------------------------------------
DIT VERIFICATION CHECKSUM:
- Checksum Algorithm: MD5 & xxHash64 Verified
- Backup 1: Dual NVMe RAID Shuttle (Master)
- Backup 2: LTO-8 Tape Archive (Offsite Copy)
- DIT Technician Signature: _______________________
================================================================================`,
  },
  {
    id: 'sound-report-sheet',
    title: 'Location Sound Mixer Audio Log',
    bengaliTitle: 'লোকেশন সাউন্ড রেকর্ডিস্ট অডিও লগ',
    category: 'Sound Department',
    description: 'Field audio log tracking multi-track boom and lavalier assignments, track levels, frequency bands, and room tone marks.',
    fileFormat: 'TEXT / DAW SYNC',
    fileSizeEst: '8 KB',
    content: `================================================================================
                     LOCATION SOUND MIXER DAILY AUDIO REPORT
================================================================================
PRODUCTION: "CHAKRA"                  DATE: OCTOBER 24, 2026
SOUND MIXER: Kabir Hossain            RECORDER: Sound Devices 833 / Scorpio
SAMPLE RATE: 48.000 kHz / 24-bit      TIMECODE: 24.000 fps SMPTE (LTC Jammed)
MEDIA ROLL: SOUND_ROLL_002            HEADER: Broadcast Wave (BWF / Polyphonic)
--------------------------------------------------------------------------------
TRACK ASSIGNMENT ROSTER:
Tr 1: Mix Left (Boom + Lavs Production Reference)
Tr 2: Mix Right (Backup Limiter -6dB)
Tr 3: Boom 1 (Sennheiser MKH 50 Hypercardioid - Overhead Jahid)
Tr 4: Boom 2 (Schoeps CMIT 5U Shotgun - Exterior Ambience / Rafia)
Tr 5: Lav 1 (DPA 4060 - Jahid Chest Conceal behind linen button)
Tr 6: Lav 2 (Sanken COS-11D - Rafia Scarf Conceal)
Tr 7: Plant Mic (Tram TR50 under train window frame)
--------------------------------------------------------------------------------
TAKE LOG:
FILE NAME      | SCENE | TAKE | DURATION | TRK PEAKS | NOTES / ISSUES
--------------------------------------------------------------------------------
CHAK_T042.WAV  | 14A   | 01   | 01:24    | -14 dB    | Diesel engine honk at 0:42
CHAK_T043.WAV  | 14A   | 02   | 02:10    | -10 dB    | Cloth rustle on Jahid turn
CHAK_T044.WAV  | 14A   | 03   | 01:58    | -08 dB    | CLEAN TAKE (PRINT)
CHAK_T045.WAV  | 14_RT | 01   | 01:10    | -32 dB    | ROOM TONE (Platform Wind)
--------------------------------------------------------------------------------
NOTES TO DIALOGUE EDITOR:
"Scene 14A Take 3 has pristine boom audio with zero phase cancellation.
Use Track 3 for main dialogue. Track 4 has distant birds useful for fill."
================================================================================`,
  },
  {
    id: 'directors-shot-list',
    title: 'Director & DP Master Shot List',
    bengaliTitle: 'পরিচালক ও ডিওপি মাস্টার শট লিস্ট',
    category: 'Directing & Coverage',
    description: 'Complete shot list with shot sizing, camera movement, lens choice, emotional intent, and setup order.',
    fileFormat: 'TEXT / PRINTABLE',
    fileSizeEst: '10 KB',
    content: `================================================================================
                    DIRECTOR & DP MASTER SHOT LIST
================================================================================
SCENE: 14 - EXT. RAILWAY PLATFORM - JAHID CONFRONTS RAFIA
EMOTIONAL INTENT: Claustrophobia in a public open space; isolation of two lovers.
KEY CONTRAST RATIO: 6:1 (Strong autumn rim light, deep shadow face)
--------------------------------------------------------------------------------
SHOT | SIZE | ANGLE | MOVEMENT | LENS  | RIG    | DESCRIPTION & SUBTEXT
--------------------------------------------------------------------------------
14.1 | ELS  | High  | Locked   | 24mm  | Sticks | Master Shot. Jahid stands alone on
     |      |       |          |       |        | platform. Trains pass in BG.
14.2 | MS   | Eye   | Slow Push| 35mm  | Dolly  | Push into Jahid as footsteps
     |      |       | In (3ft) |       |        | approach. Heartbeat anticipation.
14.3 | OTS  | Low   | Static   | 50mm  | Sticks | Over Jahid shoulder to Rafia.
     |      |       |          |       |        | Rafia refuses to look him in eye.
14.4 | OTS  | Eye   | Static   | 50mm  | Sticks | Reverse Over Rafia to Jahid.
     |      |       |          |       |        | Eyeline calibrated 2° left of lens.
14.5 | MCU  | Dutch | Handheld | 75mm  | EasyRig| Jahid realization of betrayal.
     |      | (8°)  | Breathing|       |        | Micro-tremor lens movement.
14.6 | ECU  | Level | Static   | 100mm | Macro  | Rafia hand crushing train ticket.
     |      |       |          |       |        | Paper fiber rips. Metaphor for bond.
--------------------------------------------------------------------------------
ESTIMATED TIME TO SHOOT: 3 Hours 15 Minutes
NUMBER OF SETUPS: 6 Setups
LIGHTING CHANGES: Turn 180° for Shots 14.4 & 14.5 (Relocate Key bounce)
================================================================================`,
  },
  {
    id: 'micro-budget-breakdown',
    title: 'Indie Micro-Budget Film Production Calculator',
    bengaliTitle: 'ইন্ডি মাইক্রো-বাজেট চলচ্চিত্র হিসাব খসড়া',
    category: 'Producing & Finance',
    description: 'Realistic micro-budget financial breakdown for an independent feature or festival short film, accounting for gear, food, insurance, and post.',
    fileFormat: 'TEXT / FINANCIAL BUDGET',
    fileSizeEst: '11 KB',
    content: `================================================================================
             INDEPENDENT MICRO-BUDGET FILM COST BREAKDOWN
================================================================================
PROJECT: INDIE SHORT FILM (18 MIN RUNTIME) | SHOOTING DAYS: 5 DAYS
ESTIMATED TOTAL BUDGET: $4,500 USD / ~5,20,000 BDT
--------------------------------------------------------------------------------
DEPARTMENT                    | ALLOCATED ($) | BDT EQUIV   | % OF TOTAL
--------------------------------------------------------------------------------
1. CAMERA & OPTICS GEAR RENTAL| $850.00       | 1,00,000 BDT| 18.9%
   - Cinema Camera package, Prime set, Wireless follow-focus, Filters
2. LIGHTING & GRIP PACKAGE    | $550.00       | 65,000 BDT  | 12.2%
   - High-CRI LED fixtures, C-Stands, Floppies, Diffusion roll
3. SOUND GEAR & BOOM OP       | $600.00       | 70,000 BDT  | 13.3%
   - 32-bit float field recorder, Hypercardioid boom, 2x Lavs
4. CAST STIPENDS (3 Actors)   | $750.00       | 88,000 BDT  | 16.7%
   - 5 Days honorarium + rehearsal dinner
5. LOCATION PERMITS & PASSES  | $300.00       | 35,000 BDT  | 6.7%
6. CATERING & ON-SET CRAFT    | $500.00       | 60,000 BDT  | 11.1%
   - Hot meals, tea, glucose water, snacks (Never starve your crew!)
7. WARDROBE, PROPS & ART DEPT | $300.00       | 35,000 BDT  | 6.7%
8. POST-PRODUCTION & COLOR    | $450.00       | 52,000 BDT  | 10.0%
   - Hard drives, DaVinci Resolve colorist, Foley artist
9. FESTIVAL ENTRY CONTINGENCY | $200.00       | 25,000 BDT  | 4.4%
--------------------------------------------------------------------------------
GOLDEN RULE OF MICRO-BUDGET:
"Spend 20% on image, 30% on sound, 30% on food and cast comfort, and 20% on
story location. Bad food ruins morale faster than broken equipment."
================================================================================`,
  },
];
