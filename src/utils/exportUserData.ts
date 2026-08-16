/**
 * SplitsBug — Account Data Export
 * ------------------------------------------------------------
 * Builds a polished, multi-sheet .xlsx "account statement" for a user,
 * from the data your app actually reads out of Firestore.
 *
 * Field names below match your REAL Firestore documents (the sample you
 * pasted in), not the earlier placeholder JSON — e.g. `avatar` not
 * `photoURL`, `dob` not `dateOfBirth`, `appTheme`/`themeColor` not `theme`,
 * and expenses/comments living as sub-arrays inside each group document
 * rather than a separate top-level collection. If your real shape differs
 * from this (e.g. `allExpenses` really is a separate collection, or
 * `activities`/`notifications` have a different schema), adjust the
 * `FirebaseUserExport` types and the two sheet builders flagged
 * "ADJUST WHEN SCHEMA CONFIRMED" below — everything else stays the same.
 *
 * npm install exceljs
 */

import ExcelJS from "exceljs";

// ---------------------------------------------------------------------------
// 1. Types — mirror your Firestore documents exactly. No invented fields.
// ---------------------------------------------------------------------------

export interface FirebaseUser {
  email: string;
  name: string;
  avatar?: string; // profile picture URL
  phone?: string;
  dob?: string; // "DD/MM/YYYY" as stored
  appTheme?: string; // "system" | "light" | "dark"
  themeColor?: string;
  emailNotifs?: boolean;
  createdAt: string; // ISO string
  lastActiveAt?: number; // epoch ms
}

export interface GroupExpense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  paidBy: string;
  participants: string[];
  splitAmong: number;
  timestamp: number; // epoch ms
}

export interface GroupComment {
  id: string;
  authorEmail: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export interface FirebaseGroup {
  id: string;
  name: string;
  type?: string; // e.g. "Trip"
  currency: string;
  createdAt: number; // epoch ms
  createdBy: string;
  members: string[];
  roles?: Record<string, string>;
  startDate?: string | null;
  endDate?: string | null;
  expenses?: GroupExpense[];
  comments?: GroupComment[];
}

// ADJUST WHEN SCHEMA CONFIRMED — placeholder shape until the real
// activities/notifications documents can be shared.
export interface ActivityItem {
  type: string;
  description: string;
  groupId?: string;
  timestamp: number;
}

export interface NotificationItem {
  title: string;
  body: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export interface FirebaseUserExport {
  user: FirebaseUser;
  groups: FirebaseGroup[];
  activities?: ActivityItem[];
  notifications?: NotificationItem[];
}

// ---------------------------------------------------------------------------
// 2. Brand + style constants (pulled from the SplitsBug logo)
// ---------------------------------------------------------------------------

const BRAND = {
  navy: "0A1F4C",
  violet: "4B49FD",
  paleViolet: "EEEEFF",
  paleNavy: "E9ECF5",
  zebra: "F6F7FB",
  white: "FFFFFF",
  border: "D7DAE6",
  textMuted: "6B7280",
  positive: "1B7A3D",
  negative: "B3261E",
};

const FONT = "Calibri";

function argb(hex: string): string {
  return "FF" + hex;
}

// ---------------------------------------------------------------------------
// 3. Small formatting helpers
// ---------------------------------------------------------------------------

function fmtDateTime(input: string | number | undefined | null): Date | null {
  if (input === undefined || input === null || input === "") return null;
  const d = typeof input === "number" ? new Date(input) : new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function currencyFormat(currencyCode: string): string {
  // Excel number formats don't render arbitrary currency symbols reliably
  // across locales, so we prefix the literal symbol/code the user actually
  // uses (₹, USD, ...) and format the number with thousands separators.
  const escaped = currencyCode.replace(/"/g, '\\"');
  return `"${escaped}" #,##0.00`;
}

// ---------------------------------------------------------------------------
// 4. Sheet builders
// ---------------------------------------------------------------------------

function styleHeaderBand(ws: ExcelJS.Worksheet, rowNum: number, lastCol: number, title: string) {
  ws.mergeCells(rowNum, 1, rowNum, lastCol);
  const cell = ws.getCell(rowNum, 1);
  cell.value = title;
  cell.font = { name: FONT, size: 13, bold: true, color: { argb: argb(BRAND.white) } };
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(rowNum).height = 26;
  for (let c = 1; c <= lastCol; c++) {
    ws.getCell(rowNum, c).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: argb(BRAND.navy) },
    };
  }
}

function styleTableHeader(row: ExcelJS.Row, lastCol: number) {
  row.eachCell({ includeEmpty: false }, (cell) => {
    cell.font = { name: FONT, bold: true, size: 10.5, color: { argb: argb(BRAND.white) } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(BRAND.violet) } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: argb(BRAND.border) } },
      bottom: { style: "thin", color: { argb: argb(BRAND.border) } },
    };
  });
  row.height = 22;
}

function zebraStripe(ws: ExcelJS.Worksheet, firstDataRow: number, lastDataRow: number, firstCol: number, lastCol: number) {
  for (let r = firstDataRow; r <= lastDataRow; r++) {
    if ((r - firstDataRow) % 2 === 1) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = ws.getCell(r, c);
        if (!cell.fill || (cell.fill as ExcelJS.FillPattern).fgColor === undefined) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(BRAND.zebra) } };
        }
      }
    }
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(r, c);
      cell.border = {
        bottom: { style: "hair", color: { argb: argb(BRAND.border) } },
      };
    }
  }
}

function addLogo(wb: ExcelJS.Workbook, ws: ExcelJS.Worksheet, logoBuffer: Buffer | undefined, anchorRow: number) {
  if (!logoBuffer) return 0;
  const imageId = wb.addImage({ buffer: logoBuffer as any, extension: "png" });
  // Small mark, top-left, ~120x92px, floating above the header band.
  ws.addImage(imageId, {
    tl: { col: 0.12, row: anchorRow - 1 + 0.05 } as any,
    ext: { width: 104, height: 79 },
  });
  return 1;
}

// --- Profile sheet ----------------------------------------------------------

function buildProfileSheet(wb: ExcelJS.Workbook, data: FirebaseUserExport, logoBuffer?: Buffer) {
  const ws = wb.addWorksheet("Profile", {
    properties: { tabColor: { argb: argb(BRAND.navy) } },
    pageSetup: { fitToPage: true, fitToWidth: 1 },
  });
  ws.columns = [{ width: 16 }, { width: 26 }, { width: 46 }, { width: 4 }];

  ws.getRow(1).height = 24;
  ws.getRow(2).height = 24;
  ws.getRow(3).height = 24;
  ws.getRow(4).height = 10;
  ws.mergeCells("A1:A4");
  addLogo(wb, ws, logoBuffer, 1);

  // Title band (offset right of the logo mark)
  ws.mergeCells("B1:D2");
  const title = ws.getCell("B1");
  title.value = "SplitsBug — Account Statement";
  title.font = { name: FONT, size: 16, bold: true, color: { argb: argb(BRAND.navy) } };
  title.alignment = { horizontal: "left", vertical: "bottom" };

  ws.mergeCells("B3:D3");
  const sub = ws.getCell("B3");
  sub.value = `Generated ${new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}`;
  sub.font = { name: FONT, size: 10, italic: true, color: { argb: argb(BRAND.textMuted) } };

  let r = 6;
  styleHeaderBand(ws, r, 3, "Profile Details");
  r += 1;

  const rows: Array<[string, string | number | Date | { text: string; hyperlink: string } | null]> = [
    ["Name", data.user.name],
    ["Email", data.user.email],
    ["Phone", data.user.phone ?? "—"],
    ["Date of Birth", data.user.dob ?? "—"],
    [
      "Profile Picture",
      data.user.avatar ? { text: "View profile picture ↗", hyperlink: data.user.avatar } : "—",
    ],
    ["App Theme", data.user.appTheme ?? "—"],
    ["Theme Colour", data.user.themeColor ?? "—"],
    ["Email Notifications", data.user.emailNotifs === undefined ? "—" : data.user.emailNotifs ? "On" : "Off"],
    ["Account Created", fmtDateTime(data.user.createdAt) ?? (data.user.createdAt ?? "—")],
    ["Last Active", fmtDateTime(data.user.lastActiveAt) ?? "—"],
  ];

  const firstDataRow = r;
  for (const [label, value] of rows) {
    const labelCell = ws.getCell(r, 2);
    labelCell.value = label;
    labelCell.font = { name: FONT, bold: true, size: 10.5, color: { argb: argb(BRAND.navy) } };
    labelCell.alignment = { vertical: "middle" };

    const valueCell = ws.getCell(r, 3);
    if (value instanceof Date) {
      valueCell.value = value;
      valueCell.numFmt = "dd mmm yyyy, hh:mm AM/PM";
    } else if (value && typeof value === "object" && "hyperlink" in value) {
      valueCell.value = { text: value.text, hyperlink: value.hyperlink };
      valueCell.font = { name: FONT, size: 10.5, color: { argb: argb(BRAND.violet) }, underline: true };
    } else {
      valueCell.value = value ?? "—";
      valueCell.font = { name: FONT, size: 10.5 };
    }
    ws.getRow(r).height = 20;
    r++;
  }
  zebraStripe(ws, firstDataRow, r - 1, 2, 3);

  ws.views = [{ state: "frozen", ySplit: 5 }];
  return ws;
}

// --- Groups sheet ------------------------------------------------------------

function buildGroupsSheet(wb: ExcelJS.Workbook, data: FirebaseUserExport) {
  const ws = wb.addWorksheet("Groups", {
    properties: { tabColor: { argb: argb(BRAND.violet) } },
    pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0, orientation: "landscape" },
  });
  const headers = ["Group Name", "Type", "Currency", "Members", "Your Role", "Created By", "Created On", "Start Date", "End Date", "# Expenses", "# Comments"];
  ws.columns = headers.map((h, i) => ({
    width: i === 0 ? 26 : i === 3 ? 32 : 16,
  }));

  styleHeaderBand(ws, 1, headers.length, "Groups & Memberships");
  const headerRow = ws.getRow(2);
  headerRow.values = headers;
  styleTableHeader(headerRow, headers.length);

  let r = 3;
  const firstDataRow = r;
  for (const g of data.groups) {
    const myRole = g.roles?.[data.user.email] ?? "—";
    ws.getRow(r).values = [
      g.name,
      g.type ?? "—",
      g.currency,
      (g.members ?? []).join(", "),
      myRole,
      g.createdBy,
      fmtDateTime(g.createdAt) ?? "—",
      g.startDate ?? "—",
      g.endDate ?? "—",
      g.expenses?.length ?? 0,
      g.comments?.length ?? 0,
    ];
    const createdCell = ws.getCell(r, 7);
    if (createdCell.value instanceof Date) createdCell.numFmt = "dd mmm yyyy";
    ws.getRow(r).alignment = { vertical: "middle", wrapText: false };
    ws.getCell(r, 5).font = { name: FONT, bold: true, color: { argb: argb(BRAND.navy) } };
    r++;
  }
  zebraStripe(ws, firstDataRow, r - 1, 1, headers.length);
  ws.views = [{ state: "frozen", ySplit: 2 }];
  ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: headers.length } };
  return ws;
}

// --- Expenses sheet (flattened across every group) --------------------------

function buildExpensesSheet(wb: ExcelJS.Workbook, data: FirebaseUserExport) {
  const ws = wb.addWorksheet("Expenses", {
    properties: { tabColor: { argb: argb(BRAND.violet) } },
    pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0, orientation: "landscape" },
  });
  const headers = ["Date", "Group", "Description", "Category", "Paid By", "Amount", "Currency", "Split Among", "Participants", "Your Share"];
  ws.columns = [
    { width: 14 }, { width: 22 }, { width: 26 }, { width: 20 }, { width: 24 },
    { width: 14 }, { width: 10 }, { width: 12 }, { width: 34 }, { width: 14 },
  ];

  styleHeaderBand(ws, 1, headers.length, "Expenses & Settlements (all groups)");
  const headerRow = ws.getRow(2);
  headerRow.values = headers;
  styleTableHeader(headerRow, headers.length);

  let r = 3;
  const firstDataRow = r;
  const amountColLetter = "F";
  const shareColLetter = "J";

  for (const g of data.groups) {
    for (const e of g.expenses ?? []) {
      const isSettlement = e.description === "Payment"; // your data marks settlements this way (no `category`)
      const splitAmong = e.splitAmong || (e.participants?.length ?? 1);
      const yourShare =
        e.participants?.includes(data.user.email) && splitAmong > 0 ? e.amount / splitAmong : 0;

      ws.getRow(r).values = [
        fmtDateTime(e.timestamp) ?? "—",
        g.name,
        e.description,
        isSettlement ? "Settlement" : e.category ?? "Uncategorized",
        e.paidBy,
        e.amount,
        e.currency,
        splitAmong,
        (e.participants ?? []).join(", "),
        yourShare,
      ];

      const dateCell = ws.getCell(r, 1);
      if (dateCell.value instanceof Date) dateCell.numFmt = "dd mmm yyyy";

      const amtCell = ws.getCell(r, 6);
      amtCell.numFmt = currencyFormat(e.currency);
      amtCell.font = { name: FONT, bold: true, color: { argb: argb(isSettlement ? BRAND.positive : BRAND.navy) } };

      const shareCell = ws.getCell(r, 10);
      shareCell.numFmt = currencyFormat(e.currency);
      shareCell.font = { name: FONT, color: { argb: argb(BRAND.textMuted) } };

      if (isSettlement) {
        ws.getCell(r, 4).font = { name: FONT, italic: true, color: { argb: argb(BRAND.positive) } };
      }
      r++;
    }
  }
  const lastDataRow = r - 1;
  zebraStripe(ws, firstDataRow, lastDataRow, 1, headers.length);

  // Totals row with a real formula, not a hardcoded number.
  ws.mergeCells(r, 1, r, 5);
  const totalLabel = ws.getCell(r, 1);
  totalLabel.value = "Total";
  totalLabel.font = { name: FONT, bold: true, color: { argb: argb(BRAND.white) } };
  totalLabel.alignment = { horizontal: "right", vertical: "middle" };
  for (let c = 1; c <= headers.length; c++) {
    ws.getCell(r, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: argb(BRAND.navy) } };
  }
  const currenciesUsed = new Set(data.groups.flatMap((g) => (g.expenses ?? []).map((e) => e.currency)));
  const totalCell = ws.getCell(r, 6);
  totalCell.value = { formula: `SUM(${amountColLetter}${firstDataRow}:${amountColLetter}${lastDataRow})` } as any;
  totalCell.font = { name: FONT, bold: true, color: { argb: argb(BRAND.white) } };
  totalCell.numFmt = currenciesUsed.size === 1 ? currencyFormat([...currenciesUsed][0]) : "#,##0.00";
  ws.getRow(r).height = 22;
  if (currenciesUsed.size > 1) {
    const note = ws.getCell(r, 7);
    note.value = "mixed currencies — see Currency column per row";
    note.font = { name: FONT, italic: true, size: 9, color: { argb: argb(BRAND.white) } };
  }

  ws.views = [{ state: "frozen", ySplit: 2 }];
  ws.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: headers.length } };
  return ws;
}

// --- Activities sheet (ADJUST WHEN SCHEMA CONFIRMED) -------------------------

function buildActivitiesSheet(wb: ExcelJS.Workbook, data: FirebaseUserExport) {
  if (!data.activities || data.activities.length === 0) return;
  const ws = wb.addWorksheet("Activity", {
    properties: { tabColor: { argb: argb(BRAND.paleNavy) } },
    pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  const headers = ["Date", "Type", "Description", "Group"];
  ws.columns = [{ width: 18 }, { width: 18 }, { width: 46 }, { width: 22 }];

  styleHeaderBand(ws, 1, headers.length, "Activity Log");
  const headerRow = ws.getRow(2);
  headerRow.values = headers;
  styleTableHeader(headerRow, headers.length);

  let r = 3;
  const firstDataRow = r;
  for (const a of data.activities) {
    ws.getRow(r).values = [fmtDateTime(a.timestamp) ?? "—", a.type, a.description, a.groupId ?? "—"];
    const dateCell = ws.getCell(r, 1);
    if (dateCell.value instanceof Date) dateCell.numFmt = "dd mmm yyyy, hh:mm AM/PM";
    r++;
  }
  zebraStripe(ws, firstDataRow, r - 1, 1, headers.length);
  ws.views = [{ state: "frozen", ySplit: 2 }];
}

// --- Notifications sheet (ADJUST WHEN SCHEMA CONFIRMED) -----------------------

function buildNotificationsSheet(wb: ExcelJS.Workbook, data: FirebaseUserExport) {
  if (!data.notifications || data.notifications.length === 0) return;
  const ws = wb.addWorksheet("Notifications", {
    properties: { tabColor: { argb: argb(BRAND.paleNavy) } },
    pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });
  const headers = ["Date", "Title", "Message", "Type", "Read"];
  ws.columns = [{ width: 18 }, { width: 24 }, { width: 46 }, { width: 16 }, { width: 10 }];

  styleHeaderBand(ws, 1, headers.length, "Notifications");
  const headerRow = ws.getRow(2);
  headerRow.values = headers;
  styleTableHeader(headerRow, headers.length);

  let r = 3;
  const firstDataRow = r;
  for (const n of data.notifications) {
    ws.getRow(r).values = [fmtDateTime(n.createdAt) ?? "—", n.title, n.body, n.type, n.read ? "Read" : "Unread"];
    const dateCell = ws.getCell(r, 1);
    if (dateCell.value instanceof Date) dateCell.numFmt = "dd mmm yyyy, hh:mm AM/PM";
    const readCell = ws.getCell(r, 5);
    readCell.font = { name: FONT, bold: true, color: { argb: argb(n.read ? BRAND.textMuted : BRAND.violet) } };
    r++;
  }
  zebraStripe(ws, firstDataRow, r - 1, 1, headers.length);
  ws.views = [{ state: "frozen", ySplit: 2 }];
}

// ---------------------------------------------------------------------------
// 5. Entry point
// ---------------------------------------------------------------------------

export interface ExportOptions {
  /** PNG buffer of the SplitsBug logo (convert the SVG once at build time). */
  logoPngBuffer?: Buffer;
}

export async function generateUserDataExport(
  data: FirebaseUserExport,
  options: ExportOptions = {}
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SplitsBug";
  wb.created = new Date();
  wb.properties.date1904 = false;

  buildProfileSheet(wb, data, options.logoPngBuffer);
  buildGroupsSheet(wb, data);
  buildExpensesSheet(wb, data);
  buildActivitiesSheet(wb, data);
  buildNotificationsSheet(wb, data);

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Example usage in an API route (e.g. Astro endpoint):
 *
 *   import { generateUserDataExport } from "./exportUserData";
 *   import fs from "node:fs";
 *
 *   export async function GET({ locals }) {
 *     const logo = fs.readFileSync("./src/assets/logo-full.png"); // pre-converted from SVG once
 *     const buffer = await generateUserDataExport(firestoreData, { logoPngBuffer: logo });
 *     return new Response(buffer, {
 *       headers: {
 *         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
 *         "Content-Disposition": `attachment; filename="splitsbug-account-export.xlsx"`,
 *       },
 *     });
 *   }
 */
