// deno run --allow-all scrape.ts <quarter> <jlinksessionidx> <itscookie>

import { join as joinPath } from "std/path/mod";
import { ExamCodes, InstructionCodes } from "./meeting-types";
import { Period, Time } from "../util/Time";

export type RawSearchLoadSubjectResult = {
  LONG_DESC: string;
  SUBJECT_CODE: string;
};

export type RawSearchLoadDepartmentResult = {
  DEP_CODE: string;
  DEP_DESC: string;
};

export type RawSearchByAllResult = {
  UNIT_TO: number;
  SUBJ_CODE: string;
  UNIT_INC: number;
  CRSE_TITLE: string;
  UNIT_FROM: number;
  CRSE_CODE: string;
};

type CommonRawSectionResult = {
  END_MM_TIME: number;
  LONG_DESC: string;
  BEGIN_HH_TIME: number;
  PRIMARY_INSTR_FLAG: "Y" | " ";
  ROOM_CODE: string;
  END_HH_TIME: number;
  START_DATE: string;
  DAY_CODE: string;
  BEGIN_MM_TIME: number;
  PERSON_FULL_NAME: string;
  FK_SPM_SPCL_MTG_CD: "  " | "TBA" | ExamCodes;
  BLDG_CODE: string;
  FK_CDI_INSTR_TYPE: InstructionCodes;
  SECT_CODE: string;
};

export interface RawSearchLoadGroupDataResult extends CommonRawSectionResult {
  SCTN_CPCTY_QTY: number;
  SCTN_ENRLT_QTY: number;
  SECTION_NUMBER: string;
  SECTION_START_DATE: string;
  STP_ENRLT_FLAG: "Y" | "N";
  SECTION_END_DATE: string;
  COUNT_ON_WAITLIST: number;
  BEFORE_DESC: " " | "AC" | "NC";
  PRINT_FLAG: " " | "N" | "Y" | "5";
  FK_SST_SCTN_STATCD: "AC" | "NC" | "CA";
  AVAIL_SEAT: number;
}

export interface RawGetClassResult extends CommonRawSectionResult {
  TERM_CODE: string;
  SECT_CREDIT_HRS: number;
  SECTION_NUMBER: number;
  SUBJ_CODE: string;
  GRADE_OPTN_CD_PLUS: " " | "+";
  WT_POS: string;
  FK_PCH_INTRL_REFID: number;
  CRSE_TITLE: string;
  GRADE_OPTION: "L" | "P" | "P/NP" | "S" | "S/U" | "H" | " ";
  CRSE_CODE: string;
  NEED_HEADROW: boolean;
  PERSON_ID: string;
  SECT_CREDIT_HRS_PL: " " | "+";
  SECTION_HEAD: number;
  ENROLL_STATUS: "EN" | "WT" | "PL";
  FK_SEC_SCTN_NUM: number;
}
