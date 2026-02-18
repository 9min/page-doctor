import Dexie, { type EntityTable } from "dexie";
import type { AnalysisRecord, ScheduleRecord, SettingRecord } from "@/types";

class PageDoctorDB extends Dexie {
  analyses!: EntityTable<AnalysisRecord, "id">;
  settings!: EntityTable<SettingRecord, "key">;
  schedules!: EntityTable<ScheduleRecord, "id">;

  constructor() {
    super("PageDoctorDB");

    this.version(1).stores({
      analyses: "++id, url, strategy, analyzedAt, [url+strategy]",
      settings: "key",
    });

    this.version(2).stores({
      analyses: "++id, url, strategy, analyzedAt, [url+strategy], [url+analyzedAt]",
      settings: "key",
    });

    this.version(3).stores({
      analyses: "++id, url, strategy, analyzedAt, [url+strategy], [url+analyzedAt]",
      settings: "key",
      schedules: "++id, url, [url+strategy], nextRunAt, enabled",
    });
  }
}

export const db = new PageDoctorDB();
