import Dexie, { type EntityTable } from "dexie";
import type { AnalysisRecord, SettingRecord } from "@/types";

class PageDoctorDB extends Dexie {
  analyses!: EntityTable<AnalysisRecord, "id">;
  settings!: EntityTable<SettingRecord, "key">;

  constructor() {
    super("PageDoctorDB");

    this.version(1).stores({
      analyses: "++id, url, strategy, analyzedAt, [url+strategy]",
      settings: "key",
    });
  }
}

export const db = new PageDoctorDB();
