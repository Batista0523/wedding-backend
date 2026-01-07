import db from "../config/db.config";

export interface Guest {
  id?: string;
  full_name: string;
  status?: "pending" | "confirmed" | "declined";
  has_plus_one?: boolean;
  plus_one_name?: string | null;
  attendance?: "ceremony" | "celebration" | "both";
  responded_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllGuests = async (): Promise<Guest[]> => {
  return db.any<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       has_plus_one,
       plus_one_name,
       attendance,
       responded_at,
       created_at,
       updated_at
     FROM guests
     ORDER BY full_name`
  );
};

export const searchGuestsByName = async (search: string): Promise<Guest[]> => {
  return await db.any<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       has_plus_one,
       plus_one_name,
       responded_at
     FROM guests
     WHERE full_name ILIKE $1 || '%'
     ORDER BY full_name
     LIMIT 10`,
    [search]
  );
};


export const getGuestById = async (id: string): Promise<Guest | null> => {
  return db.oneOrNone<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       has_plus_one,
       plus_one_name,
       attendance,
       responded_at,
       created_at,
       updated_at
     FROM guests
     WHERE id = $1`,
    [id]
  );
};

export const updateGuestStatus = async (
  id: string,
  status: "confirmed" | "declined",
  hasPlusOne: boolean,
  plusOneName: string | undefined,
  attendance: "ceremony" | "celebration" | "both"
): Promise<Guest | null> => {
  return db.oneOrNone<Guest>(
    `UPDATE guests
     SET
       status = $2,
       has_plus_one = $3,
       plus_one_name = $4,
       attendance = $5,
       responded_at = NOW(),
       updated_at = NOW()
     WHERE id = $1
     RETURNING
       id,
       full_name,
       status,
       has_plus_one,
       plus_one_name,
       attendance,
       responded_at,
       updated_at`,
    [id, status, hasPlusOne, plusOneName || null, attendance]
  );
};

export const getGuestStats = async (): Promise<
  { status: string; total: number }[]
> => {
  return db.any(
    `SELECT status, COUNT(*)::int AS total
     FROM guests
     GROUP BY status`
  );
};
